import { useRouter } from 'next/router';
import { FunctionComponent, useContext, useEffect, useState } from 'react';

import { useQRCode } from 'next-qrcode';
import { FaHackerNews as HackerNews } from 'react-icons/fa';
import {
    TbBrandFacebook as Facebook,
    TbBrandLinkedin as LinkedIn,
    TbMail as Mail,
    TbBrandReddit as Reddit,
    TbBrandTwitter as Twitter
} from 'react-icons/tb';

import CopyButton from '@components/blog/CopyButton';
import Modal from '@components/ui/Modal';
import { ArticleContext } from '@contexts/useArticle';
import { ActionTypes, ModalsContext } from '@contexts/useModals';
import { fetchShareLinks } from '@lib/fetch';

interface ShareButtonsProps {
    title: string;
    link: string;
}

const ShareButtons: FunctionComponent<ShareButtonsProps> = ({
    title,
    link
}) => {
    const shareLinks = [
        {
            icon: Mail,
            href: `mailto:?subject=${title}&body=${link}`
        },
        {
            icon: Reddit,
            href: `https://reddit.com/submit?url=${link}`
        },
        {
            icon: HackerNews,
            href: `https://news.ycombinator.com/submitlink?u=${link}`
        },
        {
            icon: LinkedIn,
            href: `https://www.linkedin.com/shareArticle?url=${link}`
        },
        {
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${link}`
        },
        {
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?url=${link}`
        }
    ];

    return (
        <>
            {shareLinks.map(({ icon: Icon, href }) => (
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
        </>
    );
};

const Share = () => {
    const { Canvas: QRCode } = useQRCode();
    const router = useRouter();
    const canonicalUrl = `https://${process.env.NEXT_PUBLIC_DOMAIN}${router.asPath}`;

    const [selectedLink, setSelectedLink] = useState<string>(canonicalUrl);
    // TODO Add option to switch between links
    const [links, setLinks] = useState<string[]>([canonicalUrl]);

    const { article } = useContext(ArticleContext);
    const {
        modals: { showShare = false }, // https://stackoverflow.com/a/74831821/9264137
        dispatch
    } = useContext(ModalsContext);

    useEffect(() => {
        if (!showShare) return;

        const slug = router.asPath.split('/').pop();
        if (!slug) return;

        fetchShareLinks(slug).then(({ links }) => {
            setLinks(links);
            setSelectedLink(links[0]);
        });
    }, [showShare, router.asPath]);

    return (
        <Modal
            title="Share this article."
            show={showShare}
            onClose={() =>
                dispatch({ type: ActionTypes.OPEN_SHARE, payload: false })
            }
            className="h-lg flex flex-col"
        >
            <div className="flex flex-row space-x-6 px-4 my-4">
                <div className="rounded-xl border border-gray-800 overflow-hidden">
                    <QRCode
                        text={selectedLink}
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
                            value={selectedLink}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <ShareButtons
                            title={article?.title || ''}
                            link={selectedLink}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Share;
