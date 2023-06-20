import { Dispatch, ReactNode, createContext, useReducer } from 'react';

export enum ActionTypes {
    SET_PROMPT,
    SET_SHARE,
    SET_SHORTCUTS,
    SET_SEARCH,
    SET_SETTINGS,
    TOGGLE_PROMPT,
    TOGGLE_SHARE,
    TOGGLE_SHORTCUTS,
    TOGGLE_SEARCH,
    TOGGLE_SETTINGS
}

interface Action {
    type: ActionTypes;
    payload?: any;
}

interface Modals {
    promptOpen: boolean;
    shareOpen: boolean;
    shortcutsOpen: boolean;
    searchOpen: boolean;
    settingsOpen: boolean;
}

const initialModal: Modals = {
    promptOpen: false,
    shareOpen: false,
    shortcutsOpen: false,
    searchOpen: false,
    settingsOpen: false
};

const resetOpen = (modal: Modals) =>
    Object.keys(modal).forEach((key) => (modal[key as keyof Modals] = false));

function reducer(state: Modals, action: Action) {
    const newModals = { ...state };
    resetOpen(newModals);

    switch (action.type) {
        case ActionTypes.SET_PROMPT:
            newModals.promptOpen = action.payload;
            return newModals;
        case ActionTypes.SET_SHARE:
            newModals.shareOpen = action.payload;
            return newModals;
        case ActionTypes.SET_SHORTCUTS:
            newModals.shortcutsOpen = action.payload;
            return newModals;
        case ActionTypes.SET_SEARCH:
            newModals.searchOpen = action.payload;
            return newModals;
        case ActionTypes.SET_SETTINGS:
            newModals.settingsOpen = action.payload;
            return newModals;
        case ActionTypes.TOGGLE_PROMPT:
            newModals.promptOpen = !newModals.promptOpen;
            return newModals;
        case ActionTypes.TOGGLE_SHARE:
            newModals.shareOpen = !newModals.shareOpen;
            return newModals;
        case ActionTypes.TOGGLE_SHORTCUTS:
            newModals.shortcutsOpen = !newModals.shortcutsOpen;
            return newModals;
        case ActionTypes.TOGGLE_SEARCH:
            newModals.searchOpen = !newModals.searchOpen;
            return newModals;
        case ActionTypes.TOGGLE_SETTINGS:
            newModals.settingsOpen = !newModals.settingsOpen;
            return newModals;
        default:
            return state;
    }
}

export const ModalsContext = createContext<{
    modals: Modals;
    dispatch: Dispatch<Action>;
}>({
    modals: initialModal,
    dispatch: () => {}
});

export function ModalsProvider({ children }: { children: ReactNode }) {
    const [modals, dispatch] = useReducer(reducer, initialModal);

    return (
        <ModalsContext.Provider value={{ modals, dispatch }}>
            {children}
        </ModalsContext.Provider>
    );
}
