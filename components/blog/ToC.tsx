import { FunctionComponent, useEffect, useState } from 'react';

import classNames from 'classnames';

interface Props {
    headings: Heading[];
}

const ToC: FunctionComponent<Props> = ({ headings }) => {
    const [activeHeading, setActiveHeading] = useState<Heading | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const heading = headings.find((heading) => {
                const element = document.getElementById(heading.id);

                if (!element) return false;

                const rect = element.getBoundingClientRect();
                return rect.top >= 0 && rect.bottom <= window.innerHeight;
            });
            if (heading) setActiveHeading(heading);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });

    return (
        <>
            <h2 className="text-xl mt-4 mb-2">Table of Contents</h2>
            {headings.map((heading) => {
                return (
                    <div
                        key={heading.id}
                        className={classNames('ml-4', {
                            'text-blue-500': activeHeading?.id === heading.id
                        })}
                    >
                        <a href={`#${heading.id}`}>{heading.title}</a>
                    </div>
                );
            })}
        </>
    );
};

export default ToC;
