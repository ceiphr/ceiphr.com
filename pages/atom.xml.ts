import fs from 'fs';
import { GetServerSideProps } from 'next';
import path from 'path';

import matter from 'gray-matter';

import { POSTS_PATH, postFilePaths } from '@utils/mdx';

const URL = `https://${process.env.NEXT_PUBLIC_DOMAIN}`;

/**
 * Generates the Atom entry for a post.
 *
 * @param post  The post to generate the Atom item for
 * @returns     The Atom item as a string
 */
function generateEntry(post: Post) {
    return `<entry>
        <title>${post.data.title}</title>
        <author>
            <name>${process.env.NEXT_PUBLIC_AUTHOR}</name>
        </author>
        <link href="${URL}/blog/${post.filePath.replace(/\.mdx?$/, '')}" />
        <updated>${new Date(post.data.date).toISOString()}</updated>
        <id>${URL}/blog/${post.filePath.replace(/\.mdx?$/, '')}</id>
        <content type="html"><![CDATA[${post.data.description}]]></content>
    </entry>`;
}

/**
 * Generates the Atom feed for the posts.
 *
 * @param posts The posts to generate the Atom feed for
 * @returns     The Atom feed as a string
 */
function generateAtom(posts: Post[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <title>${process.env.NEXT_PUBLIC_DOMAIN}</title>
    <link href="${URL}/atom.xml" rel="self" />
    <link href="${URL}" />
    <updated>${new Date(posts[0].data.date).toISOString()}</updated>
    <id>${URL}/</id>
    ${posts.map((post) => generateEntry(post)).join('')}
</feed>
    `;
}

/**
 * getServerSideProps does the heavy lifting of generating the Atom feed.
 */
function Atom() {
    return null;
}

/**
 * Pulls the posts from the file system and generates the Atom feed.
 *
 * @param param0  Object containing the response object
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

    // We generate the XML Atom feed with the posts data
    const atom = generateAtom(posts);

    res.setHeader('Content-Type', 'text/xml');
    res.write(atom);
    res.end();

    return {
        props: {}
    };
};

export default Atom;
