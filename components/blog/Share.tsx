import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { useQRCode } from 'next-qrcode';
import { FaHackerNews as HackerNews } from 'react-icons/fa';
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
import { fetchShareLinks } from '@lib/fetch';

const Share = () => {
    const router = useRouter();
    const canonicalUrl = `https://${process.env.NEXT_PUBLIC_DOMAIN}${router.asPath}`;
    const [selectedLink, setSelectedLink] = useState<string>(canonicalUrl);
    const [shortenedLinks, setShortenedLinks] = useState<string[]>([
        canonicalUrl
    ]);
    const { Canvas } = useQRCode();

    // https://stackoverflow.com/a/74831821/9264137
    const {
        actionStates: { shareIsOpen = false },
        dispatch
    } = useContext(ActionStatesContext);

    const socialMediaLinks = [
        {
            icon: Mail,
            // TODO Change subject
            href: `mailto:?subject=Check out this article!&body=${selectedLink}`
        },
        {
            icon: Reddit,
            href: `https://reddit.com/submit?url=${selectedLink}`
        },
        {
            icon: HackerNews,
            href: `https://news.ycombinator.com/submitlink?u=${selectedLink}`
        },
        {
            icon: LinkedIn,
            href: `https://www.linkedin.com/shareArticle?url=${selectedLink}`
        },
        {
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${selectedLink}`
        },
        {
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?url=${selectedLink}`
        }
    ];

    useEffect(() => {
        if (!shareIsOpen) return;

        const slug = window.location.pathname.split('/').pop();
        if (!slug) return;

        fetchShareLinks(slug).then(({ links }) => {
            console.log(links);
            setShortenedLinks(links);
            setSelectedLink(links[0]);
        });
    }, [shareIsOpen]);

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
                            text={`https://${selectedLink}`}
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
                                {selectedLink}
                            </span>
                            <CopyButton
                                className="px-3 py-2"
                                value={`https://${selectedLink}`}
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
