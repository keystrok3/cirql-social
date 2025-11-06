import { useEffect, useState } from "react";
import { apiAuth } from "../api/axios";

const useReposts = (post_id) => {
    const [repostCount, setRepostCount] = useState(0);
    const [reposted, setReposted] = useState(false);

    const fetch_repost_count = async () => {
        try {
            const response = await apiAuth.get(`/reposts/${post_id}/get-repost-count`);
            if (response.status === 200) {
                setRepostCount(response.data.repost_count);
            } else {
                console.error("Error fetching repost count:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching repost count:", error);
        }
    };

    const check_reposted = async () => {
        try {
            const response = await apiAuth.get(`/reposts/${post_id}/check-repost-status`);
            if (response.status === 200) {
                setReposted(response.data.reposted);
            }
        } catch (error) {
            console.error("Error checking repost status:", error);
        }
    };

    const toggleRepost = async () => {
        try {
            const response = await apiAuth.post(`/reposts/${post_id}/toggle-repost`);

            // Repost created
            if (response.status === 201) {
                setReposted(true);
                setRepostCount(prev => prev + 1);
            }

            // Repost removed
            if (response.status === 200) {
                setReposted(false);
                setRepostCount(prev => Math.max(prev - 1, 0));
            }

        } catch (error) {
            console.error("Error toggling repost:", error);
        }
    };

    useEffect(() => {
        fetch_repost_count();
        check_reposted();
    }, [post_id]);

    return { repostCount, reposted, toggleRepost };
};

export default useReposts;
