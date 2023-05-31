import type { NextApiResponse } from 'next';

import { kv } from '@vercel/kv';

const TOKEN_COUNT_KEY = 'rate-limit-token-count';
const DEFAULT_TOKEN_LIMIT = 500;
const DEFAULT_INTERVAL = 60;
const DEFAULT_WAIT = 60;

/**
 * Rate limit a request
 *
 * @param res The response object
 * @param token The token to rate limit
 * @param limit The maximum number of requests in the default interval (60 seconds)
 * @returns A promise that returns true if the request is allowed, or false if it is not
 * @see https://github.com/vercel/next.js/blob/7adb273b02404949784f9211438e1d5d32e3b6ee/examples/api-routes-rate-limit/utils/rate-limit.ts
 */
export default async function rateLimit(
    res: NextApiResponse,
    token: string,
    limit: number
): Promise<boolean> {
    // Check unique tokens created in the last interval
    const tokenCount = (await kv.get(TOKEN_COUNT_KEY)) as number | null;

    // This is the first time a token is used
    if (tokenCount === null) {
        await kv.set(TOKEN_COUNT_KEY, 1, {
            ex: DEFAULT_INTERVAL,
            nx: true
        });
    } else {
        // Check if the maximum number of unique tokens has been reached
        if (tokenCount > DEFAULT_TOKEN_LIMIT) {
            res.setHeader('Retry-After', DEFAULT_WAIT);
            return false;
        }

        // Increment the number of unique tokens
        await kv.incr(TOKEN_COUNT_KEY);
    }

    // Get the usage count for the current token
    let usageCount = (await kv.get(`rate-limit:${token}`)) as number | null;

    // This is the first time the token is used
    if (usageCount === null) {
        await kv.set(`rate-limit:${token}`, 1, {
            ex: DEFAULT_INTERVAL,
            nx: true
        });
        usageCount = 1;
    } else {
        // Check if the maximum number of requests has been reached
        if (usageCount >= limit) {
            res.setHeader('Retry-After', DEFAULT_WAIT);
            return false;
        }

        // Increment the usage count
        await kv.incr(`rate-limit:${token}`);
        usageCount++;
    }

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', limit - usageCount);
    return true;
}
