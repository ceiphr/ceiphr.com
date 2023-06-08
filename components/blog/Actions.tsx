import React from 'react';

const Actions = () => {
    const Tools = {
        Like: {
            onClick: () => {
                console.log('Like');
            },
            shortcut: 'Ctrl+Shift+L',
            icon: '👍'
        },
        Share: {
            onClick: () => {
                console.log('Share');
            },
            shortcut: 'Ctrl+Shift+R',
            icon: '📤'
        },
        Comment: {
            onClick: () => {
                console.log('Comment');
            },
            shortcut: 'Ctrl+Shift+C',
            icon: '💬'
        },
        'A.R.I.': {
            onClick: () => {
                console.log('Talk to A.R.I.');
            },
            shortcut: 'Ctrl+Shift+T',
            icon: '🤖'
        },
        'Keyboard Shortcuts': {
            onClick: () => {
                console.log('Keyboard Shortcuts');
            },
            shortcut: 'Ctrl+Shift+S',
            icon: '⌨️'
        }
    };

    return (
        <div className="px-4">
            <h2 className="text-lg font-heading leading-6 mt-4 mb-2">
                Actions
            </h2>
            <div className="gap-y-2 gap-x-1.5 ml-2 mt-3 flex flex-wrap">
                {Object.entries(Tools).map(
                    ([name, { onClick, shortcut, icon }]) => (
                        <button
                            key={name}
                            className="flex items-center rounded-full px-2 py-1 text-sm border border-gray-800"
                            onClick={onClick}
                        >
                            <span className="pr-2">{icon}</span>
                            <span className="text-gray-600">{name}</span>
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default Actions;
