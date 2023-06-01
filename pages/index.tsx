import { Inter } from 'next/font/google';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import classNames from 'classnames';

import History from '@components/History';
import Layout from '@components/Layout';

const inter = Inter({ subsets: ['latin'] });

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
                    content={`https://${process.env.NEXT_PUBLIC_DOMAIN}/api/og?title=${METADATA.title}`}
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
                <main
                    className={classNames(
                        'flex min-h-screen flex-col items-center justify-between p-24',
                        inter.className
                    )}
                >
                    <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
                        <Image
                            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                            src="/next.svg"
                            alt="Next.js Logo"
                            width={180}
                            height={37}
                            priority
                        />
                    </div>
                    <History />
                    <Link href="/blog">Blog</Link>
                </main>
            </Layout>
        </>
    );
}
