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
            </body>
        </Html>
    );
}
