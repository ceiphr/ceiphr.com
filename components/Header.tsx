import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { TbSettings as Settings } from 'react-icons/tb';

import Logo from '@assets/icons/Logo';
import Search from '@components/Search';
import { SettingsModalContext } from '@contexts/useSettings';

enum Pages {
    BLOG = 'Blog',
    PROJECTS = 'Projects',
    SNIPPETS = 'Snippets',
    SANDBOX = 'Sandbox'
}

const Header = () => {
    const [active, setActive] = useState<Pages>();
    const router = useRouter();
    const { setOpen } = useContext(SettingsModalContext);

    useEffect(() => {
        const path = router.pathname.split('/')[1];
        setActive(path as Pages);
    }, [router.pathname]);

    return (
        <div className="h-14 -mb-14 z-10 sticky top-0 flex flex-row justify-between backdrop-blur-xl bg-black/70 border-b border-gray-800">
            <div className="flex flex-row items-center w-80">
                <Link href="/">
                    <Logo className="ml-4 mr-2.5" />
                </Link>
                <p className="font-heading text-lg">Ari Birnbaum</p>
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
                <button
                    onClick={() => setOpen(true)}
                    className="text-md mr-4 ml-2 h-8 w-8 flex flex-col items-center justify-center rounded-lg border border-gray-800 duration-300 hover:bg-gray-900"
                >
                    <Settings className="h-5 w-5 p-px text-gray-400" />
                </button>
            </div>
        </div>
    );
};

export default Header;
