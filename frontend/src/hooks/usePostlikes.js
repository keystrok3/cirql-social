import { useEffect, useState } from "react";
import { apiAuth } from "../api/axios";

const usePostLikes = (post_id) => {
    const [likesCount, setLikesCount] = useState(0);
    const [currentUserLikes, setCurrentUserLikes] = useState(false);

    const hasUserLiked = async () => {
        try {
            const response = await apiAuth.get(`/likes/${post_id}/likes/check`);
            if (response.status === 200) {
                setCurrentUserLikes(!!response.data.liked);
            } else {
                console.log("Error checking likes:", response.statusText);
            }
        } catch (error) {
            console.error("Error checking likes:", error);
        }
    };

    const fetchLikesCount = async () => {
        try {
            const response = await apiAuth.get(`/likes/${post_id}/likes/count`);
            if (response.status === 200) {
                setLikesCount(response.data.likes);
            } else {
                console.log("Error fetching like count:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching like count:", error);
        }
    };

    const likePost = async () => {
        try {
            const response = await apiAuth.post(`/likes/${post_id}/like-post`);
            if (response.status === 201) {
                setCurrentUserLikes(true);
                setLikesCount(prev => prev + 1);
            } else {
                console.log("Error liking post:", response.statusText);
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const unlikePost = async () => {
        try {
            const response = await apiAuth.post(`/likes/${post_id}/unlike-post`);
            if (response.status === 201) {
                setCurrentUserLikes(false);
                setLikesCount(prev => Math.max(prev - 1, 0));
            } else {
                console.log("Error unliking post:", response.statusText);
            }
        } catch (error) {
            console.error("Error unliking post:", error);
        }
    };

    useEffect(() => {
        // if (post_id) {
        hasUserLiked();
        fetchLikesCount();
        // }
    }, [post_id]);

    return { likesCount, currentUserLikes, likePost, unlikePost };
};

export default usePostLikes;
