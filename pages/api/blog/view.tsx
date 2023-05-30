import type { NextApiRequest, NextApiResponse } from 'next';

import { kv } from '@vercel/kv';

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse
) {
    const user = await kv.hgetall('user:me');
    return res.status(200).json(user);
}
