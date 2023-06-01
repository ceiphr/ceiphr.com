import fs from 'fs';
import { GetServerSideProps } from 'next';
import path from 'path';

import matter from 'gray-matter';

import { POSTS_PATH, postFilePaths } from '@utils/mdx';

function generateSiteMap(posts: Post[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://${process.env.DOMAIN}/</loc>
        <lastmod>${
            new Date(posts[0].data.date).toISOString().split('T')[0]
        }</lastmod>
        <priority>1.0</priority>
    </url>
    ${posts
        .map(
            (post: Post) => `<url>
        <loc>https://${process.env.DOMAIN}/blog/${post.filePath.replace(
                /\.mdx?$/,
                ''
            )}</loc>
        <lastmod>${
            new Date(post.data.date).toISOString().split('T')[0]
        }</lastmod>
        <priority>0.8</priority>
    </url>`
        )
        .join('')}
</urlset>
    `;
}

function Sitemap() {
    return <></>;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const posts = postFilePaths.map((filePath): Post => {
        const source = fs.readFileSync(path.join(POSTS_PATH, filePath));
        const { content, data } = matter(source);

        return {
            content,
            data,
            filePath
        };
    });

    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap(posts);

    res.setHeader('Content-Type', 'text/xml');
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {}
    };
};

export default Sitemap;
