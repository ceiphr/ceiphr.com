import type { NextApiRequest, NextApiResponse } from 'next';

import { kv } from '@vercel/kv';
import { Octokit } from 'octokit';

import { commitsSchema } from '@utils/schemas';

const DEFAULT_LENGTH = 5;
const DEFAULT_PATH = 'main';

const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });

/**
 * Gets commits from GitHub and caches them for 1 hour.
 *
 * @param req   The request object is how we get the query parameters.
 * @param res   The response object is how we send the status code and data.
 * @returns     Gets the commits for the provided path from GitHub.
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const { error } = commitsSchema.validate(req.query);
    if (error) {
        return res
            .status(400)
            .json({ message: error.message.replace(/"/g, '') });
    }

    const { path: pathArray, page, length: givenLength } = req.query;
    if (pathArray && typeof pathArray === 'string') {
        return res.status(400).json({ message: 'Invalid path' });
    }

    const path = (pathArray as string[])?.join('/');

    let length = DEFAULT_LENGTH;
    if (givenLength) {
        length = parseInt(givenLength as string);
    }

    // Check if we have a cached version of the commits
    const cached = (await kv.get(
        `gh:commits:${path ?? DEFAULT_PATH}:length-${length}:page-${page ?? 0}`
    )) as string | null;
    if (cached) {
        return res.status(200).json(cached);
    }

    // Fetch the commits from GitHub
    const commits = await octokit.rest.repos.listCommits({
        owner: process.env.GITHUB_USERNAME || 'ceiphr',
        repo: process.env.GITHUB_REPO || 'ceiphr.com',
        // main is the default branch, we'll return the full list of commits
        // if the user is requesting the main branch instead of an actual file path
        path: (path as string) === 'main' ? undefined : path,
        page: parseInt(page as string),
        per_page: length
    });

    // Format the commits data
    const commitsJson: GitHubCommit[] = commits.data.map((commit) => {
        return {
            sha: commit.sha,
            message: commit.commit.message,
            date: commit.commit.author?.date ?? '',
            verified: commit.commit.verification?.verified ?? false,
            url: commit.html_url,
            author: {
                name: commit.commit.author?.name ?? '',
                username: commit.author?.login ?? '',
                url: commit.author?.html_url ?? '',
                avatar_url: commit.author?.avatar_url ?? ''
            }
        };
    });

    if (commitsJson.length === 0) {
        return res.status(404).json({ message: 'No commits found' });
    }

    // Cache the commits
    await kv.set(
        `gh:commits:${path ?? DEFAULT_PATH}:length-${length}:page-${page ?? 0}`,
        commitsJson,
        { ex: 60 * 60 } // 1 hour in seconds
    );

    return res.status(200).json(commitsJson);
}

/**
 * handler will handle the request based on the HTTP method.
 *
 * @param req   The request object is how we get the query parameters.
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
