import { useContext, useEffect, useState } from 'react';

import classNames from 'classnames';

import Icon from '@components/Icon';
import Tag from '@components/Tag';
import LikeButton from '@components/blog/LikeButton';
import { ActionStatesContext, ActionTypes } from '@contexts/blog/useActions';

const Actions = () => {
    const { actionStates, dispatch } = useContext(ActionStatesContext);
    const [scrollToTop, setScrollToTop] = useState(false);
    const Tools = {
        Share: {
            onClick: () =>
                dispatch({ type: ActionTypes.SET_SHARE, payload: true }),
            shortcut: 'Ctrl+Shift+R',
            Icon: () => <Icon name="share" className="inline-block" />
        },
        'A.R.I.': {
            onClick: () =>
                dispatch({ type: ActionTypes.SET_PROMPT, payload: true }),
            shortcut: 'Ctrl+Shift+T',
            Icon: () => <Icon name="zap" className="inline-block" />
        },
        Shortcuts: {
            onClick: () =>
                dispatch({ type: ActionTypes.SET_SHORTCUT, payload: true }),
            shortcut: 'Ctrl+Shift+S',
            Icon: () => <Icon name="keyboard" className="inline-block" />
        },
        Comment: {
            onClick: () => {
                const comments = document.getElementById('comments');
                if (comments) comments.scrollIntoView({ behavior: 'smooth' });
            },
            shortcut: 'Ctrl+Shift+C',
            Icon: () => <Icon name="message" className="inline-block" />
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setScrollToTop(true);
            } else {
                setScrollToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="px-4">
            <h2 className="text-lg font-heading leading-6 mt-4 mb-2">
                Actions
            </h2>
            <div className="gap-y-2 gap-x-1.5 ml-2 mt-3 flex flex-wrap text-gray-500">
                <LikeButton />
                {Object.entries(Tools).map(
                    ([name, { onClick, shortcut, Icon }]) => (
                        <button key={name} onClick={onClick}>
                            <Tag>
                                <Icon />
                                <span>{name}</span>
                            </Tag>
                        </button>
                    )
                )}
                <button
                    onClick={() => {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }}
                    className={classNames(
                        'duration-1000',
                        !scrollToTop && 'opacity-0 pointer-events-none'
                    )}
                >
                    <Tag>
                        <Icon name="arrow-up" />
                        <span>Top</span>
                    </Tag>
                </button>
            </div>
        </div>
    );
};

export default Actions;
