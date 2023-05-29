import fs from 'fs';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import classNames from 'classnames';

import Layout from '@components/Layout';
import History from '@components/blog/History';
import { HISTORY_PATH } from '@utils/git';

const inter = Inter({ subsets: ['latin'] });

interface Props {
    history: HistoryEntry[];
}

export default function Home({ history }: Props) {
    return (
        <>
            <Head>
                <title>Ceiphr</title>
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
                    <History history={history} />
                    <Link href="/blog">Blog</Link>
                </main>
            </Layout>
        </>
    );
}

export const getStaticProps = async () => {
    // Git history
    const history = JSON.parse(fs.readFileSync(HISTORY_PATH).toString());

    return {
        props: {
            history: history.slice(0, 5)
        }
    };
};
