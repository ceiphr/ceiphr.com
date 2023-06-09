import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

import { LINK_SHORTENER_REDIRECTS } from '@utils/constants';

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
        '/((?!api/|_next/|_proxy/|_auth/|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)'
    ]
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const domain = (req.headers.get('host') as string).replace('www.', '');
    const path = req.nextUrl.pathname;
    const linkShortenerDomains =
        process.env.LINK_SHORTENER_DOMAINS?.split(',') ?? [];

    console.log(linkShortenerDomains, path);
    const isDev =
        process.env.NODE_ENV === 'development' &&
        req.nextUrl.pathname.startsWith('/link/');

    if (linkShortenerDomains.includes(domain) || isDev) {
        if (isDev)
            return NextResponse.redirect(
                LINK_SHORTENER_REDIRECTS[path.replace('/link/', '')]
            );
        else if (LINK_SHORTENER_REDIRECTS[path])
            return NextResponse.redirect(LINK_SHORTENER_REDIRECTS[path]);
        else
            return NextResponse.redirect(
                `https://${process.env.NEXT_PUBLIC_DOMAIN}`
            );
    }

    return NextResponse.next();
}
