import { useEffect } from "react";
import { useAuth } from "../context/AuthProvider"
import { useFetchUserProfile } from "./useFetchUserProfile";


export const useProfile = (usernameParam) => {

    const { userData } = useAuth();
    const authUser = userData?.user;

    const viewingOther = Boolean(usernameParam && usernameParam !== authUser?.username);

    const { fetch_profile, profileData, loading } = useFetchUserProfile(usernameParam);

    useEffect(() => {
        if(viewingOther) {
            fetch_profile();
        }
    }, [usernameParam, viewingOther]);

    const profile = viewingOther ? profileData : authUser;

    return { profile, loading, isSelf: !viewingOther };
};

