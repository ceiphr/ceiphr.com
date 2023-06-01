import { FunctionComponent, useEffect, useState } from 'react';

interface Props {
    slug: string;
}

// TODO Error context

/**
 * LikeButton will render a button that allows users to like a post. The button
 * will display the number of likes for the post. The button will be disabled if
 * the user has already liked the post.
 *
 * Like counts are cached in Vercel KV, but user likes are cached in local storage.
 *
 * @param param0    The props object contains the post `slug`.
 * @returns         The like button.
 */
const Like: FunctionComponent<Props> = ({ slug }) => {
    const [likes, setLikes] = useState(0);
    const [userLiked, setUserLiked] = useState(false);

    // Fetch initial likes
    useEffect(() => {
        // Check local storage to see if the user has liked this post
        const userLikes = localStorage.getItem('likes');
        if (userLikes) {
            const parsedLikes = JSON.parse(userLikes);
            if (parsedLikes.includes(slug)) {
                setUserLiked(true);
            }
        }

        fetch(`/api/blog/like?slug=${slug}`)
            .then((response) => {
                if (response.status !== 200) {
                    return;
                }

                return response.json();
            })
            .then(({ likes }) => {
                setLikes(likes);
                if (likes === 0) {
                    // Cache was likely cleared, so user hasn't liked this post
                    // even if they have in the past
                    setUserLiked(false);
                }
            })
            .catch((error) => {});
    }, [slug]);

    // Update local storage when the user likes a post
    useEffect(() => {
        const userLikes = localStorage.getItem('likes');

        if (userLiked) {
            // Add slug to likes list in local storage
            if (userLikes) {
                const parsedLikes = JSON.parse(userLikes);
                if (!parsedLikes.includes(slug)) {
                    parsedLikes.push(slug);
                    localStorage.setItem('likes', JSON.stringify(parsedLikes));
                }
            } else {
                // Create likes list in local storage
                localStorage.setItem('likes', JSON.stringify([slug]));
            }
        } else {
            // Remove slug from likes list in local storage
            if (userLikes) {
                const parsedLikes = JSON.parse(userLikes);
                if (parsedLikes.includes(slug)) {
                    const filteredLikes = parsedLikes.filter(
                        (like: string) => like !== slug
                    );
                    localStorage.setItem(
                        'likes',
                        JSON.stringify(filteredLikes)
                    );
                }
            }
        }
    }, [userLiked, slug]);

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
            body: JSON.stringify({ slug })
        })
            .then(({ status, statusText }) => {
                if (status !== 200) {
                    return;
                }

                setUserLiked(true);
                setLikes(likes + 1);
            })
            .catch((error) => {});
    };

    return (
        <div>
            <p>{likes} Likes</p>
            <button onClick={likePost}>Like this post?</button>
            {userLiked && <p>You liked this post!</p>}
        </div>
    );
};

export default Like;
