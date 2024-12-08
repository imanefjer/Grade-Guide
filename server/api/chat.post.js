import { OpenAIClient, AzureKeyCredential } from '@azure/openai'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const client = new OpenAIClient(
    config.AZURE_OPENAI_ENDPOINT,
    new AzureKeyCredential(config.AZURE_OPENAI_API_KEY)
  )

  try {
    const { messages } = await readBody(event)

    // Format messages for Azure OpenAI
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    // Add system message to set context as a tutor
    formattedMessages.unshift({
      role: 'system',
      content: `You are a helpful and knowledgeable tutor. 
                Provide clear, detailed explanations and encourage critical thinking. 
                Break down complex concepts into simpler parts.
                Use examples when appropriate to illustrate points.
                For mathematical expressions, you must follow these exact formats:
                1. For display math (equations on their own line):
                   \\[ ... \\]
                2. For inline math (within text):
                   $ ... $
                Never use \\( ... \\) format.
                Always use $ ... $ for inline math.
                If you're not sure about something, admit it and suggest alternatives.`
    })

    const response = await client.getChatCompletions(
      config.AZURE_OPENAI_DEPLOYMENT,
      formattedMessages,
      {
        temperature: 0.7,
        max_tokens: 800,
        presence_penalty: 0.6,
        frequency_penalty: 0.5
      }
    )

    return {
      role: 'assistant',
      content: response.choices[0].message.content
    }
  } catch (error) {
    console.error('Chat API Error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get response from AI tutor'
    })
  }
})