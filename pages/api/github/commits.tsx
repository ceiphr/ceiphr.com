// TODO Move Git history to KV with https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28#list-commits
import type { NextApiRequest, NextApiResponse } from 'next';

import { kv } from '@vercel/kv';

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse
) {
    const user = await kv.hgetall('user:me');
    return res.status(200).json(user);
}
