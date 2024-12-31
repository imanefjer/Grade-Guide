import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFiles } from 'h3-formidable';
import { promises as fs } from 'fs';

const config = useRuntimeConfig();
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

async function fileToGenerativePart(file) {
  const data = await fs.readFile(file.filepath);
  return {
    inlineData: {
      data: Buffer.from(data).toString('base64'),
      mimeType: file.mimetype
    }
  };
}

export default defineEventHandler(async (event) => {
  try {
    const { fields, files } = await readFiles(event, {
      includeFields: true,
    });

    const subject = JSON.parse(fields.subject?.[0] || '{}');
    const questionCount = fields.questionCount?.[0] || '10';
    const difficulty = fields.difficulty?.[0] || 'medium';
    const customPrompt = fields.customPrompt?.[0] || '';

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro-latest',
      systemInstruction: `You are an expert quiz generator for ${subject.name}. ${subject.description || ''}
      Your role is to create engaging, accurate, and educational quiz questions that test understanding at the specified difficulty level.
      Each question should:
      - Be clear and unambiguous
      - Have one definitively correct answer
      - Include plausible but incorrect options that help reinforce learning
      - Provide detailed explanations that teach the underlying concepts
      - Be appropriate for the specified difficulty level
      - Align with standard educational objectives for ${subject.name}
      - Use proper terminology and technical language when appropriate`
    });

    const parts = [];

    let prompt = `Generate a ${difficulty} difficulty quiz about ${subject.name} with ${questionCount} questions. 
    Subject Description: ${subject.description}

    You must format the output as a valid JSON string. Follow this exact structure:
    {
      "questions": [
        {
          "id": "1",
          "type": "multiple_choice",
          "question": "The question text",
          "options": ["option1", "option2", "option3", "option4"],
          "correctAnswer": "option1",
          "explanation": "Explanation of why option1 is correct"
        }
      ]
    }`;

    if (customPrompt) {
      prompt += `\n\nAdditional instructions: ${customPrompt}`;
    }

    parts.push({ text: prompt });

    // Add any uploaded files content
    if (files.files) {
      for (const file of files.files) {
        const generativePart = await fileToGenerativePart(file);
        parts.push(generativePart);
        parts.push({ text: "\nIncorporate relevant content from this material into the quiz questions." });
      }
    }

    const result = await model.generateContent(parts);
    const response = await result.response;
    const quizText = response.text();

    // Clean up the response text to ensure it's valid JSON
    const cleanedQuizText = quizText
      .trim()
      // Remove any markdown code block markers
      .replace(/```json\s*|\s*```/g, '')
      // Remove any trailing commas before closing brackets/braces
      .replace(/,(\s*[}\]])/g, '$1');

    try {
      const quizData = JSON.parse(cleanedQuizText);
      
      // Validate the quiz structure
      if (!quizData.questions || !Array.isArray(quizData.questions)) {
        throw new Error('Invalid quiz format: missing questions array');
      }

      // Validate each question
      quizData.questions = quizData.questions.map((q, index) => {
        if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error(`Question ${index + 1} must have exactly 4 options`);
        }
        if (!q.options.includes(q.correctAnswer)) {
          throw new Error(`Question ${index + 1} has invalid correctAnswer`);
        }
        return {
          ...q,
          id: (index + 1).toString()
        };
      });

      return {
        quiz: quizData
      };
    } catch (error) {
      console.error('Failed to parse quiz JSON:', error);
      console.error('Raw quiz text:', quizText);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to generate properly formatted quiz. Error: ' + error.message,
      });
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate quiz: ' + error.message,
    });
  }
}); 