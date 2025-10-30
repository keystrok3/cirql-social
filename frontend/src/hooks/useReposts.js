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

    const make_repost = async () => {
        try {
            const response = await apiAuth.post(`/reposts/${post_id}/repost`);
            if (response.status === 201) {
                setReposted(true);
                setRepostCount((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Error making repost:", error);
        }
    };

    const undo_repost = async () => {
        try {
            const response = await apiAuth.post(`/reposts/${post_id}/undo-repost`);
            if (response.status === 200) {
                setReposted(false);
                setRepostCount((prev) => Math.max(prev - 1, 0));
            }
        } catch (error) {
            console.error("Error undoing repost:", error);
        }
    };

    useEffect(() => {
        fetch_repost_count();
        check_reposted();
    }, [post_id]);

    return { repostCount, reposted, make_repost, undo_repost };
};

export default useReposts;
