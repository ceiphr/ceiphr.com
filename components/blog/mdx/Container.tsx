import type { FunctionComponent, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const Container: FunctionComponent<Props> = ({ children }) => {
    return (
        <div className="rounded-xl my-6 bg-neutral-900">
            <div className="flex justify-center">{children}</div>
        </div>
    );
};

export default Container;
