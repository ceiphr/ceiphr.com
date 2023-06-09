import type { NextApiRequest, NextApiResponse } from 'next';

import { kv } from '@vercel/kv';
import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });

/**
 * Gets the profile data from GitHub and caches it for 24 hours.
 *
 * @param _req  Unused.
 * @param res   The response object is how we send the status code and data.
 * @returns     The profile data from GitHub.
 */
async function handleGet(_req: NextApiRequest, res: NextApiResponse) {
    // Check if we have a cached version of the profile
    const cached = (await kv.get(`gh:profile`)) as string | null;
    if (cached) {
        return res.status(200).json(cached);
    }

    // Fetch the profile from GitHub
    const profile = await octokit.rest.users.getByUsername({
        username: process.env.GITHUB_USERNAME || 'ceiphr'
    });

    // Fetch the socials from GitHub
    const { data: socials } =
        await octokit.rest.users.listSocialAccountsForUser({
            username: process.env.GITHUB_USERNAME || 'ceiphr'
        });

    // Format the profile data
    const profileJson: GitHubProfile = {
        name:
            profile.data.name ??
            process.env.NEXT_PUBLIC_AUTHOR ??
            'Ari Birnbaum',
        username: profile.data.login ?? process.env.GITHUB_USERNAME ?? 'ceiphr',
        url: profile.data.html_url ?? '',
        avatar_url: profile.data.avatar_url ?? '',
        bio: profile.data.bio ?? '',
        company: {
            name: profile.data.company ?? '',
            url:
                `https://github.com/${profile.data.company?.replace(
                    '@',
                    ''
                )}` ?? ''
        },
        location: profile.data.location ?? '',
        website: profile.data.blog ?? '',
        followers: profile.data.followers ?? 0,
        following: profile.data.following ?? 0,
        public_repos: profile.data.public_repos ?? 0,
        public_gists: profile.data.public_gists ?? 0,
        socials: socials
    };

    // Cache the profile
    await kv.set(`gh:profile`, JSON.stringify(profileJson), {
        ex: 60 * 60 * 24 // 24 hours
    });

    return res.status(200).json(profileJson);
}

/**
 * handler will handle the request based on the HTTP method.
 *
 * @param req   Unused.
 * @param res   The response object is how we send the status code and data.
 */
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
