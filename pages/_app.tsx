import type { AppProps } from 'next/app';
import { Inter, Unbounded } from 'next/font/google';
import localFont from 'next/font/local';

import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tooltip/dist/react-tooltip.css';

import { ErrorProvider } from '@contexts/useError';
import { ModalsProvider } from '@contexts/useModals';
import { SettingsProvider } from '@contexts/useSettings';
import '@styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const unbounded = Unbounded({
    subsets: ['latin'],
    variable: '--font-unbounded',
    display: 'swap',
    adjustFontFallback: false
});
const monocraft = localFont({
    src: '../assets/fonts/Monocraft.ttf',
    variable: '--font-monocraft'
});

// TODO Fix local storage resetting on refresh

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ErrorProvider>
            <ModalsProvider>
                <SettingsProvider>
                    {/* https://github.com/vercel/next.js/issues/43674#issuecomment-1361664355 */}
                    <style jsx global>{`
                        :root {
                            --font-inter: ${inter.style.fontFamily};
                            --font-unbounded: ${unbounded.style.fontFamily};
                            --font-monocraft: ${monocraft.style.fontFamily};
                        }
                    `}</style>
                    <SkeletonTheme baseColor="#111827" highlightColor="#1a2233">
                        <Component {...pageProps} />
                    </SkeletonTheme>
                </SettingsProvider>
            </ModalsProvider>
        </ErrorProvider>
    );
}
