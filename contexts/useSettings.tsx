import { createContext, useEffect, useState } from 'react';

export interface Settings {
    theme: 'light' | 'dark' | 'system';
    motion: boolean;
    ads: boolean;
    shortcuts: boolean;
}

const initialSettings: Settings = {
    theme: 'system',
    motion: true,
    ads: true,
    shortcuts: true
};

export const SettingsContext = createContext<{
    settings: Settings;
    setSettings: (settings: Settings) => void;
}>({
    settings: initialSettings,
    setSettings: () => {}
});
export const SettingsModalContext = createContext<{
    open: boolean;
    setOpen: (open: boolean) => void;
}>({
    open: false,
    setOpen: () => {}
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState(initialSettings);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) setSettings(JSON.parse(savedSettings));
    }, []);

    useEffect(() => {
        localStorage.setItem('settings', JSON.stringify(settings));
    }, [settings]);

    // Change theme based on system preference
    useEffect(() => {
        switch (settings.theme) {
            case 'system':
                const darkQuery = window.matchMedia(
                    '(prefers-color-scheme: dark)'
                );
                darkQuery.addEventListener('change', (e) => {
                    document.documentElement.classList.toggle(
                        'dark',
                        e.matches
                    );
                });
                document.documentElement.classList.toggle(
                    'dark',
                    darkQuery.matches
                );

                return () => darkQuery.removeEventListener('change', () => {});
            case 'dark':
                document.documentElement.classList.add('dark');
                break;
            default:
                document.documentElement.classList.remove('dark');
        }
    }, [settings.theme]);

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            <SettingsModalContext.Provider value={{ open, setOpen }}>
                {children}
            </SettingsModalContext.Provider>
        </SettingsContext.Provider>
    );
}
