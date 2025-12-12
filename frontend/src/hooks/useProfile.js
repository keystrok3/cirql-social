import { useEffect } from "react";
import { useAuth } from "../context/AuthProvider"
import { useFetchUserProfile } from "./useFetchUserProfile";


export const useProfile = (usernameParam) => {

    const { userData } = useAuth(usernameParam);
    const authUser = userData?.user;

    const viewingOther = usernameParam && usernameParam !== authUser?.username;

    const { fetch_profile, profileData, loading } = useFetchUserProfile(usernameParam);

    useEffect(() => {
        console.log('viewing other: ', viewingOther === true)
        if(viewingOther) fetch_profile();
    }, [viewingOther, fetch_profile]);

    const profile = viewingOther ? profileData : authUser;

    return { profile, loading, isSelf: !viewingOther };
};

