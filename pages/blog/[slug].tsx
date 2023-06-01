import fs from 'fs';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import path from 'path';
import { useEffect, useState } from 'react';

import { remarkCodeHike } from '@code-hike/mdx';
import { CH } from '@code-hike/mdx/components';
import Giscus from '@giscus/react';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeKatex from 'rehype-katex';
import remarkCapitalize from 'remark-capitalize';
import remarkMath from 'remark-math';
import theme from 'shiki/themes/github-dark.json';

import Layout from '@components/Layout';
import History from '@components/blog/History';
import CustomImage from '@components/blog/Image';
import CustomLink from '@components/blog/Link';
import { POSTS_PATH, postFilePaths } from '@utils/mdx';

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components = {
    // It also works with dynamically-imported components, which is especially
    // useful for conditionally loading components for certain routes.
    // See the notes in README.md for more details.
    img: (props: any) => <CustomImage {...props} />,
    a: (props: any) => <CustomLink {...props} />,
    Head,
    Link,
    CH,
    Spline: dynamic(() => import('@components/blog/Spline')),
    Rive: dynamic(() => import('@components/blog/Rive'))
};

interface Props {
    source: {
        compiledSource: string;
        renderedOutput: string;
        scope: Record<string, unknown>;
    };
    frontmatter: {
        [key: string]: string;
    };
    // history: HistoryEntry[];
}

// TODO Add anchor links to headers
// TODO Add table of contents
// TODO Add Carbon Ads
// TODO Add embed support for YouTube, Instagram, etc.

/**
 * PostPage will render the post content using MDX.
 *
 * @param props The props object contains the post `source` and `frontMatter`.
 * @returns     The post page.
 */
export default function PostPage({ source, frontmatter }: Props) {
    const router = useRouter();
    const slug = router.query.slug as string;
    const [likes, setLikes] = useState(0);
    const [userLiked, setUserLiked] = useState(false);

    // Fetch initial likes
    useEffect(() => {
        fetch(`/api/blog/like?slug=${slug}`)
            .then((response) => response.json())
            .then(({ likes }) => setLikes(likes));

        // Check local storage to see if user has liked this post
        const userLikes = localStorage.getItem('likes');
        if (userLikes) {
            const parsedLikes = JSON.parse(userLikes);
            if (parsedLikes.includes(slug)) {
                setUserLiked(true);
            }
        }
    }, [slug]);

    // Update local storage when user likes a post
    useEffect(() => {
        if (userLiked) {
            const userLikes = localStorage.getItem('likes');
            if (userLikes) {
                const parsedLikes = JSON.parse(userLikes);
                if (!parsedLikes.includes(slug)) {
                    parsedLikes.push(slug);
                    localStorage.setItem('likes', JSON.stringify(parsedLikes));
                }
            } else {
                localStorage.setItem('likes', JSON.stringify([slug]));
            }
        }
    }, [userLiked, slug]);

    return (
        <>
            <Head>
                <title>{frontmatter.title}</title>
                <meta name="description" content={frontmatter.description} />
                <meta
                    property="twitter:image"
                    content="Twitter link preview image URL"
                />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={frontmatter.title} />
                <meta
                    property="twitter:description"
                    content={frontmatter.description}
                />
                <meta property="og:image" content="Link preview image URL" />
                <meta property="og:title" content={frontmatter.title} />
                <meta
                    property="og:description"
                    content={frontmatter.description}
                />
                <meta
                    property="og:url"
                    content={`https://${process.env.NEXT_PUBLIC_DOMAIN}/blog/${slug}`}
                />
            </Head>
            <Layout>
                <main className="mx-auto max-w-3xl px-6 mb-4">
                    <header>
                        <nav>
                            <Link href="/" legacyBehavior>
                                <a>👈 Go back home</a>
                            </Link>
                        </nav>
                    </header>
                    <div className="post-header">
                        <h1 className="text-5xl mt-4 mb-2">
                            {frontmatter.title}
                        </h1>
                        {frontmatter.description && (
                            <p className="description">
                                {frontmatter.description}
                            </p>
                        )}
                        <p>{likes} Likes</p>
                        <button
                            onClick={() => {
                                fetch('/api/blog/like', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ slug })
                                }).then(() => {
                                    setUserLiked(true);
                                    setLikes(likes + 1);
                                });
                            }}
                        >
                            Like this post?
                        </button>
                        {userLiked && <p>You liked this post!</p>}
                        <hr className="my-4" />
                    </div>
                    <article className="mb-4">
                        <MDXRemote
                            {...source}
                            frontmatter={frontmatter}
                            components={components}
                            lazy
                        />
                    </article>
                    {/* <History history={history} /> */}
                    <Giscus
                        repo="ceiphr/ceiphr.com"
                        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? ''}
                        category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? ''}
                        categoryId={
                            process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? ''
                        }
                        term={frontmatter.title}
                        mapping="specific"
                        reactionsEnabled="0"
                        theme="dark_dimmed"
                        loading="lazy"
                    />
                </main>
            </Layout>
        </>
    );
}

interface StaticProps {
    params: {
        slug: string;
    };
}

/**
 * getStaticProps will fetch and serialize the MDX for the requested post.
 *
 * @param params    The params object contains the post `slug`.
 * @returns         The props object contains the post `source` and `frontMatter`.
 */
export const getStaticProps = async ({ params }: StaticProps) => {
    const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`);
    const source = fs.readFileSync(postFilePath);

    const { content, data } = matter(source);

    const mdxSource = await serialize(content, {
        // Optionally pass remark/rehype plugins
        mdxOptions: {
            remarkPlugins: [
                remarkMath,
                remarkCapitalize,
                [
                    remarkCodeHike,
                    {
                        theme,
                        autoImport: false,
                        showCopyButton: true,
                        lineNumbers: false
                    }
                ]
            ],
            rehypePlugins: [
                [rehypeKatex, { throwOnError: true, output: 'mathml' }]
            ],
            useDynamicImport: true,
            // https://github.com/hashicorp/next-mdx-remote/issues/350#issuecomment-1461558918
            development: process.env.NODE_ENV === 'development'
        },
        scope: data
    });

    // Git history
    // TODO Fix this, history length is off
    // const history = JSON.parse(fs.readFileSync(POSTS_HISTORY_PATH).toString());
    // const historyDict = history.reduce(
    //     (acc: Record<string, HistoryEntry[]>, curr: HistoryItem) => {
    //         acc[curr.slug] = curr.history;
    //         return acc;
    //     },
    //     {}
    // );

    return {
        props: {
            source: mdxSource,
            frontmatter: data
            // history: historyDict[params.slug].slice(0, 10) ?? []
        }
    };
};

/**
 * getStaticPaths will return a list of possible values for `slug`.
 *
 * @returns The paths object contains the list of posts `slug`.
 */
export const getStaticPaths = async () => {
    const paths = postFilePaths
        // Remove file extensions for page paths
        .map((path) => path.replace(/\.mdx?$/, ''))
        // Map the path into the static paths object required by Next.js
        .map((slug) => ({ params: { slug } }));

    return {
        paths,
        fallback: false
    };
};
