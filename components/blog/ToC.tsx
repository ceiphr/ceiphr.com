import {
    FunctionComponent,
    use,
    useCallback,
    useEffect,
    useState
} from 'react';

import classNames from 'classnames';

interface Props {
    headings: Heading[];
}

const removeURLHash = () => {
    const currentURL = window.location.href;
    window.history.replaceState(null, '', currentURL.split('#')[0]);
};

const highlightHeading = (headings: Heading[]) =>
    headings.find((heading) => {
        const element = document.getElementById(heading.id);

        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
    });

const ToC: FunctionComponent<Props> = ({ headings }) => {
    const [activeHeading, setActiveHeading] = useState<Heading | null>(null);

    const handleScroll = useCallback(() => {
        const heading = highlightHeading(headings);

        if (heading) {
            if (heading.subheadings) {
                const subheading = highlightHeading(heading.subheadings);

                if (subheading) {
                    setActiveHeading(subheading);
                    return;
                }
            }

            setActiveHeading(heading);
        }
    }, [headings]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // Check if either ctrl or cmd is pressed along with up/down arrow
            if (e.shiftKey) {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();

                    const currentIndex = headings.findIndex(
                        (heading) => heading.id === activeHeading?.id
                    );
                    switch (currentIndex) {
                        case -1:
                            return;
                        case 0:
                            if (e.key === 'ArrowUp') {
                                window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth'
                                });
                                removeURLHash();
                            }
                            return;
                        case headings.length:
                            if (e.key === 'ArrowDown') {
                                window.scrollTo({
                                    top: document.body.scrollHeight,
                                    behavior: 'smooth'
                                });
                                removeURLHash();
                            }
                            return;
                    }

                    let nextIndex = 0;
                    switch (e.key) {
                        case 'ArrowUp':
                            nextIndex = currentIndex - 1;
                            break;
                        case 'ArrowDown':
                            nextIndex = currentIndex + 1;
                            break;
                    }
                    if (nextIndex < 0 || nextIndex >= headings.length) return;

                    const nextHeading = headings[nextIndex];
                    if (!nextHeading) return;

                    const element = document.getElementById(nextHeading.id);
                    if (!element) return;

                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'nearest'
                    });

                    // Add a hash to the URL
                    window.history.replaceState(null, '', `#${nextHeading.id}`);
                }
            }
        },
        [activeHeading, headings]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown, handleScroll]);

    useEffect(() => {
        // Check if the URL has a hash
        handleScroll();
    }, [handleScroll]);

    return (
        <div className="px-4 py-1">
            <h2 className="text-lg font-heading leading-6 mt-4 mb-2">
                Table of Contents
            </h2>
            {headings.map((heading) => {
                return (
                    <div
                        key={heading.id}
                        className={classNames('ml-4 duration-1000', {
                            'text-blue-500': activeHeading?.id === heading.id
                        })}
                    >
                        <a href={`#${heading.id}`}>{heading.title}</a>
                        {heading.subheadings &&
                            heading.subheadings.map((subheading) => {
                                return (
                                    <div
                                        key={subheading.id}
                                        className={classNames(
                                            'ml-3 duration-1000',
                                            {
                                                'text-blue-500':
                                                    activeHeading?.id ===
                                                    subheading.id
                                            }
                                        )}
                                    >
                                        <a href={`#${subheading.id}`}>
                                            {subheading.title}
                                        </a>
                                    </div>
                                );
                            })}
                    </div>
                );
            })}
        </div>
    );
};

export default ToC;
