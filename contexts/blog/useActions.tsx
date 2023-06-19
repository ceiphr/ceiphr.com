import {
    Dispatch,
    ReactNode,
    createContext,
    useEffect,
    useReducer
} from 'react';

export enum ActionTypes {
    SET_PROMPT,
    SET_SHARE,
    SET_SHORTCUT,
    SET_LIKE,
    SET_LIKE_COUNT,
    LIKE,
    UNLIKE,
    RESET
}

interface Action {
    type: ActionTypes;
    payload?: any;
}

// Note: Not reducer actions, but states for "actions"
//       that can be performed on a blog post
interface ActionStates {
    promptIsOpen: boolean;
    shareIsOpen: boolean;
    shortcutIsOpen: boolean;
    liked: boolean;
    likeCount: number;
}

const initialActionStates: ActionStates = {
    promptIsOpen: false,
    shareIsOpen: false,
    shortcutIsOpen: false,
    liked: false,
    likeCount: 0
};

function resetIsOpen(actionStates: ActionStates) {
    actionStates.promptIsOpen = false;
    actionStates.shareIsOpen = false;
    actionStates.shortcutIsOpen = false;
    return actionStates;
}

function reducer(state: ActionStates, action: Action) {
    const newActionStates = { ...state };

    switch (action.type) {
        case ActionTypes.SET_PROMPT:
            resetIsOpen(newActionStates);
            newActionStates.promptIsOpen = action.payload;
            return newActionStates;
        case ActionTypes.SET_SHARE:
            resetIsOpen(newActionStates);
            newActionStates.shareIsOpen = action.payload;
            return newActionStates;
        case ActionTypes.SET_SHORTCUT:
            resetIsOpen(newActionStates);
            newActionStates.shortcutIsOpen = action.payload;
            return newActionStates;
        case ActionTypes.SET_LIKE:
            newActionStates.liked = action.payload;
            return newActionStates;
        case ActionTypes.SET_LIKE_COUNT:
            newActionStates.likeCount = action.payload;
            return newActionStates;
        case ActionTypes.LIKE:
            newActionStates.liked = true;
            newActionStates.likeCount++;
            return newActionStates;
        case ActionTypes.UNLIKE:
            newActionStates.liked = false;
            newActionStates.likeCount--;
            return newActionStates;
        case ActionTypes.RESET:
            return initialActionStates;
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
        dispatch({ type: ActionTypes.RESET });
    }, [slug]);

    return (
        <ActionStatesContext.Provider value={{ actionStates, dispatch }}>
            {children}
        </ActionStatesContext.Provider>
    );
}
