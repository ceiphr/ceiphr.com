import fs from 'fs';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import path from 'path';
import type { ComponentProps } from 'react';

import type { MDXProvider } from '@mdx-js/react';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeInferReadingTimeMeta from 'rehype-infer-reading-time-meta';
import rehypeKatex from 'rehype-katex';
import rehypePresetMinify from 'rehype-preset-minify';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkCapitalize from 'remark-capitalize';
import remarkMath from 'remark-math';

import Layout from '@components/Layout';
import Actions from '@components/blog/Actions';
import Metadata from '@components/blog/Metadata';
import ToC from '@components/blog/ToC';
import { ActionsProvider } from '@contexts/blog/useActions';
import rehypeCodeStatusBar from '@lib/rehype/code-statusbar';
import rehypeExtractHeadings from '@lib/rehype/extract-headings';
import { POSTS_PATH, postFilePaths } from '@utils/mdx';

const Prompt = dynamic(() => import('@components/blog/llm/Prompt'));
const Giscus = dynamic(() => import('@giscus/react'));
const Share = dynamic(() => import('@components/blog/Share'));

const Ad = dynamic(() => import('@components/blog/Ad'), {
    ssr: false
});

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components: ComponentProps<typeof MDXProvider>['components'] = {
    // @ts-expect-error: Replaces the img tag with the custom component.
    img: dynamic(() => import('@components/blog/mdx/Image')),
    // @ts-expect-error: Replaces the a tag with the custom component.
    a: dynamic(() => import('@components/blog/mdx/Link')),
    CodeStatusBar: dynamic(() => import('@components/blog/mdx/CodeStatusBar')),
    Container: dynamic(() => import('@components/blog/mdx/Container')),
    Spline: dynamic(() => import('@components/blog/mdx/Spline')),
    Rive: dynamic(() => import('@components/blog/mdx/Rive'))
};

// TODO ctrl+arrow keys to navigate to the top/bottom of the article
// TODO make asset paths relative to the post w/ https://github.com/brechtcs/rehype-urls

interface Props {
    source: {
        compiledSource: string;
        renderedOutput: string;
        scope: Record<string, unknown>;
    };
    frontmatter: Frontmatter;
    headings: Heading[];
}

/**
 * PostPage will render the post content using MDX.
 *
 * @param props The props object contains the post `source` and `frontMatter`.
 * @returns     The post page.
 */
export default function PostPage({ source, frontmatter, headings }: Props) {
    const router = useRouter();
    const slug = router.query.slug as string;

    return (
        <>
            <Head>
                <title>{frontmatter.title}</title>
                <meta name="description" content={frontmatter.description} />
                <meta
                    property="twitter:image"
                    content={`https://${process.env.NEXT_PUBLIC_DOMAIN}/api/og?title=${frontmatter.title}`}
                />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={frontmatter.title} />
                <meta
                    property="twitter:description"
                    content={frontmatter.description}
                />
                <meta
                    property="og:image"
                    content={`https://${process.env.NEXT_PUBLIC_DOMAIN}/api/og?title=${frontmatter.title}`}
                />
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
                <ActionsProvider slug={slug}>
                    <main className="mx-auto max-w-5xl px-6 mb-4">
                        <div className="flex divide-x space-x-4 divide-gray-800">
                            <div className="basis-3/4">
                                <header>
                                    <nav>
                                        <Link href="/" legacyBehavior>
                                            <a>👈 Go back home</a>
                                        </Link>
                                    </nav>
                                </header>
                                <div className="post-header">
                                    <h1
                                        id="title"
                                        className="text-6xl font-heading mt-4 mb-2"
                                    >
                                        {frontmatter.title}
                                    </h1>
                                    {frontmatter.description && (
                                        <p className="description">
                                            {frontmatter.description}
                                        </p>
                                    )}
                                    <hr className="my-4" />
                                    {frontmatter.ads && <Ad />}
                                </div>
                                <article className="mb-4">
                                    <MDXRemote
                                        {...source}
                                        frontmatter={frontmatter}
                                        components={components}
                                    />
                                </article>
                            </div>
                            <div className="basis-1/4">
                                <div className="sticky top-0">
                                    <ToC headings={headings} />
                                    <Actions />
                                </div>
                            </div>
                        </div>
                        <Metadata slug={slug} frontmatter={frontmatter} />
                        <Giscus
                            id="comments"
                            repo="ceiphr/ceiphr.com"
                            repoId={
                                process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? ''
                            }
                            category={
                                process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? ''
                            }
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
                    <Prompt />
                    <Share />
                </ActionsProvider>
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
    const headings: Heading[] = [];

    const mdxSource = await serialize(content, {
        mdxOptions: {
            remarkPlugins: [remarkMath, remarkCapitalize],
            rehypePlugins: [
                rehypeCodeStatusBar,
                // TODO Get this working
                // https://github.com/rehypejs/rehype-infer-reading-time-meta/blob/main/index.js
                rehypeInferReadingTimeMeta,
                [rehypeKatex, { throwOnError: true, output: 'mathml' }],
                [
                    rehypePrettyCode,
                    {
                        filterMetaString: (string: string) =>
                            string.replace(/path="[^"]*"/, '')
                    }
                ],
                rehypeSlug,
                // Custom rehype plugin to extract headings from MDX
                // and add them to the `headings` array.
                [rehypeExtractHeadings, { rank: 2, headings }],
                [rehypeAutolinkHeadings, { behavior: 'before' }],
                rehypePresetMinify
            ],
            useDynamicImport: true,
            // https://github.com/hashicorp/next-mdx-remote/issues/350#issuecomment-1461558918
            development: process.env.NODE_ENV === 'development'
        },
        scope: data
    });

    return {
        props: {
            source: mdxSource,
            frontmatter: data,
            headings
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
