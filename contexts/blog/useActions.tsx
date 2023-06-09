import { stat } from 'fs';
import {
    Dispatch,
    ReactNode,
    createContext,
    useEffect,
    useReducer
} from 'react';

export enum ActionTypes {
    SET_SLUG,
    SET_PROMPT,
    SET_SHARE,
    SET_SHORTCUT,
    SET_LIKE,
    SET_LIKE_COUNT
}

interface Action {
    type: ActionTypes;
    payload?: any;
}

interface ActionStates {
    slug: string;
    promptIsOpen: boolean;
    shareIsOpen: boolean;
    shortcutIsOpen: boolean;
    liked: boolean;
    likeCount: number;
}

const initialActionStates: ActionStates = {
    slug: '',
    promptIsOpen: false,
    shareIsOpen: false,
    shortcutIsOpen: false,
    liked: false,
    likeCount: 0
};

function reducer(state: ActionStates, action: Action) {
    switch (action.type) {
        case ActionTypes.SET_SLUG:
            return {
                slug: action.payload,
                promptIsOpen: false,
                shareIsOpen: false,
                shortcutIsOpen: false,
                liked: false,
                likeCount: 0
            };
        case ActionTypes.SET_PROMPT:
            return {
                slug: state.slug,
                shareIsOpen: false,
                shortcutIsOpen: false,
                promptIsOpen: action.payload,
                liked: state.liked,
                likeCount: state.likeCount
            };
        case ActionTypes.SET_SHARE:
            return {
                slug: state.slug,
                promptIsOpen: false,
                shortcutIsOpen: false,
                shareIsOpen: action.payload,
                liked: state.liked,
                likeCount: state.likeCount
            };
        case ActionTypes.SET_SHORTCUT:
            return {
                slug: state.slug,
                promptIsOpen: false,
                shareIsOpen: false,
                shortcutIsOpen: action.payload,
                liked: state.liked,
                likeCount: state.likeCount
            };
        case ActionTypes.SET_LIKE:
            return {
                slug: state.slug,
                promptIsOpen: false,
                shareIsOpen: false,
                shortcutIsOpen: false,
                liked: action.payload,
                likeCount: state.likeCount + 1
            };
        case ActionTypes.SET_LIKE_COUNT:
            return {
                slug: state.slug,
                promptIsOpen: false,
                shareIsOpen: false,
                shortcutIsOpen: false,
                liked: state.liked,
                likeCount: action.payload
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

export function ActionsProvider({
    children,
    slug
}: {
    children: ReactNode;
    slug: string;
}) {
    const [actionStates, dispatch] = useReducer(reducer, initialActionStates);

    useEffect(() => {
        dispatch({ type: ActionTypes.SET_SLUG, payload: slug });
    }, [slug]);

    return (
        <ActionStatesContext.Provider value={{ actionStates, dispatch }}>
            {children}
        </ActionStatesContext.Provider>
    );
}
