import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function checkApiKey() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        console.error('No API key found');
        return;
    }

    console.log(`Checking API Key: ${apiKey.substring(0, 10)}...`);

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ API Connection Successful!');
            console.log('Available Models:');
            if (data.models) {
                data.models.forEach((m: any) => console.log(` - ${m.name}`));
            } else {
                console.log('No models returned. (data.models is empty)');
            }
        } else {
            console.log(`❌ API Connection Failed: ${response.status} ${response.statusText}`);
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (e: any) {
        console.error('Fetch error:', e.message);
    }
}

checkApiKey();
