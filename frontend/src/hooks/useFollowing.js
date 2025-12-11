import { useState, useEffect } from "react";
import { apiAuth } from "../api/axios";

export const useFollowing = (username) => {
    const [followers, setFollowers] = useState([]);
    const [followees, setFollowees] = useState([]);
    // 1. Add loading state
    const [isLoading, setIsLoading] = useState(true); 
    // 2. Add error state
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchData = async () => {
            // Set loading to true at the start
            setIsLoading(true);
            setError(null);

            try {
                // Fetch followees
                const followeesResponse = await apiAuth.get(`/following/fetch-followees/${username}`);
                if (followeesResponse.status === 200) { // Note: Use status, not statusText
                    setFollowees(followeesResponse.data);
                } else {
                    // Handle non-200 status codes if necessary
                    throw new Error("Failed to fetch followees."); 
                }

                // Fetch followers
                const followersResponse = await apiAuth.get(`/following/fetch-followers/${username}`);
                if (followersResponse.status === 200) {
                    setFollowers(followersResponse.data);
                } else {
                    throw new Error("Failed to fetch followers.");
                }

            } catch (err) {
                console.error('Error fetching data: ', err);
                setError(err.message || 'An unknown error occurred.');
            } finally {
                // Set loading to false when all operations are complete
                setIsLoading(false); 
            }
        };

        fetchData();
    }, []);

    // Return the new states
    return { followers, followees, isLoading, error };
}