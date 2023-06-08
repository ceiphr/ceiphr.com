import { Dispatch, ReactNode, createContext, useReducer } from 'react';

enum ActionTypes {
    TOGGLE_PROMPT,
    TOGGLE_SHARE,
    TOGGLE_SHORTCUT
}

interface Action {
    type: ActionTypes;
}

interface ActionStates {
    promptIsOpen: boolean;
    shareIsOpen: boolean;
    shortcutIsOpen: boolean;
}

const initialActionStates: ActionStates = {
    promptIsOpen: false,
    shareIsOpen: false,
    shortcutIsOpen: false
};

function reducer(state: ActionStates, action: Action) {
    switch (action.type) {
        case ActionTypes.TOGGLE_PROMPT:
            return {
                shareIsOpen: false,
                shortcutIsOpen: false,
                promptIsOpen: !state.promptIsOpen
            };
        case ActionTypes.TOGGLE_SHARE:
            return {
                promptIsOpen: false,
                shortcutIsOpen: false,
                shareIsOpen: !state.shareIsOpen
            };
        case ActionTypes.TOGGLE_SHORTCUT:
            return {
                promptIsOpen: false,
                shareIsOpen: false,
                shortcutIsOpen: !state.shortcutIsOpen
            };
        default:
            return state;
    }
}

export const ActionStatesContext = createContext<{
    actionStates: ActionStates;
    dispatch: Dispatch<Action>;
}>({
    actionStates: initialActionStates,
    dispatch: () => {}
});

export function ActionsProvider({ children }: { children: ReactNode }) {
    const [actionStates, dispatch] = useReducer(reducer, initialActionStates);

    return (
        <ActionStatesContext.Provider value={{ actionStates, dispatch }}>
            {children}
        </ActionStatesContext.Provider>
    );
}
