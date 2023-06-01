import type { NextRequest, NextResponse } from 'next/server';

import { ImageResponse } from '@vercel/og';
import Joi from 'joi';

export const config = {
    runtime: 'edge'
};

const schema = Joi.string().allow(null).optional();

/**
 * Generates an OpenGraph image for meta tags.
 *
 * @param req   The request object contains the `title` query parameter.
 * @param _res  Unused.
 * @returns     The image response or an error response.
 */
async function handleGet(req: NextRequest, _res: NextResponse) {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');

    const { error } = schema.validate(title);
    if (error) {
        return new Response(error.message.replace(/"/g, ''), { status: 400 });
    }

    try {
        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'black'
                    }}
                >
                    <div tw="flex">
                        <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
                            <h2 tw="flex flex-col text-7xl font-bold tracking-tight text-gray-900 text-left">
                                <span tw="text-white">
                                    {title ?? process.env.NEXT_PUBLIC_AUTHOR}
                                </span>
                                <span tw="text-indigo-600">
                                    {process.env.NEXT_PUBLIC_DOMAIN}
                                </span>
                            </h2>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630
            }
        );
    } catch (e: any) {
        return new Response(e.message || 'Internal Server Error', {
            status: 500
        });
    }
}

/**
 * handler will handle the request based on the HTTP method.
 *
 * @param req   The request object contains the `title`.
 * @param res   Unused.
 * @returns     The image response or an error response.
 */
export default function handler(req: NextRequest, res: NextResponse) {
    switch (req.method) {
        case 'GET':
            return handleGet(req, res);
        default:
            return new Response('Method Not Allowed', { status: 405 });
    }
}
