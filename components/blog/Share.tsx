import { useContext, useState } from 'react';

import { useQRCode } from 'next-qrcode';
import {
    TbBrandFacebook as Facebook,
    TbBrandLinkedin as LinkedIn,
    TbMail as Mail,
    TbBrandReddit as Reddit,
    TbBrandTwitter as Twitter,
    TbX as XIcon
} from 'react-icons/tb';

import Modal from '@components/Modal';
import CopyButton from '@components/blog/CopyButton';
import { ActionStatesContext, ActionTypes } from '@contexts/blog/useActions';

const Share = () => {
    const [selectedDomain, setSelectedDomain] = useState(0);
    // https://stackoverflow.com/a/74831821/9264137
    const {
        actionStates: { shareIsOpen = false },
        dispatch
    } = useContext(ActionStatesContext);
    const { Canvas } = useQRCode();
    const linkShortenerDomains =
        process.env.NEXT_PUBLIC_LINK_SHORTENER_DOMAINS?.split(',') ?? [
            'ceiphr.link'
        ];
    // TODO Use endpoint to get shortened link
    const shortenedLink = `${linkShortenerDomains[selectedDomain]}`;
    const socialMediaLinks = [
        {
            icon: Mail,
            // TODO Change subject
            href: `mailto:?subject=Check out this article!&body=${shortenedLink}`
        },
        {
            icon: Reddit,
            href: `https://reddit.com/submit?url=${shortenedLink}`
        },
        {
            icon: LinkedIn,
            href: `https://www.linkedin.com/shareArticle?url=${shortenedLink}`
        },
        {
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${shortenedLink}`
        },
        {
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?url=${shortenedLink}`
        }
    ];

    return (
        <Modal
            isOpen={shareIsOpen}
            setClosed={() =>
                dispatch({ type: ActionTypes.SET_SHARE, payload: false })
            }
            className="h-lg flex flex-col"
        >
            <div className="w-full flex flex-col items-end justify-between z-10 px-6 py-5 text-gray-300">
                <button
                    className="text-gray-500 hover:text-gray-300"
                    onClick={() => dispatch({ type: ActionTypes.SET_PROMPT })}
                >
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="p-12 h-full flex flex-col justify-center mb-24">
                <h3 className="text-3xl mb-2 font-heading">
                    Share this article.
                </h3>
                <div className="flex flex-row space-x-6 px-4 my-4">
                    <div className="rounded-xl border border-gray-800 overflow-hidden">
                        <Canvas
                            text={`https://${shortenedLink}`}
                            options={{
                                level: 'M',
                                margin: 2.5,
                                scale: 5,
                                width: 200,
                                color: {
                                    dark: '#fff',
                                    light: '#000'
                                }
                            }}
                        />
                    </div>
                    <div className="flex flex-col flex-grow justify-center">
                        <div className="flex flex-row justify-between border border-gray-800 rounded-lg divide-x divide-gray-800">
                            <span className="font-mono text-sm px-4 py-3">
                                {shortenedLink}
                            </span>
                            <CopyButton
                                className="px-3 py-2"
                                value={`https://${shortenedLink}`}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {socialMediaLinks.map(({ icon: Icon, href }) => (
                                <a
                                    key={href}
                                    className="flex flex-row items-center justify-center w-12 h-12 rounded-lg border duration-300 border-gray-800 hover:bg-gray-900"
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Icon className="w-6 h-6" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Share;
