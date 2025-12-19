import { useState, useEffect, useCallback } from "react";
import { apiAuth } from "../api/axios";

export const useFollowing = (username) => {
    const [followers, setFollowers] = useState([]);
    const [followees, setFollowees] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null); 

    const toggle_follow = async () => {
        try {
            const response = await apiAuth.post(`/following/toggle-follow/${username}`);
            if(response.status === 201) {
                // console.log("Following ", username);
                return
            } else if(response.status === 200) {
                // console.log("Unfollowed ", username)
            }
        } catch (error) {
            setError(error || "An unknown error occurred");
        }
    };

    const is_following = useCallback( async () => {

        try {
            const response = await apiAuth.get(`/following/check-user-follows/${username}`);

            if(response.data.follows) {
                return true;
            }
        } catch (error) {
            console.error('Error checking follow status', error);
            return false;
        }
    }, []);

    const is_followed = useCallback(async () => {
        try {
            const response = await apiAuth.get(`/following/check-user-followed/${username}`);

            if(response.data.follows) {
                return true;
            }
        } catch (error) {
            console.error('Error checking follow status', error);
        } finally {
            return false;
        }
    }, []);

    useEffect(() => {
        if(!username) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch followees
                const followeesResponse = await apiAuth.get(`/following/fetch-followees/${username}`);
                if (followeesResponse.status === 200) {
                    setFollowees(followeesResponse.data);
                } else {
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
                setError(err || 'An unknown error occurred.');
            } finally {
                setIsLoading(false); 
            }
        };

        fetchData();
    }, [username]);

    return { followers, followees, toggle_follow, isLoading, error, is_followed, is_following };
}