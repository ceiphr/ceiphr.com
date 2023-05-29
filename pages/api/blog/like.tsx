import type { NextApiRequest, NextApiResponse } from 'next';

import { kv } from '@vercel/kv';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const user = await kv.hgetall('user:me');
    return response.status(200).json(user);
}
