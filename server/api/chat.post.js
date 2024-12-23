import { GoogleGenerativeAI } from '@google/generative-ai'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  try {
    const { messages, subject } = await readBody(event)

    // Create a chat instance
    const chat = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    })

    // System prompt
    const systemPrompt = `You are an expert AI tutor specializing in ${subject}. Your role is to:
- Provide clear, accurate, and detailed explanations
- Break down complex concepts into simpler parts
- Use examples to illustrate points when helpful
- Encourage critical thinking through Socratic questioning
- Provide step-by-step guidance when solving problems
- Use LaTeX for mathematical expressions: inline with \\( \\) and display with \\[ \\]
- Use markdown formatting for better readability
- If you're unsure about something, admit it and suggest alternatives
- Keep responses focused and relevant to the subject matter

Remember to be patient, encouraging, and adapt your explanations to the student's level of understanding.`

    // Add system prompt to chat history
    await chat.sendMessage(systemPrompt)

    // Process previous messages
    for (let i = 0; i < messages.length - 1; i++) {
      await chat.sendMessage(messages[i].content)
    }

    // Send the latest message and get response
    const result = await chat.sendMessage(messages[messages.length - 1].content)
    const response = await result.response

    return {
      role: 'assistant',
      content: response.text()
    }
  } catch (error) {
    console.error('Chat API Error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get response from AI tutor'
    })
  }
})

// Implement logic to handle file uploads, and