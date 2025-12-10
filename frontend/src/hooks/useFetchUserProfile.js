import { useState } from "react";

import { apiAuth } from "../api/axios.js";

export const useFetchUserProfile = (user) => {
    const [ profileData, setProfileData ] = useState({});
    const [ loading, setLoading ] = useState(false);

    const fetch_profile = async () => {
        try {
            setLoading(true);

            const response = await apiAuth.get(`/users/get-other-profile/${user}`);

            console.log(`User ${user} data: ${response.data.user}`);

            setProfileData({ ...response.data.user });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts: ', error);
        } finally {
            setLoading(false);
        }
    }

    return { fetch_profile, profileData, loading };
};