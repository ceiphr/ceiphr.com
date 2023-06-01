import type { Root } from 'hast';
import { hasProperty } from 'hast-util-has-property';
import { headingRank } from 'hast-util-heading-rank';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';

interface Props {
    rank?: number;
    headings: Heading[];
}

/**
 * Extracts headings from a unified tree.
 *
 * To be used *AFTER* the `rehype-slug` plugin.
 *
 * @see https://github.com/hashicorp/next-mdx-remote/issues/231#issuecomment-1028987362
 * @see https://github.com/rehypejs/rehype-slug/blob/4.0.1/index.js
 */
export default function rehypeExtractHeadings({ rank = 2, headings }: Props) {
    return (tree: Root) => {
        visit(tree, 'element', (node) => {
            if (
                headingRank(node) === rank &&
                node.properties &&
                hasProperty(node, 'id')
            ) {
                headings.push({
                    title: toString(node),
                    id: (node.properties!.id ?? '').toString()
                });
            }
        });
    };
}
