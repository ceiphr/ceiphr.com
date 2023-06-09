import { Dispatch, ReactNode, createContext, useReducer } from 'react';

export enum ActionTypes {
    TOGGLE_PROMPT,
    TOGGLE_SHARE,
    TOGGLE_SHORTCUT,
    LIKE
}

interface Action {
    type: ActionTypes;
    payload?: any;
}

interface ActionStates {
    promptIsOpen: boolean;
    shareIsOpen: boolean;
    shortcutIsOpen: boolean;
    liked: boolean;
    likes: number;
}

const initialActionStates: ActionStates = {
    promptIsOpen: false,
    shareIsOpen: false,
    shortcutIsOpen: false,
    liked: false,
    likes: 0
};

// TODO Toggles should be refactored to set state based on payload
function reducer(state: ActionStates, action: Action) {
    switch (action.type) {
        case ActionTypes.TOGGLE_PROMPT:
            return {
                shareIsOpen: false,
                shortcutIsOpen: false,
                promptIsOpen: !state.promptIsOpen,
                liked: state.liked,
                likes: state.likes
            };
        case ActionTypes.TOGGLE_SHARE:
            return {
                promptIsOpen: false,
                shortcutIsOpen: false,
                shareIsOpen: !state.shareIsOpen,
                liked: state.liked,
                likes: state.likes
            };
        case ActionTypes.TOGGLE_SHORTCUT:
            return {
                promptIsOpen: false,
                shareIsOpen: false,
                shortcutIsOpen: !state.shortcutIsOpen,
                liked: state.liked,
                likes: state.likes
            };
        case ActionTypes.LIKE:
            console.log('like');
            return {
                promptIsOpen: false,
                shareIsOpen: false,
                shortcutIsOpen: false,
                liked: true,
                likes: state.likes + 1
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
