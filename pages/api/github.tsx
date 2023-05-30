import type { NextApiRequest, NextApiResponse } from 'next';

import { kv } from '@vercel/kv';

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse
) {
    const user = await kv.hgetall('user:me');
    return res.status(200).json(user);
}

// TODO Move Git history to KV with https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28#list-commits
// TODO https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user
// TODO https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-a-user
// TODO https://docs.github.com/en/rest/users/social-accounts?apiVersion=2022-11-28#list-social-accounts-for-a-user
