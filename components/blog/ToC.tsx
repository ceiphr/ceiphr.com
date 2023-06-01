import type { FunctionComponent } from 'react';

interface Props {
    headings: Heading[];
}

// TODO Add on scroll highlight
const ToC: FunctionComponent<Props> = ({ headings }) => {
    return (
        <>
            <h2 className="text-3xl mt-4 mb-2">Table of Contents</h2>
            {headings.map((heading) => {
                return (
                    <div key={heading.id} className="ml-4">
                        <a href={`#${heading.id}`}>{heading.title}</a>
                    </div>
                );
            })}
        </>
    );
};

export default ToC;
