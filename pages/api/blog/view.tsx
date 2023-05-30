import type { NextApiRequest, NextApiResponse } from 'next';

import { kv } from '@vercel/kv';
import { getClientIp } from 'request-ip';

import rateLimit from '@utils/rate-limit';

enum DateRange {
    day = 1,
    week = 7,
    month = 30,
    year = 365
}

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500 // Max 500 users per second
});

/**
 * Logs a view for the blog post on the current day.
 *
 * @param req   The request object contains the post `slug`.
 * @param res   The response object is how we send the status code.
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const { slug } = req.query;
    const now = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const key = `blog:${slug}:${now}`;

    await kv.zincrby(key, 1, 'views');
    return res.status(200).json({ response: 'ok' });
}

/**
 * Fetches the view count and logs for the blog post for the given range.
 *
 * @param req   The request object contains the post `slug` and `range`.
 * @param res   The response object is how we send the status code, view count, and logs.
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const { slug, range } = req.body;
    const viewLogs: Record<string, number> = {};
    let viewCount = 0;

    for (let i = 0; i < DateRange[range as keyof typeof DateRange]; i++) {
        const date = new Date(Date.now() - i * DAY_IN_MILLISECONDS)
            .toISOString()
            .slice(0, 10);

        const key = `blog:${slug}:${date.replace(/-/g, '')}`;
        const views = await kv.zscore(key, 'views');

        viewLogs[date] = views || 0;
        viewCount += views || 0;
    }

    return res.status(200).json({ views: viewCount, logs: viewLogs });
}

/**
 * handler will handle the request based on the HTTP method.
 *
 * @param req   The request object contains the post `slug`.
 * @param res   Handled by either handleGet or handlePost. Otherwise, responds with a 405.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const ip = getClientIp(req);
    if (!ip) {
        return res.status(500).json({ message: 'Unable to get IP address' });
    }

    await limiter.check(res, 10, ip); // 10 requests per minute

    switch (req.method) {
        case 'GET':
            return handleGet(req, res);
        case 'POST':
            return handlePost(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}
