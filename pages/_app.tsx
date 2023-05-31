import type { AppProps } from 'next/app';

import '@code-hike/mdx/dist/index.css';

import '@styles/globals.css';

// TODO Add header for preview mode
// TODO Add context with local storage for theme

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
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
