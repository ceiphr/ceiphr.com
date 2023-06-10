import type { NextApiRequest, NextApiResponse } from 'next';

import { kv } from '@vercel/kv';
import Joi from 'joi';
import { getClientIp } from 'request-ip';

import rateLimit from '@lib/rate-limit';

const schema = Joi.object({
    slug: Joi.string().required()
});

/**
 * handleGet will handle fetching likes from the KV store for the respective post.
 *
 * @param req   The request object contains the post `slug`.
 * @param res   The response object is how we send the status code and likes.
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const { error } = schema.validate(req.query);
    if (error) {
        return res
            .status(400)
            .json({ message: error.message.replace(/"/g, '') });
    }

    const { slug } = req.query;
    const likes =
        ((await kv.hget(`blog:${slug}`, 'likes')) as number | null) || 0;

    return res.status(200).json({ likes });
}

/**
 *  handlePost will handle storing likes in the KV store for the respective post.
 *
 * @param req   The request object contains the post `slug`.
 * @param res   The response object is how we send the status code and likes.
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    // Rate limit by IP address
    const ip = getClientIp(req);
    if (!ip) {
        return res.status(500).json({ message: 'Unable to get IP address' });
    }

    // Rate limit to 10 requests per 60 seconds
    if (!(await rateLimit(res, ip, 10))) {
        return res.status(429).json({ message: 'Too many requests' });
    }

    const { slug } = req.body;
    const { error } = schema.validate({ slug });
    if (error) {
        return res
            .status(400)
            .json({ message: error.message.replace(/"/g, '') });
    }

    const likes =
        ((await kv.hget(`blog:${slug}`, 'likes')) as number | null) || 0;

    const newLikes = likes ? likes + 1 : 1;
    await kv.hset(`blog:${slug}`, { likes: newLikes.toString() });

    return res.status(200).json({ likes: newLikes });
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
        case 'POST':
            return handlePost(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}
