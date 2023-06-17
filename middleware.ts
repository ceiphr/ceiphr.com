import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

import { ipAddress } from '@vercel/edge';

import { REDIRECTS } from '@lib/link-shortener';
import { rateLimit } from '@lib/rate-limit';

// TODO Rate limit should only apply to blog API routes that aren't GET requests.

/**
 * @see https://github.com/steven-tey/dub/blob/fa74a85dda3868d532910f6054e9d23f03a6713e/middleware.ts
 */
export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api/ routes
         * 2. /_next/ (Next.js internals)
         * 3. /_proxy/, /_auth/ (special pages for OG tags proxying and password protection)
         * 4. /_static (inside /public)
         * 5. /_vercel (Vercel internals)
         * 6. /favicon.ico, /sitemap.xml (static files)
         */
        '/((?!_next/|_proxy/|_auth/|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)'
    ]
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
    // For rate limiting requests to the blog API routes (e.g. /api/blog/llm)
    const path = req.nextUrl.pathname;
    if (path.startsWith('/api/blog/')) {
        const ip =
            ipAddress(req) ||
            req.headers.get('x-real-ip') ||
            req.headers.get('x-forwarded-for') ||
            process.env.NODE_ENV === 'development'
                ? '127.0.0.1'
                : undefined;
        if (!ip)
            return new Response('Unable to get IP address', { status: 500 });

        const responseHeaders = new Headers(req.headers);
        if (!(await rateLimit(responseHeaders, ip, 10)))
            return new Response('Too many requests', {
                status: 429,
                headers: responseHeaders
            });
        else
            return NextResponse.next({
                headers: responseHeaders
            });
    }

    // For handling redirects from the link shortener
    const domain = (req.headers.get('host') as string).replace('www.', '');
    const linkShortenerDomains = new Set(
        process.env.LINK_SHORTENER_DOMAINS?.split(',') ?? []
    );

    if (
        req.nextUrl.pathname.startsWith('/link/') &&
        REDIRECTS[path.replace('/link/', '')]
    )
        return NextResponse.redirect(REDIRECTS[path.replace('/link/', '')]);

    if (linkShortenerDomains.has(domain)) {
        if (REDIRECTS[path.replace('/', '')])
            return NextResponse.redirect(REDIRECTS[path.replace('/', '')]);
        else
            return NextResponse.redirect(
                `https://${process.env.NEXT_PUBLIC_DOMAIN}`
            );
    }

    return NextResponse.next();
}
