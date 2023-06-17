import type { NextApiRequest, NextApiResponse } from 'next';

import { kv } from '@vercel/kv';
import { createHash } from 'crypto';

import { REDIRECTS } from '@lib/link-shortener';
import { slugsSchema } from '@utils/schemas';

// TODO Provide all the links that are available for the post.

/**
 * handleGet will hash the post `slug` and return if there's a short link.
 *
 * @param req   The request object contains the post `slug`.
 * @param res   The response object is how we send the status code and likes.
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const { error } = slugsSchema.validate(req.query);
    if (error) {
        return res
            .status(400)
            .json({ message: error.message.replace(/"/g, '') });
    }

    const { slug } = req.query;

    const shortLink = await kv.get(`shortlink:${slug}`);
    if (shortLink) return res.status(200).json({ link: shortLink });

    // Since hashing is deterministic and hashes are generated from the slug,
    // we can see if a short link exists for the slug by hashing it
    // and checking if it exists in the `REDIRECTS` object.
    const hash = createHash('sha256');
    hash.update(slug as string);
    const shortHash = hash.digest('hex').substring(0, 7);

    if (REDIRECTS[shortHash]) {
        const shortLink = `https://ceiphr.link/${shortHash}`;
        await kv.set(`shortlink:${slug}`, shortLink, {
            ex: 60 * 60 // 1 hour in seconds
        });
        return res.status(200).json({ link: shortLink });
    }
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
