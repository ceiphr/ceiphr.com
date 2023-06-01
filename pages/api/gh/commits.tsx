import type { NextApiRequest, NextApiResponse } from 'next';

import { kv } from '@vercel/kv';
import Joi from 'joi';
import { Octokit } from 'octokit';

const DEFAULT_LENGTH = 5;
const DEFAULT_PATH = 'main';

const schema = Joi.object({
    path: Joi.string().optional(),
    page: Joi.number().optional(),
    len: Joi.number().optional()
});

const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const { error } = schema.validate(req.query);
    if (error) {
        return res.status(400).json({ message: 'Invalid page/range' });
    }

    const { path, page, len: givenLength } = req.query;

    let length = DEFAULT_LENGTH;
    if (givenLength) {
        length = parseInt(givenLength as string);
    }

    const cached = (await kv.get(
        `gh:commits:${path ?? DEFAULT_PATH}:len-${length}:page-${page}`
    )) as string | null;
    if (cached) {
        return res.status(200).json(cached);
    }

    const commits = await octokit.rest.repos.listCommits({
        owner: process.env.GITHUB_USERNAME || 'ceiphr',
        repo: process.env.GITHUB_REPO || 'ceiphr.com',
        path: path as string,
        page: parseInt(page as string),
        per_page: length
    });
    const commitsJson = commits.data.map((commit) => {
        return {
            sha: commit.sha,
            message: commit.commit.message,
            date: commit.commit.author?.date ?? new Date().toISOString(),
            verified: commit.commit.verification?.verified ?? false,
            url: commit.html_url,
            author: {
                name:
                    commit.commit.author?.name ??
                    process.env.NEXT_PUBLIC_AUTHOR,
                username: commit.author?.login ?? process.env.GITHUB_USERNAME,
                url:
                    commit.author?.html_url ??
                    `https://github.com/${process.env.GITHUB_USERNAME}`,
                avatar_url:
                    commit.author?.avatar_url ?? 'https://ceiphr.com/avatar.png'
            }
        };
    });

    await kv.set(
        `gh:commits:${path ?? DEFAULT_PATH}:len-${length}:page-${page}`,
        commitsJson,
        { ex: 3600 } // 1 hour in seconds
    );

    return res.status(200).json(commitsJson);
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
