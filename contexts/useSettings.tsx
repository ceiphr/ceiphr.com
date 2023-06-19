import {
    Dispatch,
    createContext,
    useCallback,
    useEffect,
    useReducer,
    useState
} from 'react';

export enum ActionTypes {
    SET_THEME,
    SET_MOTION,
    SET_ADS,
    SET_SHORTCUTS,
    RESTORE_SETTINGS,
    RESET_SETTINGS
}

interface Action {
    type: ActionTypes;
    payload?: any;
}

export interface Settings {
    theme: 'light' | 'dark' | 'system';
    motion: 'reduced' | 'normal' | 'none' | 'system';
    ads: boolean;
    shortcuts: boolean;
}

const initialSettings: Settings = {
    theme: 'system',
    motion: 'system',
    ads: true,
    shortcuts: true
};

function isDefaultSettings(settings: Settings) {
    return (
        settings.theme === initialSettings.theme &&
        settings.motion === initialSettings.motion &&
        settings.ads === initialSettings.ads &&
        settings.shortcuts === initialSettings.shortcuts
    );
}

function reducer(state: Settings, action: Action): Settings {
    const newSettings = { ...state };

    switch (action.type) {
        case ActionTypes.SET_THEME:
            newSettings.theme = action.payload;
            return newSettings;
        case ActionTypes.SET_MOTION:
            newSettings.motion = action.payload;
            return newSettings;
        case ActionTypes.SET_ADS:
            newSettings.ads = action.payload;
            return newSettings;
        case ActionTypes.SET_SHORTCUTS:
            newSettings.shortcuts = action.payload;
            return newSettings;
        case ActionTypes.RESTORE_SETTINGS:
            return action.payload;
        case ActionTypes.RESET_SETTINGS:
            return initialSettings;
        default:
            return state;
    }
}

export const SettingsContext = createContext<{
    settings: Settings;
    dispatch: Dispatch<Action>;
}>({
    settings: initialSettings,
    dispatch: () => {}
});

export const SettingsModalContext = createContext<{
    open: boolean;
    setOpen: (open: boolean) => void;
}>({
    open: false,
    setOpen: () => {}
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, dispatch] = useReducer(reducer, initialSettings);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            dispatch({
                type: ActionTypes.RESTORE_SETTINGS,
                payload: JSON.parse(savedSettings)
            });
        }
    }, []);

    useEffect(() => {
        if (isDefaultSettings(settings)) return;
        localStorage.setItem('settings', JSON.stringify(settings));
    }, [settings]);

    const systemThemeListener = useCallback(() => {
        const documentClasses = document.documentElement.classList;
        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkQuery.addEventListener('change', (e) => {
            documentClasses.toggle('dark', e.matches);
        });
        documentClasses.toggle('dark', darkQuery.matches);

        return () => darkQuery.removeEventListener('change', () => {});
    }, []);

    // Change theme based on system preference
    useEffect(() => {
        const documentClasses = document.documentElement.classList;
        switch (settings.theme) {
            case 'system':
                return systemThemeListener();
            case 'dark':
                documentClasses.add('dark');
                break;
            default:
                documentClasses.remove('dark');
        }
    }, [settings.theme, systemThemeListener]);

    return (
        <SettingsContext.Provider value={{ settings, dispatch }}>
            <SettingsModalContext.Provider value={{ open, setOpen }}>
                {children}
            </SettingsModalContext.Provider>
        </SettingsContext.Provider>
    );
}
