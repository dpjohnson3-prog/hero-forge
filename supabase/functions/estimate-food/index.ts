// Supabase Edge Function: estimate-food
//
// Takes a photo of food and returns an AI *estimate* of what it is and its
// macros. Requires the ANTHROPIC_API_KEY secret — set via
// `supabase secrets set ANTHROPIC_API_KEY=sk-ant-...`, never in client code.
// Deployed with default JWT verification, so only signed-in app users can
// call it (the client's Supabase session token is attached automatically by
// supabase.functions.invoke()).
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
          name: 'record_food_estimate',
          description:
            'Record the estimated identity and nutrition of the food shown in the photo.',
          input_schema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Short, human-readable name of the food or dish' },
              calories: { type: 'number', description: 'Estimated total calories for the portion shown' },
              protein: { type: 'number', description: 'Estimated protein in grams' },
              carbs: { type: 'number', description: 'Estimated carbohydrates in grams' },
              fat: { type: 'number', description: 'Estimated fat in grams' },
            },
            required: ['name', 'calories', 'protein', 'carbs', 'fat'],
            additionalProperties: false,
          },
          strict: true,
        },
      ],
      tool_choice: { type: 'tool', name: 'record_food_estimate' },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: image } },
            {
              type: 'text',
              text: 'Identify the food in this photo and estimate its nutrition for the portion shown. This is a rough visual estimate, not a lab measurement — give your best single best-guess numbers rather than a range.',
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
