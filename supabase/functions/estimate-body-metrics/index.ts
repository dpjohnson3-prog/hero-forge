// Supabase Edge Function: estimate-body-metrics
//
// Takes a full-body photo and returns a rough AI *estimate* of body
// measurements. Same ANTHROPIC_API_KEY secret as estimate-food, same
// default-JWT-verified deployment.
import Anthropic from 'npm:@anthropic-ai/sdk'
import { corsHeaders } from '../_shared/cors.ts'

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { image, mediaType } = await req.json()
    if (!image || !mediaType) {
      return jsonResponse({ error: 'Missing image or mediaType' }, 400)
    }

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 2048,
      thinking: { type: 'adaptive' },
      tools: [
        {
          name: 'record_body_estimate',
          description:
            'Record rough estimated body measurements visible in a full-body photo.',
          input_schema: {
            type: 'object',
            properties: {
              weight: { type: 'number', description: 'Estimated body weight in pounds' },
              chest: { type: 'number', description: 'Estimated chest circumference in inches' },
              waist: { type: 'number', description: 'Estimated waist circumference in inches' },
              arms: { type: 'number', description: 'Estimated upper-arm circumference in inches' },
              thighs: { type: 'number', description: 'Estimated thigh circumference in inches' },
              note: {
                type: 'string',
                description:
                  'One short sentence on estimate confidence, e.g. pose or lighting issues that limit accuracy',
              },
            },
            required: ['weight', 'chest', 'waist', 'arms', 'thighs', 'note'],
            additionalProperties: false,
          },
          strict: true,
        },
      ],
      tool_choice: { type: 'tool', name: 'record_body_estimate' },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: image } },
            {
              type: 'text',
              text: 'This is a full-body photo taken for a rough visual body-measurement estimate, not a precise measurement — the subject was asked to stand straight, face the camera, with arms slightly away from the body. Estimate weight (lb) and chest/waist/arm/thigh circumference (in) from visual proportions. Give your best single best-guess numbers even if the photo quality or pose is imperfect, and note any real limitations in the note field.',
            },
          ],
        },
      ],
    })

    const toolUse = response.content.find((block) => block.type === 'tool_use')
    if (!toolUse || toolUse.type !== 'tool_use') {
      return jsonResponse({ error: 'Model did not return a structured estimate' }, 502)
    }

    return jsonResponse(toolUse.input)
  } catch (err) {
    console.error(err)
    return jsonResponse({ error: 'Failed to analyze photo' }, 500)
  }
})
