import type { ReactNode } from 'react';

import Header from '@components/Header';
import Settings from '@components/Settings';

interface Props {
    children: ReactNode;
}

export default function Layout({ children }: Props) {
    return (
        <>
            <Header />
            <div className="pt-14">{children}</div>
            <Settings />
        </>
    );
}
