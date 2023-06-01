import fs from 'fs';
import { GetServerSideProps } from 'next';
import path from 'path';

import matter from 'gray-matter';

import { POSTS_PATH, postFilePaths } from '@utils/mdx';

function generateRSS(posts: Post[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
    <channel>
        <title>${process.env.DOMAIN}</title>
        <link>https://${process.env.DOMAIN}</link>
        <description>Blog posts from ${process.env.DOMAIN}</description>
        <language>en</language>
        <lastBuildDate>${new Date(
            posts[0].data.date
        ).toUTCString()}</lastBuildDate>
        ${posts
            .map(
                (post) => `<item>
            <title>${post.data.title}</title>
            <link>https://${process.env.DOMAIN}/blog/${post.filePath.replace(
                    /\.mdx?$/,
                    ''
                )}</link>
            <description>${post.data.description}</description>
            <pubDate>${new Date(post.data.date).toUTCString()}</pubDate>
        </item>`
            )
            .join('')}
    </channel>
</rss>
    `;
}

function RSS() {
    return <></>;
}

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
