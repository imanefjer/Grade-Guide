import { GoogleGenerativeAI } from '@google/generative-ai'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY)
  
  try {
    const body = await readBody(event)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' })

    // Add explicit JSON formatting to the prompt
    const prompt = `${body.prompt}

    IMPORTANT: Respond ONLY with a JSON object in this exact format, no additional text or markdown:
    {
      "strengths": "one sentence about strengths",
      "improvements": "one sentence about improvements",
      "focusAreas": "one sentence about focus areas"
    }`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const analysisText = response.text()

    // Clean up the response text to ensure it's valid JSON
    const cleanedAnalysisText = analysisText
      .trim()
      // Remove any markdown code block markers
      .replace(/```json\s*|\s*```/g, '')
      // Remove any trailing commas before closing brackets/braces
      .replace(/,(\s*[}\]])/g, '$1')

    try {
      const analysis = JSON.parse(cleanedAnalysisText)
      return analysis
    } catch (parseError) {
      console.error('Failed to parse analysis JSON:', parseError)
      console.error('Raw analysis text:', analysisText)
      // Return fallback response if parsing fails
      return {
        strengths: "Shows understanding of basic concepts",
        improvements: "Could benefit from more practice",
        focusAreas: "Review core fundamentals"
      }
    }
  } catch (error) {
    console.error('Error generating analysis:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to generate analysis'
    })
  }
}) 