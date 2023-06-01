// TODO https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-a-user
// TODO https://docs.github.com/en/rest/users/social-accounts?apiVersion=2022-11-28#list-social-accounts-for-a-user
import type { NextApiRequest, NextApiResponse } from 'next';

import { kv } from '@vercel/kv';
import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const cached = (await kv.get(`gh:profile`)) as string | null;
    if (cached) {
        return res.status(200).json(cached);
    }

    const profile = await octokit.rest.users.getByUsername({
        username: process.env.GITHUB_USERNAME || 'ceiphr'
    });

    const { data: socials } =
        await octokit.rest.users.listSocialAccountsForUser({
            username: process.env.GITHUB_USERNAME || 'ceiphr'
        });

    const profileJson = {
        name: profile.data.name,
        username: profile.data.login,
        url: profile.data.html_url,
        avatar_url: profile.data.avatar_url,
        bio: profile.data.bio,
        company: profile.data.company,
        location: profile.data.location,
        website: profile.data.blog,
        followers: profile.data.followers,
        following: profile.data.following,
        public_repos: profile.data.public_repos,
        public_gists: profile.data.public_gists,
        socials: socials
    };

    await kv.set(`gh:profile`, JSON.stringify(profileJson), {
        ex: 60 * 60 * 24 // 24 hours
    });

    return res.status(200).json(profileJson);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET':
            return handleGet(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}
