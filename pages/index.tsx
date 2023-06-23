import Head from 'next/head';
import Link from 'next/link';

import Layout from '@components/Layout';

// TODO Add favicon
// TODO Add Apple touch icons
// TODO Add schema.org tags
// TODO Add Facebook tags
// TODO Add OpenGraph tags
// TODO Add Twitter tags
// TODO Add support for preferred color scheme
// TODO Add support for preferred reduced motion
// TODO Add support for preferred reduced data
// TODO Add CSP

const METADATA = {
    title: 'Ceiphr',
    description: 'A personal website'
};

export default function Home() {
    return (
        <>
            <Head>
                <title>{METADATA.title}</title>
                <meta name="description" content={METADATA.description} />
                <meta
                    property="twitter:image"
                    content={`https://${process.env.NEXT_PUBLIC_DOMAIN}/api/og`}
                />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={METADATA.title} />
                <meta
                    property="twitter:description"
                    content={METADATA.description}
                />
                <meta
                    property="og:image"
                    content={`https://${process.env.NEXT_PUBLIC_DOMAIN}/api/og`}
                />
                <meta property="og:title" content={METADATA.title} />
                <meta
                    property="og:description"
                    content={METADATA.description}
                />
                <meta
                    property="og:url"
                    content={`https://${process.env.NEXT_PUBLIC_DOMAIN}/blog`}
                />
            </Head>
            <Layout>
                <main className="flex min-h-screen flex-col items-center justify-center space-y-6 p-24">
                    <h1 className="text-8xl font-accent text-center">
                        {process.env.NEXT_PUBLIC_AUTHOR}
                    </h1>
                    <Link href="/blog" className="font-heading text-5xl">
                        Personal Blog
                    </Link>
                </main>
            </Layout>
        </>
    );
}
