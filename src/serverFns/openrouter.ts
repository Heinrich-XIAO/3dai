import { createServerFn } from '@tanstack/react-start'

import type { OpenRouterChatInput } from '../lib/openrouter'
import { parseOpenRouterChatInput, sendOpenRouterChat } from '../lib/openrouter'

export const openRouterChat = createServerFn({ method: 'POST' })
  .inputValidator((input: OpenRouterChatInput) => input)
  .handler(async ({ data }) => {
    const input = parseOpenRouterChatInput(data)
    return sendOpenRouterChat(input)
  })
