// server/api/quotes.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const config = useRuntimeConfig();
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

// Fallback quotes in case the API fails
const fallbackQuotes = [
  "Every moment of study is a step towards your dreams.",
  "Knowledge is the compass that guides us through life.",
  "In science, we find the poetry of reality.",
  "Your potential is infinite, just like the universe.",
  "Small steps of learning lead to giant leaps of understanding.",
  "Curiosity is the spark that ignites discovery.",
  "Every problem solved is a victory earned.",
  "Learning is the only treasure that grows when shared.",
  "Your mind is a garden, studying helps it bloom.",
  "Science reveals the magic in everyday life."
];

export default defineEventHandler(async (event) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro-latest',
      systemInstruction: 'You are specialized in generating short, inspiring quotes about learning, science, and knowledge. Keep responses under 100 characters.'
    });

    const prompt = "Generate a single, short inspiring quote about either: the joy of learning, the power of knowledge, the beauty of science, or student motivation. Make it concise and impactful.";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const quote = response.text().replace(/["']/g, '').trim();

    // Verify the quote isn't too long
    if (quote.length > 100) {
      return {
        quote: fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
      };
    }

    return {
      quote: quote
    };

  } catch (error) {
    console.error('Error generating quote:', error);
    // Return a random fallback quote if the API fails
    return {
      quote: fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
    };
  }
});