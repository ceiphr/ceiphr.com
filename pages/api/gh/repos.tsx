import type { NextApiRequest, NextApiResponse } from 'next';

import { kv } from '@vercel/kv';
import Joi from 'joi';
import { Octokit } from 'octokit';

const DEFAULT_LENGTH = 5;

const schema = Joi.object({
    len: Joi.number().min(1).max(100).optional(),
    archived: Joi.boolean().optional()
});

const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });

/**
 * Gets repos from GitHub and caches them for 24 hours.
 *
 * @param req   The request object is how we get the query parameters.
 * @param res   The response object is how we send the status code and data.
 * @returns     Gets the repos for the provided user from GitHub.
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const { error } = schema.validate(req.query);
    if (error) {
        return res
            .status(400)
            .json({ message: error.message.replace(/"/g, '') });
    }

    const { len: givenLength, archived: givenArchived } = req.query;

    let length = DEFAULT_LENGTH;
    if (givenLength) {
        length = parseInt(givenLength as string);
    }

    let archived = false;
    if (givenArchived) {
        archived = (givenArchived as string) === 'true';
    }

    // Check if we have a cached version of the repos
    const cached = (await kv.get(
        `gh:repos:len-${length}:archived-${archived}`
    )) as string | null;
    if (cached) {
        return res.status(200).json(cached);
    }

    // Fetch the repos from GitHub
    const repos = await octokit.rest.repos.listForUser({
        username: process.env.GITHUB_USERNAME || 'ceiphr',
        type: 'all'
    });

    if (!repos || !repos.data || repos.data.length === 0) {
        return res.status(404).json({ message: 'No repos found.' });
    }

    if (archived) {
        // Filter for archived repos if requested
        repos.data = repos.data.filter((repo) => repo.archived);
    } else {
        // Otherwise filter for non-archived repos
        repos.data = repos.data.filter((repo) => !repo.archived);
    }

    // Filter out zero-star repos
    repos.data = repos.data.filter(
        (repo) =>
            repo.stargazers_count === undefined || repo.stargazers_count > 0
    );

    // Sort by stars
    repos.data.sort(
        (a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0)
    );

    // Format the repos data
    const reposJson: GitHubRepo[] = repos.data.map((repo) => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description ?? '',
        language: repo.language ?? '',
        stars: repo.stargazers_count ?? 0,
        forks: repo.forks_count ?? 0,
        watchers: repo.watchers_count ?? 0,
        archived: repo.archived ?? false,
        created_at: repo.created_at ?? '',
        updated_at: repo.updated_at ?? ''
    }));

    // Trim the repos to the requested length
    const trimmedRepos = reposJson.slice(0, length);

    // Cache the repos
    await kv.set(
        `gh:repos:len-${length}:archived-${archived}`,
        JSON.stringify(trimmedRepos),
        {
            ex: 60 * 60 * 24 // 24 hours
        }
    );

    return res.status(200).json(trimmedRepos);
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
