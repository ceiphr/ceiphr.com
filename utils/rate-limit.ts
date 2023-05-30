import type { NextApiResponse } from 'next';

import { kv } from '@vercel/kv';

type Options = {
    uniqueTokenPerInterval?: number;
    interval?: number;
    timeWait?: number;
    tokenLimit?: number;
};

const DEFAULT_UNIQUE_TOKENS_PER_INTERVAL = 100;
const DEFAULT_INTERVAL_MS = 1000 * 60 * 60; // 1 hour in milliseconds
const DEFAULT_TIME_WAIT = 60;

// TODO Check if this is the correct way to do this

/**
 * Rate limit a request
 *
 * @param options   Options for the rate limiter
 * @returns         A rate limiter function
 * @see https://github.com/vercel/next.js/blob/7adb273b02404949784f9211438e1d5d32e3b6ee/examples/api-routes-rate-limit/utils/rate-limit.ts
 */
export default function rateLimit(options?: Options) {
    return {
        check: (res: NextApiResponse, limit: number, token: string) =>
            new Promise<void>(async (resolve, reject) => {
                // Check if the maximum number of unique tokens has been reached
                const issuedTokenCount = await kv.hlen('rate-limit');
                if (
                    issuedTokenCount >=
                    (options?.uniqueTokenPerInterval ??
                        DEFAULT_UNIQUE_TOKENS_PER_INTERVAL)
                ) {
                    res.setHeader(
                        'Retry-After',
                        options?.timeWait ?? DEFAULT_TIME_WAIT
                    );
                    return reject();
                }

                // Get the usage count for the current token
                let usageCount = (await kv.hget('rate-limit', token)) as
                    | number
                    | null;

                // This is the first time the token is used
                if (usageCount === null) {
                    usageCount = limit;
                    await kv.hsetnx('rate-limit', token, usageCount);

                    // ? Will this work if the token is in a set?
                    await kv.expire(
                        token,
                        options?.interval ?? DEFAULT_INTERVAL_MS
                    );
                }

                // Check if the maximum number of requests has been reached
                const currentUsage = await kv.hincrby('rate-limit', token, -1);
                const isRateLimited = currentUsage < 0;
                res.setHeader('X-RateLimit-Limit', limit);
                res.setHeader(
                    'X-RateLimit-Remaining',
                    isRateLimited ? 0 : currentUsage
                );

                return isRateLimited ? reject() : resolve();
            })
    };
}
