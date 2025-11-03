import { useState } from "react";
import { apiAuth } from "../api/axios";
import { useEffect } from "react";

const useComments = (post_id) => {

    const [ commentCount, setCommentCount ] = useState(0);

    const fetchCommentCount = async () => {
        try {
            const response = await apiAuth.get(`/comments/${post_id}/fetch-comment-count`);

            if(response.status === 200) {
                console.log('Comment count: ', response.data.comments)
                setCommentCount(response.data.comments);
            }
        } catch (error) {
            console.error('Error fetching comment: ', error)
        }
    }

    useEffect(() => {
        fetchCommentCount();
    }, [])


    return { commentCount };
};

export default useComments;