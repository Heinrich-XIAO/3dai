import { createFileRoute } from '@tanstack/react-router'

import {
  OpenRouterConfigError,
  OpenRouterInputError,
  parseOpenRouterChatInput,
  sendOpenRouterChat,
} from '../../lib/openrouter'

const jsonHeaders = {
  'Content-Type': 'application/json',
}

export const Route = createFileRoute('/api/openrouter')({
  server: {
    handlers: {
      GET: () =>
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: jsonHeaders,
        }),
      POST: async ({ request }) => {
        let payload: unknown

        try {
          payload = await request.json()
        } catch {
          return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
            status: 400,
            headers: jsonHeaders,
          })
        }

        try {
          const input = parseOpenRouterChatInput(payload)
          const result = await sendOpenRouterChat(input)
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: jsonHeaders,
          })
        } catch (error) {
          if (error instanceof OpenRouterInputError) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 400,
              headers: jsonHeaders,
            })
          }

          if (error instanceof OpenRouterConfigError) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: jsonHeaders,
            })
          }

          return new Response(
            JSON.stringify({
              error:
                error instanceof Error
                  ? error.message
                  : 'OpenRouter request failed',
            }),
            {
              status: 502,
              headers: jsonHeaders,
            },
          )
        }
      },
    },
  },
})
