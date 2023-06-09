import { useContext, useEffect, useState } from 'react';

import classNames from 'classnames';

import Icon from '@components/Icon';
import Tag from '@components/Tag';
import { ActionStatesContext, ActionTypes } from '@contexts/blog/useActions';

const Actions = () => {
    const { actionStates, dispatch } = useContext(ActionStatesContext);
    const [scrollToTop, setScrollToTop] = useState(false);
    const Tools = {
        Share: {
            onClick: () => dispatch({ type: ActionTypes.TOGGLE_SHARE }),
            shortcut: 'Ctrl+Shift+R',
            Icon: () => <Icon name="share" className="inline-block" />
        },
        'A.R.I.': {
            onClick: () => dispatch({ type: ActionTypes.TOGGLE_PROMPT }),
            shortcut: 'Ctrl+Shift+T',
            Icon: () => <Icon name="zap" className="inline-block" />
        },
        Shortcuts: {
            onClick: () => dispatch({ type: ActionTypes.TOGGLE_SHORTCUT }),
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
                <button
                    onClick={() => dispatch({ type: ActionTypes.LIKE })}
                    className={classNames(
                        actionStates.liked && 'pointer-events-none'
                    )}
                >
                    <Tag
                        className={classNames(
                            'duration-300',
                            actionStates.liked &&
                                'bg-gradient-to-br from-red-800 to-red-900 text-red-400 !border-red-700'
                        )}
                    >
                        <Icon name="heart" className="inline-block" />
                        <span>
                            {actionStates.liked
                                ? (() => {
                                      return actionStates.likes > 1
                                          ? `${actionStates.likes} Likes`
                                          : 'Liked';
                                  }).call(this)
                                : 'Like'}
                        </span>
                    </Tag>
                </button>
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
