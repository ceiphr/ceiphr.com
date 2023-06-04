import { NextRequest, NextResponse } from 'next/server';

import { ipAddress } from '@vercel/edge';
import { createLLMService } from 'usellm';

import { rateLimitEdge } from '@utils/rate-limit';

const llmService = createLLMService({
    openaiApiKey: process.env.OPENAI_API_KEY,
    actions: ['chat']
});

export const runtime = 'edge';

export default async function POST(req: NextRequest, res: NextResponse) {
    // Note: Request is a Vercel Edge Request, not a Next.js request, so
    //       ipAddress is used instead of getClientIp.
    const ip =
        ipAddress(req) ||
        req.headers.get('x-real-ip') ||
        req.headers.get('x-forwarded-for') ||
        process.env.NODE_ENV === 'development'
            ? '127.0.0.1'
            : undefined;
    if (!ip) {
        return new Response('Unable to get IP address', { status: 500 });
    }

    // Rate limit to 10 requests per 60 seconds
    const headers = new Headers();
    if (!(await rateLimitEdge(headers, ip, 10))) {
        return new Response('Too many requests', {
            status: 429,
            headers: {
                'Retry-After': headers.get('Retry-After') || '60',
                'X-RateLimit-Limit': headers.get('X-RateLimit-Limit') || '10',
                'X-RateLimit-Remaining':
                    headers.get('X-RateLimit-Remaining') || '0'
            }
        });
    }

    const body = await req.json();

    try {
        const { result } = await llmService.handle({ body, request: req });
        return new Response(result, {
            status: 200,
            headers: {
                'X-RateLimit-Limit': headers.get('X-RateLimit-Limit') || '10',
                'X-RateLimit-Remaining':
                    headers.get('X-RateLimit-Remaining') || '0'
            }
        });
    } catch (error: any) {
        console.error('[LLM Service]', error);

        return new Response(error.message, {
            status: error?.status || 400
        });
    }
}
