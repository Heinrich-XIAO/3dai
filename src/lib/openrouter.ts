import { OpenRouter } from '@openrouter/sdk'
import type { ChatGenerationParams, ChatResponse } from '@openrouter/sdk/models'
import { z, ZodError } from 'zod'

const openRouter = new OpenRouter()
const DEFAULT_MODEL = 'openai/gpt-4o-mini'

export class OpenRouterConfigError extends Error {}
export class OpenRouterInputError extends Error {}

const messageSchema = z
  .object({
    role: z.string(),
  })
  .passthrough()

const openRouterChatSchema = z
  .object({
    messages: z.array(messageSchema).min(1),
    model: z.string().optional(),
    stream: z.boolean().optional(),
  })
  .passthrough()

export type OpenRouterChatInput = z.infer<typeof openRouterChatSchema>

export function parseOpenRouterChatInput(
  payload: unknown,
): OpenRouterChatInput {
  try {
    return openRouterChatSchema.parse(payload)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new OpenRouterInputError(error.message)
    }
    throw error
  }
}

export async function sendOpenRouterChat(
  payload: OpenRouterChatInput,
): Promise<ChatResponse> {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new OpenRouterConfigError('OPENROUTER_API_KEY is not set')
  }

  const { stream, model: rawModel, ...rest } = payload

  const model = rawModel ?? DEFAULT_MODEL

  if (stream) {
    throw new OpenRouterInputError('streaming responses are not supported yet')
  }

  const chatParams = {
    ...rest,
    model,
    stream: false,
  } as ChatGenerationParams

  return openRouter.chat.send(chatParams) as Promise<ChatResponse>
}
