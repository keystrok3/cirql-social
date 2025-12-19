
import { createContext, useState, useCallback, useContext, useEffect } from "react";
import { apiAuth } from "../api/axios";

const DataContext = createContext();

const DataProvider = ({ children }) => {

    const [ posts, setPosts ] = useState([]);

    const fetchAllPosts = useCallback(async () => {
        try {
        const response = await apiAuth.get("/posts/fetch-all-posts");
        if (response.status !== 200) {
            console.error("Could not fetch:", response.statusText);
            return;
        }

        setPosts([ ...response.data.data ]);
        } catch (error) {
        console.error("Error fetching:", error);
        }
    }, []);

    const deletePost = useCallback(async (post_id) => {
        try {
            const response = await apiAuth.delete(`/posts/delete-post/${post_id}`);
            setPosts(prev => prev.filter(post => post.post_id !== post_id));
            alert(response.data.message);
        } catch (error) {
            console.log('Error deleting post: ', error);
        }
    }, []);

    useEffect(() => {
        fetchAllPosts();
    }, [])


    return <DataContext.Provider value={{ fetchAllPosts, deletePost, posts }}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
export default DataProvider;
