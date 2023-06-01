import fs from 'fs';
import { GetServerSideProps } from 'next';
import path from 'path';

import matter from 'gray-matter';

import { POSTS_PATH, postFilePaths } from '@utils/mdx';

/**
 * Generates the RSS item for a post.
 *
 * @param post  The post to generate the RSS item for.
 * @returns     The RSS item as a string.
 */
function generateItem(post: Post) {
    return `<item>
            <title>${post.data.title}</title>
            <link>https://${
                process.env.NEXT_PUBLIC_DOMAIN
            }/blog/${post.filePath.replace(/\.mdx?$/, '')}</link>
            <description>${post.data.description}</description>
            <pubDate>${new Date(post.data.date).toUTCString()}</pubDate>
            <guid>https://${
                process.env.NEXT_PUBLIC_DOMAIN
            }/blog/${post.filePath.replace(/\.mdx?$/, '')}</guid>
        </item>`;
}

/**
 * Generates the RSS feed for the posts.
 *
 * @param posts The posts to generate the RSS feed for.
 * @returns     The RSS feed as a string.
 */
function generateRSS(posts: Post[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${process.env.NEXT_PUBLIC_DOMAIN}</title>
        <link>https://${process.env.NEXT_PUBLIC_DOMAIN}</link>
        <description>Blog posts from ${
            process.env.NEXT_PUBLIC_DOMAIN
        }</description>
        <language>en</language>
        <lastBuildDate>${new Date(
            posts[0].data.date
        ).toUTCString()}</lastBuildDate>
        <atom:link href="https://${
            process.env.NEXT_PUBLIC_DOMAIN
        }/rss.xml" rel="self" type="application/rss+xml" />
        ${posts.map((post) => generateItem(post)).join('')}
    </channel>
</rss>
    `;
}

/**
 * getServerSideProps does the heavy lifting of generating the RSS feed.
 */
function RSS() {
    return null;
}

/**
 * Pulls the posts from the file system and generates the RSS feed.
 *
 * @param param0  Object containing the response object.
 */
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const posts = postFilePaths.map((filePath) => {
        const source = fs.readFileSync(path.join(POSTS_PATH, filePath));
        const { content, data } = matter(source);

        return {
            content,
            data,
            filePath
        };
    });

    // We generate the XML RSS feed with the posts data
    const rss = generateRSS(posts);

    res.setHeader('Content-Type', 'text/xml');
    res.write(rss);
    res.end();

    return {
        props: {}
    };
};

export default RSS;
