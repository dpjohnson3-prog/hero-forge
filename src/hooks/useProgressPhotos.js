import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthProvider'

const todayKey = () => new Date().toISOString().slice(0, 10)
const SIGNED_URL_TTL = 60 * 60 * 24 // 24h, enough for a browsing session
const MAX_FILE_BYTES = 8 * 1024 * 1024 // 8MB

export function useProgressPhotos() {
  const { user } = useAuth()
  const [photos, setPhotos] = useState([]) // { id, date, storagePath, url }
  const [uploading, setUploading] = useState(false)

  const refresh = useCallback(async () => {
    if (!user) {
      setPhotos([])
      return
    }
    const { data: rows, error } = await supabase
      .from('progress_photos')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to load progress photos', error)
      return
    }
    if (!rows?.length) {
      setPhotos([])
      return
    }

    const paths = rows.map((r) => r.storage_path)
    const { data: signedUrls, error: signError } = await supabase.storage
      .from('progress-photos')
      .createSignedUrls(paths, SIGNED_URL_TTL)

    if (signError) console.error('Failed to sign progress photo URLs', signError)

    const urlByPath = new Map((signedUrls ?? []).map((s) => [s.path, s.signedUrl]))

    setPhotos(
      rows.map((r) => ({
        id: r.id,
        date: r.date,
        storagePath: r.storage_path,
        url: urlByPath.get(r.storage_path) ?? null,
      })),
    )
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const uploadPhoto = async (file) => {
    if (!user || !file) return { error: null }

    if (!file.type.startsWith('image/')) {
      return { error: 'Please choose an image file.' }
    }
    if (file.size > MAX_FILE_BYTES) {
      return { error: 'Image is too large (max 8MB).' }
    }

    setUploading(true)
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const path = `${user.id}/${Date.now()}-${safeName}`

    const { error: uploadError } = await supabase.storage.from('progress-photos').upload(path, file)
    if (uploadError) {
      setUploading(false)
      return { error: uploadError.message }
    }

    const { error: insertError } = await supabase
      .from('progress_photos')
      .insert({ user_id: user.id, date: todayKey(), storage_path: path })

    setUploading(false)

    if (insertError) {
      return { error: insertError.message }
    }

    await refresh()
    return { error: null }
  }

  const deletePhoto = async (photo) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id))

    const { error: removeError } = await supabase.storage
      .from('progress-photos')
      .remove([photo.storagePath])
    if (removeError) console.error('Failed to remove progress photo file', removeError)

    const { error: deleteRowError } = await supabase
      .from('progress_photos')
      .delete()
      .eq('id', photo.id)
    if (deleteRowError) console.error('Failed to remove progress photo record', deleteRowError)
  }

  return { photos, uploading, uploadPhoto, deletePhoto }
}
