import { useContext, useEffect, useState } from 'react';

import classNames from 'classnames';
import Skeleton from 'react-loading-skeleton';

import Icon from '@components/ui/Icon';
import Tag from '@components/ui/Tag';
import { ActionStatesContext, ActionTypes } from '@contexts/blog/useActions';
import { ArticleContext } from '@contexts/blog/useArticle';
import { ErrorContext, FetchError } from '@contexts/useError';
import { fetchLikeCount, fetchSendLike } from '@lib/fetch';

/**
 * LikeButton will render a button that allows users to like a post. The button
 * will display the number of likes for the post. The button will be disabled if
 * the user has already liked the post.
 *
 * Like counts are cached in Vercel KV, but the user's likes are cached in local storage.
 *
 * @returns     The like button.
 */
const LikeButton = () => {
    const { actionStates, dispatch } = useContext(ActionStatesContext);
    const { article } = useContext(ArticleContext);
    const { handleError } = useContext(ErrorContext);
    const [loading, setLoading] = useState(true);
    const slug = article.slug;

    // Fetch initial likes
    useEffect(() => {
        // Check local storage to see if the user has liked this post
        const userLikes = JSON.parse(localStorage.getItem('likes') || '[]');
        if (userLikes.includes(slug)) {
            dispatch({ type: ActionTypes.SET_LIKE, payload: true });
        }

        fetchLikeCount(slug)
            .then(({ likes }) => {
                dispatch({ type: ActionTypes.SET_LIKE_COUNT, payload: likes });

                if (likes === 0) {
                    // Redis was likely cleared, so user hasn't liked this post
                    // even if they have in the past
                    dispatch({ type: ActionTypes.SET_LIKE, payload: false });
                }
                setLoading(false);
            })
            .catch((error: FetchError) => {
                console.error(error);
                handleError(error.message);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    // Update local storage when the user likes a post
    useEffect(() => {
        if (!actionStates.liked) return;

        // Add slug to likes list in local storage
        const userLikes = JSON.parse(localStorage.getItem('likes') || '[]');
        userLikes.push(slug);
        localStorage.setItem('likes', JSON.stringify(userLikes));
    }, [actionStates.liked, slug]);

    const likePost = () => {
        // Optimistically update the like count and set the userLiked state
        dispatch({ type: ActionTypes.LIKE });

        fetchSendLike(slug).catch((error: FetchError) => {
            // Revert the optimistic update
            dispatch({ type: ActionTypes.UNLIKE });

            console.error(error);
            handleError(error.message);
        });
    };

    return (
        <button
            onClick={likePost}
            className={classNames(actionStates.liked && 'pointer-events-none')}
        >
            <Tag
                className={classNames(
                    'duration-300',
                    actionStates.liked &&
                        'bg-gradient-to-br from-red-800 to-red-900 text-red-400 !border-red-700'
                )}
            >
                <Icon name="heart" className="inline-block" />
                <span>
                    {loading ? <Skeleton width={10} /> : actionStates.likeCount}
                </span>
            </Tag>
        </button>
    );
};

export default LikeButton;
