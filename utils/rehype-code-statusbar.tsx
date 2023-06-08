import type { Root } from 'hast';
import { toText } from 'hast-util-to-text';
import { visit } from 'unist-util-visit';

/**
 * Adds language, path, and copy button to code blocks.
 *
 * @see https://github.com/mdx-js/mdx/blob/30e4a5d5d561db0b14ec60467ce44d7e3bf27884/website/mdx-config.js
 */
export default function rehypeCodeStatusBar() {
    const re = /\b([-\w]+)(?:=(?:"([^"]*)"|'([^']*)'|([^"'\s]+)))?/g;
    const languageNames = {
        diff: 'Diff',
        html: 'HTML',
        js: 'JavaScript',
        jsx: 'JSX',
        md: 'Markdown',
        mdx: 'MDX',
        sh: 'Shell',
        txt: 'Plain text',
        ts: 'TypeScript'
    };

    return (tree: Root) => {
        visit(tree, 'element', (node, _index, parent) => {
            if (node.tagName !== 'pre') return;

            const code = node.children[0];
            if (
                !code ||
                code.type !== 'element' ||
                code.tagName !== 'code' ||
                node.children.length > 1
            )
                return;

            const metaProps: Record<string, string> = {};
            if (code.data && code.data.meta) {
                let match;
                re.lastIndex = 0; // Reset regex.

                while ((match = re.exec(code.data.meta as string)))
                    metaProps[match[1]] =
                        match[2] || match[3] || match[4] || '';
            }

            const className = code.properties?.className as string[];
            const lang = className
                .find((value: string) => value.slice(0, 9) === 'language-')
                ?.replace('language-', '');

            const children = [node];
            const textContent = toText(node);

            children.unshift({
                // @ts-expect-error: MDX.
                type: 'mdxJsxTextElement',
                name: 'CodeStatusBar',
                attributes: [
                    {
                        type: 'mdxJsxAttribute',
                        name: 'value',
                        value: textContent
                    },
                    {
                        type: 'mdxJsxAttribute',
                        name: 'language',
                        value: lang
                    },
                    {
                        type: 'mdxJsxAttribute',
                        name: 'path',
                        value: metaProps.path || ''
                    }
                ],
                children: []
            });

            parent!.children.splice(parent!.children.indexOf(node), 1, {
                type: 'element',
                tagName: 'div',
                properties: {
                    className: ['code-block']
                },
                children
            });
        });
    };
}
