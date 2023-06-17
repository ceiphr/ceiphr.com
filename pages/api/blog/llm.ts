import { NextRequest, NextResponse } from 'next/server';

import { createLLMService } from 'usellm';

const llmService = createLLMService({
    openaiApiKey: process.env.OPENAI_API_KEY,
    actions: ['chat']
});

// TODO Move to Vercel AI

export const runtime = 'edge';

export default async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();

    try {
        const { result } = await llmService.handle({ body, request: req });
        return new Response(result, {
            status: 200
        });
    } catch (error: any) {
        console.error('[LLM Service]', error);

        return new Response(error.message, {
            status: error?.status || 400
        });
    }
}
