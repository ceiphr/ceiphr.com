import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link type="text/plain" rel="author" href="/humans.txt" />
                <link
                    type="application/json"
                    rel="manifest"
                    href="/manifest.json"
                />
                <meta
                    name="msapplication-config"
                    content="/browserconfig.xml"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
                {/* https://www.simpleanalytics.com/?referral=ari */}
                <script
                    async
                    defer
                    src="https://sa.ceiphr.com/latest.js"
                ></script>
                <noscript>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="https://sa.ceiphr.com/noscript.gif"
                        alt=""
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </noscript>
            </body>
        </Html>
    );
}
