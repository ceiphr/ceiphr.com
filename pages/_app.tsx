import type { AppProps } from 'next/app';
import { Inter, Unbounded } from 'next/font/google';
import localFont from 'next/font/local';

import classNames from 'classnames';
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
    variable: '--font-unbounded'
});
const monocraft = localFont({
    src: '../assets/fonts/Monocraft.ttf',
    variable: '--font-monocraft'
});
const alternate = localFont({
    src: '../assets/fonts/RubikPixels.ttf',
    variable: '--font-alternate'
});

// TODO Add header for preview mode
// TODO Fix local storage resetting on refresh

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ErrorProvider>
            <div
                className={classNames(
                    inter.variable,
                    unbounded.variable,
                    monocraft.variable,
                    alternate.variable
                )}
            >
                <ModalsProvider>
                    <SettingsProvider>
                        <SkeletonTheme
                            baseColor="#111827"
                            highlightColor="#1a2233"
                        >
                            <Component {...pageProps} />
                        </SkeletonTheme>
                    </SettingsProvider>
                </ModalsProvider>
            </div>
        </ErrorProvider>
    );
}
