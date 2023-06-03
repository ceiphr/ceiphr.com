import type { NextApiRequest, NextApiResponse } from 'next';

import { kv } from '@vercel/kv';

import { statsHeaderSchema, statsSchema } from '@utils/schemas';

enum RANGE {
    DAY = 1,
    WEEK = 7,
    MONTH = 30,
    YEAR = 365
}

/**
 * Logs a view for the blog post on the current day.
 *
 * @param req   The request object contains the post `slug`.
 * @param res   The response object is how we send the status code.
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const { error } = statsSchema.validate(req.query);
    if (error) {
        return res
            .status(400)
            .json({ message: error.message.replace(/"/g, '') });
    }

    const { route: routeArray, range } = req.query;
    if (routeArray && typeof routeArray === 'string') {
        return res.status(400).json({ message: 'Invalid page' });
    }

    const route = (routeArray as string[])?.join('/');

    const { error: headersError } = statsHeaderSchema.validate(req.headers);
    let timezone = req.headers['x-timezone'];
    if (headersError || !timezone) {
        timezone = 'America/New_York';
    }

    // Date/Timestamp range
    let startDate = new Date();

    switch (range) {
        case 'day':
            startDate.setDate(startDate.getDate() - RANGE.DAY);
            break;
        case 'week':
            startDate.setDate(startDate.getDate() - RANGE.WEEK);
            break;
        case 'month':
            startDate.setDate(startDate.getDate() - RANGE.MONTH);
            break;
        case 'year':
            startDate.setDate(startDate.getDate() - RANGE.YEAR);
            break;
        case undefined: // No range provided
            break;
        default:
            return res.status(400).json({ message: 'Invalid range' });
    }

    // Check if the page is cached
    const cached = (await kv.get(
        `sa:${route}:range-${range ?? 'na'}:timezone-${timezone ?? 'na'}`
    )) as string | null;
    if (cached) {
        return res.status(200).json(cached);
    }

    // Fetch views for the provided page from Simple Analytics
    const saStats = await fetch(
        `https://simpleanalytics.com/${
            process.env.NEXT_PUBLIC_DOMAIN
        }/${route}.json?version=5&info=false&fields=histogram,pageviews,visitors,referrers${
            range
                ? `&start=${
                      startDate.toISOString().split('T')[0]
                  }&end=today&timezone=${timezone}`
                : ''
        }`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': process.env.SIMPLE_ANALYTICS_API_KEY
            } as HeadersInit
        }
    );

    if (!saStats.ok) {
        return res.status(saStats.status).json({ message: saStats.statusText });
    }

    // Format the response
    const saStatsJson = await saStats.json();
    const formattedStats: SimpleAnalyticsStats = {
        path: saStatsJson.path,
        start: saStatsJson.start,
        end: saStatsJson.end,
        timezone: saStatsJson.timezone,
        pageviews: saStatsJson.pageviews,
        visitors: saStatsJson.visitors,
        referrers: saStatsJson.referrers,
        histogram: saStatsJson.histogram
    };

    // Cache the response
    await kv.set(
        `sa:${route}:range-${range ?? 'na'}:timezone-${timezone ?? 'na'}`,
        JSON.stringify(formattedStats),
        {
            ex: 60 * 60 // 1 hour in seconds
        }
    );

    return res.status(200).json(formattedStats);
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
    switch (req.method) {
        case 'GET':
            return handleGet(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}
