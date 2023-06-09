import { FunctionComponent, useContext, useEffect, useState } from 'react';

import classNames from 'classnames';
import Skeleton from 'react-loading-skeleton';

import Icon from '@components/Icon';
import Tag from '@components/Tag';
import { ActionStatesContext, ActionTypes } from '@contexts/blog/useActions';

// TODO Error context

/**
 * LikeButton will render a button that allows users to like a post. The button
 * will display the number of likes for the post. The button will be disabled if
 * the user has already liked the post.
 *
 * Like counts are cached in Vercel KV, but user likes are cached in local storage.
 *
 * @returns     The like button.
 */
const LikeButton: FunctionComponent = () => {
    const { actionStates, dispatch } = useContext(ActionStatesContext);
    const [loading, setLoading] = useState(true);

    // Fetch initial likes
    useEffect(() => {
        // Check local storage to see if the user has liked this post
        const userLikes = localStorage.getItem('likes');
        if (userLikes) {
            const parsedLikes = JSON.parse(userLikes);
            if (parsedLikes.includes(actionStates.slug))
                dispatch({ type: ActionTypes.SET_LIKE, payload: true });
        }

        fetch(`/api/blog/like?slug=${actionStates.slug}`)
            .then((response) => {
                if (response.status !== 200) return;

                return response.json();
            })
            .then(({ likes }) => {
                dispatch({ type: ActionTypes.SET_LIKE_COUNT, payload: likes });
                if (likes === 0) {
                    // Cache was likely cleared, so user hasn't liked this post
                    // even if they have in the past
                    dispatch({ type: ActionTypes.SET_LIKE, payload: false });
                }
                setLoading(false);
            })
            .catch((error) => {});
    }, [actionStates.slug, dispatch]);

    // Update local storage when the user likes a post
    useEffect(() => {
        const userLikes = localStorage.getItem('likes');

        if (actionStates.liked) {
            // Add slug to likes list in local storage
            if (userLikes) {
                const parsedLikes = JSON.parse(userLikes);
                if (!parsedLikes.includes(actionStates.slug)) {
                    parsedLikes.push(actionStates.slug);
                    localStorage.setItem('likes', JSON.stringify(parsedLikes));
                }
            } else {
                // Create likes list in local storage
                localStorage.setItem(
                    'likes',
                    JSON.stringify([actionStates.slug])
                );
            }
        } else {
            // Remove slug from likes list in local storage
            if (userLikes) {
                const parsedLikes = JSON.parse(userLikes);
                if (parsedLikes.includes(actionStates.slug)) {
                    const filteredLikes = parsedLikes.filter(
                        (like: string) => like !== actionStates.slug
                    );
                    localStorage.setItem(
                        'likes',
                        JSON.stringify(filteredLikes)
                    );
                }
            }
        }
    }, [actionStates.liked, actionStates.slug]);

    /**
     * likePost will send a POST request to the API to like the post.
     * If the request is successful, we will update the like count and
     * set the userLiked state to true.
     */
    const likePost = () => {
        fetch('/api/blog/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ slug: actionStates.slug })
        })
            .then(({ status, statusText }) => {
                if (status !== 200) {
                    return;
                }

                dispatch({ type: ActionTypes.SET_LIKE, payload: true });
                dispatch({
                    type: ActionTypes.SET_LIKE_COUNT,
                    payload: actionStates.likeCount + 1
                });
            })
            .catch((error) => {});
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
                    {actionStates.liked
                        ? (() => {
                              return actionStates.likeCount > 1
                                  ? `${actionStates.likeCount} Likes`
                                  : 'Liked';
                          }).call(this)
                        : 'Like'}
                </span>
            </Tag>
        </button>
    );
};

export default LikeButton;
