import { FunctionComponent, ReactNode } from 'react';

import classNames from 'classnames';

interface Props {
    children: ReactNode;
    className?: string;
}

const Tag: FunctionComponent<Props> = ({ children, className }) => {
    return (
        <div
            className={classNames(
                className,
                'flex items-center rounded-full space-x-1.5 px-2.5 py-1 text-sm border overflow-hidden border-gray-800'
            )}
        >
            {children}
        </div>
    );
};

export default Tag;
