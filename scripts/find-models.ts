import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function findModel() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.models) {
        const flashModels = data.models.filter((m: any) => m.name.includes('flash'));
        console.log('Available Flash Models:');
        flashModels.forEach((m: any) => console.log(` - ${m.name}`));

        const proModels = data.models.filter((m: any) => m.name.includes('pro'));
        console.log('Available Pro Models:');
        proModels.forEach((m: any) => console.log(` - ${m.name}`));
    }
}

findModel();
