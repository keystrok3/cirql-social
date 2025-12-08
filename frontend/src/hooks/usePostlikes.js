import { useEffect, useState } from "react";
import { apiAuth } from "../api/axios";

const usePostLikes = (post_id, refetch_trigger = 0) => {
    const [likesCount, setLikesCount] = useState(0);
    const [currentUserLikes, setCurrentUserLikes] = useState(false);

    useEffect(() => {
        
        const hasUserLiked = async () => {
            try {
                const response = await apiAuth.get(`/likes/${post_id}/likes/check`);
                if (response.status === 200) {
                    setCurrentUserLikes(!!response.data.liked);
                }
            } catch (error) {
                console.error("❌ Error checking likes:", error);
            }
        };

        const fetchLikesCount = async () => {
            try {
                console.log(`📡 Fetching like count for post ${post_id}...`);
                const response = await apiAuth.get(`/likes/${post_id}/likes/count`);
                if (response.status === 200) {
                    setLikesCount(response.data.likes);
                }
            } catch (error) {
                console.error("❌ Error fetching like count:", error);
            }
        };
        
        hasUserLiked();
        fetchLikesCount();
    }, [post_id, refetch_trigger]);

    const toggleLike = async () => {
        try {
            const response = await apiAuth.post(`/likes/${post_id}/toggle-like`);

            if (response.status === 201) {
                setCurrentUserLikes(true);
                setLikesCount(prev => prev + 1);
            }

            if (response.status === 200) {
                setCurrentUserLikes(false);
                setLikesCount(prev => Math.max(prev - 1, 0));
            }

        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };


    return { likesCount, currentUserLikes, toggleLike };
};

export default usePostLikes;