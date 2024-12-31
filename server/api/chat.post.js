import { GoogleGenerativeAI } from '@google/generative-ai';
import { H3Error } from 'h3';
import { promises as fs } from 'fs';
import { readFiles } from 'h3-formidable';

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

        const message = fields.message?.[0];
        const messages = JSON.parse(fields.messages?.[0] || '[]');
        const subject = JSON.parse(fields.subject?.[0] || '{}');

        if (!message && (!files.files || files.files.length === 0)) {
            throw new H3Error("No message or files provided in form data.");
        }

        const model = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-pro-latest',
            systemInstruction: `You are an AI tutor specialized in ${subject.name}. Your subject description is: ${subject.description || ''} 
            Provide clear explanations, examples, and support to make complex topics easier to grasp.`
        });

        const initialMessage = [
            {
                role: 'user',
                parts: [{ text: 'Hello' }]
            },
            {
                role: 'model',
                parts: [{ text: `Hello! I'm your AI tutor specialized in ${subject.name}. How can I help you today?` }]
            },
            ...messages.map(msg => ({
                role: msg.role === 'model' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }))
        ];

        const parts = [];
        
        // Add text message if present
        if (message) {
            parts.push({ text: message });
        }

        // Process files if they exist
        if (files.files) {
            for (const file of files.files) {
                const generativePart = await fileToGenerativePart(file);
                parts.push(generativePart);
            }
        }

        const chat = model.startChat({ history: initialMessage });
        const result = await chat.sendMessage(parts);
        const response = await result.response;

        return {
            role: 'model',
            content: response.text()
        };
    } catch (error) {
        console.error('Error processing Gemini request:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to get AI response',
        });
    }
});
