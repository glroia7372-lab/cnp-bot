import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';

const KNOWLEDGE_FILES = [
    { name: 'flippass_service_intro.md', internal: false },
    { name: 'company_knowledge.csv', internal: false, isCsv: true },
    { name: 'flippass_internal_manual.md', internal: true },
    { name: 'training_data_sample.md', internal: true },
    { name: 'equipment_application_guide.md', internal: true },
];


// Force reload for model name update: 2026-02-19 16:15
export async function POST(req: NextRequest) {
    try {
        const { message, role } = await req.json();
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) return NextResponse.json({ error: 'API Key missing' }, { status: 400 });

        const genAI = new GoogleGenerativeAI(apiKey);
        const knowledge = KNOWLEDGE_FILES
            .filter(f => !f.internal || role === 'internal')
            .map(f => {
                const p = path.join(process.cwd(), 'knowledge', f.name);
                if (!fs.existsSync(p)) return '';
                const raw = fs.readFileSync(p, 'utf-8');
                if (f.isCsv) {
                    const rows = Papa.parse(raw, { header: true }).data as any[];
                    return rows.map(r => `Q: ${r.Question}\nA: ${r.Answer}`).join('\n');
                }
                return raw;
            }).filter(Boolean).join('\n---\n');

        const systemPrompt = `당신은 CNP 파트너스 전문 도우미입니다. 
- 지침: ** 기호 사용 금지, 간결한 답변, 필요시 [버튼명: 값] 형식 사용.
- 역할: ${role === 'internal' ? '내부 지원(보안 철저)' : '고객 지원'}
- 지식 베이스: ${knowledge}`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(`${systemPrompt}\n\nUser: ${message}\nAI:`);

        return NextResponse.json({ message: result.response.text() });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
