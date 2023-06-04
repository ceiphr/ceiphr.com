import type { AppProps } from 'next/app';

import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tooltip/dist/react-tooltip.css';

import '@styles/globals.css';

// TODO Add header for preview mode
// TODO Add context with local storage for theme

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <SkeletonTheme baseColor="#111827" highlightColor="#1a2233">
                <Component {...pageProps} />
            </SkeletonTheme>
            {/* https://www.simpleanalytics.com/?referral=ari */}
            <script async defer src="https://sa.ceiphr.com/latest.js"></script>
            <noscript>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://sa.ceiphr.com/noscript.gif"
                    alt=""
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </noscript>
        </>
    );
}
