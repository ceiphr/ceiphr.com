import type { Root } from 'hast';
import { hasProperty } from 'hast-util-has-property';
import { headingRank } from 'hast-util-heading-rank';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';

interface Props {
    headings: Heading[];
}

enum HEADING_RANK {
    TITLE = 1,
    HEADING = 2,
    SUBHEADING = 3
}

/**
 * Extracts headings from a unified tree.
 *
 * To be used *AFTER* the `rehype-slug` plugin.
 *
 * @see https://github.com/hashicorp/next-mdx-remote/issues/231#issuecomment-1028987362
 * @see https://github.com/rehypejs/rehype-slug/blob/4.0.1/index.js
 */
export default function rehypeExtractHeadings({ headings }: Props) {
    return (tree: Root) => {
        visit(tree, 'element', (node) => {
            if (node.properties && hasProperty(node, 'id')) {
                switch (headingRank(node)) {
                    case HEADING_RANK.TITLE:
                        headings.push({
                            title: toString(node),
                            id: ''
                        });
                        break;
                    case HEADING_RANK.HEADING:
                        headings.push({
                            title: toString(node),
                            id: (node.properties!.id ?? '').toString()
                        });
                        break;
                    case HEADING_RANK.SUBHEADING:
                        const lastHeading = headings[headings.length - 1];
                        if (lastHeading) {
                            if (!lastHeading.subheadings)
                                lastHeading.subheadings = [];

                            lastHeading.subheadings.push({
                                title: toString(node),
                                id: (node.properties!.id ?? '').toString()
                            });
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    };
}
