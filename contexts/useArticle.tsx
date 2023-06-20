import {
    Dispatch,
    ReactNode,
    createContext,
    useEffect,
    useReducer
} from 'react';

export enum ActionTypes {
    SET_ARTICLE,
    SET_SLUG,
    SET_TITLE,
    SET_LIKE,
    SET_LIKE_COUNT,
    SET_DESCRIPTION,
    SET_ESTIMATED_READING_TIME,
    LIKE,
    UNLIKE
}

interface Action {
    type: ActionTypes;
    payload?: any;
}

export interface Article {
    slug: string;
    title: string;
    description: string;
    liked?: boolean;
    likeCount?: number;
    estimatedReadingTime?: number; // In minutes
}

const initialArticle: Article = {
    slug: '',
    title: '',
    description: '',
    liked: false,
    likeCount: 0,
    estimatedReadingTime: 0
};

function reducer(state: Article, action: Action) {
    const newArticle = { ...state };

    switch (action.type) {
        case ActionTypes.SET_ARTICLE:
            return action.payload;
        case ActionTypes.SET_SLUG:
            newArticle.slug = action.payload;
            return newArticle;
        case ActionTypes.SET_TITLE:
            newArticle.title = action.payload;
            return newArticle;
        case ActionTypes.SET_DESCRIPTION:
            newArticle.description = action.payload;
            return newArticle;
        case ActionTypes.SET_LIKE:
            newArticle.liked = action.payload;
            return newArticle;
        case ActionTypes.SET_LIKE_COUNT:
            newArticle.likeCount = action.payload;
            return newArticle;
        case ActionTypes.LIKE:
            newArticle.liked = true;
            newArticle.likeCount
                ? newArticle.likeCount++
                : (newArticle.likeCount = 1);
            return newArticle;
        case ActionTypes.UNLIKE:
            newArticle.liked = false;
            newArticle.likeCount
                ? newArticle.likeCount--
                : (newArticle.likeCount = 0);
            return newArticle;
        case ActionTypes.SET_ESTIMATED_READING_TIME:
            newArticle.estimatedReadingTime = action.payload;
            return newArticle;
        default:
            return state;
    }
}

export const ArticleContext = createContext<{
    article: Article;
    dispatch: Dispatch<Action>;
}>({
    article: initialArticle,
    dispatch: () => {}
});

export function ArticleProvider({
    children,
    article: providedArticle
}: {
    children: ReactNode;
    article: Article;
}) {
    const [article, dispatch] = useReducer(reducer, providedArticle);

    useEffect(() => {
        dispatch({
            type: ActionTypes.SET_ARTICLE,
            payload: providedArticle
        });
    }, [providedArticle]);

    return (
        <ArticleContext.Provider value={{ article, dispatch }}>
            {children}
        </ArticleContext.Provider>
    );
}
