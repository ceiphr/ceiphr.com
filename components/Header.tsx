import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { MarkGithubIcon as GitHubIcon } from '@primer/octicons-react';
import { TbSettings as Settings } from 'react-icons/tb';

import Logo from '@assets/icons/Logo';
import Search from '@components/Search';
import { ArticleContext } from '@contexts/useArticle';
import { ActionTypes, ModalsContext } from '@contexts/useModals';

enum Pages {
    BLOG = 'Blog',
    PROJECTS = 'Projects',
    SNIPPETS = 'Snippets',
    SANDBOX = 'Sandbox'
}

const Header = () => {
    const [active, setActive] = useState<Pages>();
    const router = useRouter();
    const { dispatch } = useContext(ModalsContext);
    const { article } = useContext(ArticleContext);
    const name = process.env.NEXT_PUBLIC_AUTHOR;

    // TODO Show title of article in header on scroll

    useEffect(() => {
        const path = router.pathname.split('/')[1];
        setActive(path as Pages);
    }, [router.pathname]);

    return (
        <div className="h-14 z-10 sticky top-0">
            {process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' && (
                <div className="sticky top-0  bg-striped z-50">
                    <p className="text-yellow-900 text-center text-sm py-1">
                        This is a preview build. Content is subject to change.{' '}
                        <a
                            href="https://github.com/ceiphr/ceiphr.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            Track progress on GitHub.
                        </a>
                    </p>
                </div>
            )}
            <div className="flex flex-row justify-between backdrop-blur-xl bg-black/70 border-b border-gray-800">
                <div className="flex flex-row items-center w-80">
                    <Link href="/">
                        <Logo className="ml-4 mr-2.5" />
                    </Link>
                    <p className="font-heading text-lg relative">{name}</p>
                </div>
                <div className="flex flex-row items-center">
                    {Object.values(Pages).map((page) => (
                        <Link
                            key={page}
                            className={`text-sm m-4 ${
                                active === page ? 'text-primary' : ''
                            }`}
                            href={`/${page.toLowerCase()}`}
                            onClick={() => setActive(page)}
                        >
                            {page}
                        </Link>
                    ))}
                </div>
                <div className="flex flex-row items-center w-80">
                    <Search />
                    <a
                        href="https://github.com/ceiphr/ceiphr.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-md ml-2 h-8 w-8 flex flex-col items-center justify-center rounded-lg border border-gray-800 duration-300 hover:bg-gray-900"
                    >
                        <GitHubIcon className="h-5 w-5 p-0.5 text-gray-400" />
                    </a>
                    <button
                        onClick={() =>
                            dispatch({
                                type: ActionTypes.OPEN_SETTINGS,
                                payload: true
                            })
                        }
                        className="text-md mr-4 ml-2 h-8 w-8 flex flex-col items-center justify-center rounded-lg border border-gray-800 duration-300 hover:bg-gray-900"
                    >
                        <Settings className="h-5 w-5 p-px text-gray-400" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;
