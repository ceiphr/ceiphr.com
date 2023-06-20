import { Dispatch, ReactNode, createContext, useReducer } from 'react';

export enum ActionTypes {
    OPEN_PROMPT,
    OPEN_SHARE,
    OPEN_SHORTCUTS,
    OPEN_SEARCH,
    OPEN_SETTINGS
}

export interface Action {
    type: ActionTypes;
    payload?: any;
}

interface Modals {
    showPrompt: boolean;
    showShare: boolean;
    showShortcuts: boolean;
    showSearch: boolean;
    showSettings: boolean;
}

const initialModal: Modals = {
    showPrompt: false,
    showShare: false,
    showShortcuts: false,
    showSearch: false,
    showSettings: false
};

const resetOpen = (modal: Modals) =>
    Object.keys(modal).forEach((key) => (modal[key as keyof Modals] = false));

function reducer(state: Modals, action: Action) {
    const newModals = { ...state };
    resetOpen(newModals);

    switch (action.type) {
        case ActionTypes.OPEN_PROMPT:
            newModals.showPrompt = action.payload;
            return newModals;
        case ActionTypes.OPEN_SHARE:
            newModals.showShare = action.payload;
            return newModals;
        case ActionTypes.OPEN_SHORTCUTS:
            newModals.showShortcuts = action.payload;
            return newModals;
        case ActionTypes.OPEN_SEARCH:
            newModals.showSearch = action.payload;
            return newModals;
        case ActionTypes.OPEN_SETTINGS:
            newModals.showSettings = action.payload;
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
