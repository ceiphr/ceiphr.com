import { createContext, useEffect, useState } from 'react';

interface Settings {
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

export const SettingsContext = createContext<Settings>(initialSettings);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState(initialSettings);

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
                break;
            case 'dark':
                document.documentElement.classList.add('dark');
                break;
            default:
                document.documentElement.classList.remove('dark');
        }
    }, [settings.theme]);

    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    );
}
