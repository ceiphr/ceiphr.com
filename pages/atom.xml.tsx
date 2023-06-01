import fs from 'fs';
import { GetServerSideProps } from 'next';
import path from 'path';

import matter from 'gray-matter';

import { POSTS_PATH, postFilePaths } from '@utils/mdx';

function generateAtom(posts: Post[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <title>${process.env.DOMAIN}</title>
    <link href="https://${process.env.DOMAIN}/atom.xml" rel="self" />
    <link href="https://${process.env.DOMAIN}/" />
    <updated>${new Date(posts[0].data.date).toISOString()}</updated>
    <id>https://${process.env.DOMAIN}/</id>
    ${posts
        .map(
            (post) => `<entry>
        <title>${post.data.title}</title>
        <link href="https://${process.env.DOMAIN}/blog/${post.filePath.replace(
                /\.mdx?$/,
                ''
            )}" />
        <updated>${new Date(post.data.date).toISOString()}</updated>
        <id>https://${process.env.DOMAIN}/blog/${post.filePath.replace(
                /\.mdx?$/,
                ''
            )}</id>
        <content type="html"><![CDATA[${post.data.description}]]></content>
    </entry>`
        )
        .join('')}
</feed>
    `;
}

function Atom() {
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
    const atom = generateAtom(posts);

    res.setHeader('Content-Type', 'text/xml');
    res.write(atom);
    res.end();

    return {
        props: {}
    };
};

export default Atom;
