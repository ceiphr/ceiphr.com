import NextLink from 'next/link';
import type { FunctionComponent, ReactNode } from 'react';

interface Props {
    href: string;
    children: ReactNode;
}

const Link: FunctionComponent<Props> = ({ href, children }) => {
    const LinkTag = href.startsWith('http') ? 'a' : NextLink;

    return <LinkTag href={href}>{children}</LinkTag>;
};

export default Link;
