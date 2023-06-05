import fs from 'fs';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import path from 'path';

import Giscus from '@giscus/react';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkCapitalize from 'remark-capitalize';
import remarkMath from 'remark-math';

import Layout from '@components/Layout';
import Like from '@components/blog/Like';
import Metadata from '@components/blog/Metadata';
import ToC from '@components/blog/ToC';
import Prompt from '@components/blog/llm/Prompt';
import Container from '@components/blog/mdx/Container';
import CustomImage from '@components/blog/mdx/Image';
import CustomLink from '@components/blog/mdx/Link';
import { POSTS_PATH, postFilePaths } from '@utils/mdx';
import rehypeExtractHeadings from '@utils/rehype-extract-headings';

const Ad = dynamic(() => import('@components/blog/Ad'), {
    ssr: false
});
const Histogram = dynamic(() => import('@components/sa/Histogram'), {
    ssr: false
});

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
    Container,
    Spline: dynamic(() => import('@components/blog/mdx/Spline')),
    Rive: dynamic(() => import('@components/blog/mdx/Rive'))
};

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
                <main className="mx-auto max-w-4xl px-6 mb-4">
                    <div className="flex">
                        <div className="basis-3/4">
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
                                <Like slug={slug} />
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
                        </div>
                        <div className="basis-1/4">
                            <div className="sticky top-0">
                                <ToC headings={headings} />
                                {frontmatter.ads && <Ad />}
                            </div>
                        </div>
                    </div>
                    <Metadata slug={slug} frontmatter={frontmatter} />
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
            <Prompt />
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
                [rehypeKatex, { throwOnError: true, output: 'mathml' }],
                rehypeHighlight,
                rehypeSlug,
                // Custom rehype plugin to extract headings from MDX
                // and add them to the `headings` array.
                [rehypeExtractHeadings, { rank: 2, headings }],
                [rehypeAutolinkHeadings, { behavior: 'before' }]
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
