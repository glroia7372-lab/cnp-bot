import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function listModels() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        console.error('No API key found in .env.local');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        // The SDK doesn't have a direct listModels, we have to use the underlying API or just test a few
        console.log('Testing models with API Key...');
        const modelsToTest = [
            'gemini-1.5-flash',
            'gemini-1.5-flash-latest',
            'gemini-1.5-pro',
            'gemini-pro'
        ];

        for (const modelName of modelsToTest) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Hi');
                console.log(`✅ Success with model: ${modelName}`);
                return; // Stop if we find a working one
            } catch (e: any) {
                console.log(`❌ Failed with model: ${modelName} - ${e.message}`);
            }
        }
    } catch (error) {
        console.error('List models failed:', error);
    }
}

listModels();
