import type { NextApiRequest, NextApiResponse } from 'next';

import { kv } from '@vercel/kv';
import Joi from 'joi';
import { Octokit } from 'octokit';

const DEFAULT_LENGTH = 5;
const DEFAULT_PATH = 'main';

const schema = Joi.object({
    path: Joi.string().optional(),
    page: Joi.number().min(1).optional(),
    len: Joi.number().min(1).max(100).optional()
});

const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });

/**
 * Gets commits from GitHub and caches them for 1 hour.
 *
 * @param req   The request object is how we get the query parameters.
 * @param res   The response object is how we send the status code and data.
 * @returns     Gets the commits for the provided path from GitHub.
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const { error } = schema.validate(req.query);
    if (error) {
        return res
            .status(400)
            .json({ message: error.message.replace(/"/g, '') });
    }

    const { path, page, len: givenLength } = req.query;

    let length = DEFAULT_LENGTH;
    if (givenLength) {
        length = parseInt(givenLength as string);
    }

    // Check if we have a cached version of the commits
    const cached = (await kv.get(
        `gh:commits:${path ?? DEFAULT_PATH}:len-${length}:page-${page ?? 0}`
    )) as string | null;
    if (cached) {
        return res.status(200).json(cached);
    }

    // Fetch the commits from GitHub
    const commits = await octokit.rest.repos.listCommits({
        owner: process.env.GITHUB_USERNAME || 'ceiphr',
        repo: process.env.GITHUB_REPO || 'ceiphr.com',
        path: path as string,
        page: parseInt(page as string),
        per_page: length
    });

    // Format the commits data
    const commitsJson = commits.data.map((commit) => {
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

    // Cache the commits
    await kv.set(
        `gh:commits:${path ?? DEFAULT_PATH}:len-${length}:page-${page ?? 0}`,
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
