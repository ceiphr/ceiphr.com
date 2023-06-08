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

    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    );
}
