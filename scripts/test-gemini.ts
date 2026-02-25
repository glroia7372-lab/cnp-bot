import { GoogleGenerativeAI } from '@google/generative-ai';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

async function testConnection() {
    try {
        console.log('--- Gemini API 연결 테스트 시작 ---');
        console.log('API Key 확인 (앞 5자리):', process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0, 5) + '...');

        // 모델 리스트 확인 시도 (지원되는 경우)
        // 보통 v1beta에서 listModels가 지원됩니다.
        // 하지만 직접 1.5-flash와 1.0-pro를 번갈아 테스트하는 것이 확실합니다.

        const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'];

        for (const modelName of models) {
            try {
                console.log(`\n'${modelName}' 모델 테스트 중...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('안녕? 짧게 인사해줘.');
                const response = await result.response;
                console.log(`✅ '${modelName}' 성공! 응답:`, response.text());
                return modelName; // 성공한 모델명 반환
            } catch (e: any) {
                console.log(`❌ '${modelName}' 실패:`, e.message);
            }
        }

        console.log('\n--- 모든 표준 모델 테스트 실패 ---');
        return null;
    } catch (error: any) {
        console.error('테스트 중 치명적 오류:', error.message);
        return null;
    }
}

testConnection().then(successfulModel => {
    if (successfulModel) {
        console.log(`\n결과: '${successfulModel}' 모델을 사용하면 됩니다.`);
    } else {
        console.log('\n결과: API 키가 잘못되었거나 지역 제한이 있을 수 있습니다.');
    }
});
