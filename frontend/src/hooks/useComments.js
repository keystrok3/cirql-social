import { useState, useEffect, useCallback } from "react";
import { apiAuth } from "../api/axios";

const useComments = (post_id) => {
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    const fetchComments = useCallback(async () => {
        try {
            const response = await apiAuth.get(`/comments/${post_id}/fetch-post-comments`);

            if (response.status !== 200) {
                console.log('Error fetching comments: ', response.statusText);
            }
            setComments(response.data.comments || []);
        } catch (error) {
            console.error('Error fetching comments: ', error);
        }
    }, [post_id]); 

    const fetchCommentCount = useCallback(async () => {
        try {
            const response = await apiAuth.get(`/comments/${post_id}/fetch-comment-count`);

            if (response.status === 200) {
                setCommentCount(response.data.comments);
            }
        } catch (error) {
            console.error('Error fetching comment count: ', error);
        }
    }, [post_id]); 

    const create_comment = async (comment_body) => {
        try {
            const response = await apiAuth.post(
                `/comments/${post_id}/create-comment`,
                { ...comment_body },
            );

            if (response.status === 201) {
                setCommentCount(prev => prev + 1);
                setError(false);
                setMessage("Comment created successfully.");
                
                fetchComments();
            } else {
                 setError(true);
                 setMessage(response.statusText);
            }
        } catch (error) {
            console.error('Error commenting: ', error);
            setError(true);
            setMessage("Failed to create comment.");
        }
    };

    useEffect(() => {
        fetchCommentCount();
        fetchComments();
    }, [post_id, fetchCommentCount, fetchComments]);

    return { commentCount, create_comment, error, message, comments };
};

export default useComments;