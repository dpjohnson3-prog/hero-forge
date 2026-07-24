import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { fileToResizedBase64 } from '../lib/imageCapture'

export function useBodyEstimate() {
  const [estimating, setEstimating] = useState(false)

  const estimateFromPhoto = async (file) => {
    setEstimating(true)
    try {
      const { base64, mediaType } = await fileToResizedBase64(file)
      const { data, error } = await supabase.functions.invoke('estimate-body-metrics', {
        body: { image: base64, mediaType },
      })
      if (error) return { error: error.message }
      if (data?.error) return { error: data.error }
      return { estimate: data }
    } catch (err) {
      return { error: err.message }
    } finally {
      setEstimating(false)
    }
  }

  return { estimateFromPhoto, estimating }
}
