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

    const toggleLike = async () => {
        try {
            const response = await apiAuth.post(`/likes/${post_id}/toggle-like`);

            // Like created
            if (response.status === 201) {
                setCurrentUserLikes(true);
                setLikesCount(prev => prev + 1);
            }

            // Like removed
            if (response.status === 200) {
                setCurrentUserLikes(false);
                setLikesCount(prev => Math.max(prev - 1, 0));
            }

        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    useEffect(() => {
        hasUserLiked();
        fetchLikesCount();
    }, [post_id]);

    return { likesCount, currentUserLikes, toggleLike };
};

export default usePostLikes;
