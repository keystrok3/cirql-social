
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAuth } from "../api/axios";
import axios from "axios";


export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {

    const [ loading, setLoading ] = useState(false);
    const [ successMessage, setSuccessMessage ] = useState("");
    const [ errors, setErrors ] = useState([]);

    const navigate = useNavigate();

    const [ accessToken, setAccessToken ] = useState(() => {
        try {
            const access_token = localStorage.getItem('access_token');

            if(access_token) {
                return access_token;
            } else {
                return ""
            }
        } catch (error) {
            console.error("Failed to parse access token from localStorage", error);
        }
    });

    const [ userData, setUserData ] = useState(() => {
        try {
            const user = localStorage.getItem('user')

            if(user) {
                return JSON.parse(user)
            }
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
        }

        return null;
    });


    // Clear token from localStorage
    const clearAuth = useCallback(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        setAccessToken("");
        setUserData(null);
    }, []);




    const login = async (data) => {
        
        setErrors([]);
        setSuccessMessage("");

        clearAuth();

        if (!data.email || !data.password) {
            setErrors(["Please enter both email and password."]);
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post('/api/auth/login/', { 
                ...data
            });

            if(response.status === 200 || response.status === 201) {

                localStorage.setItem('access_token', response.data.token);

                setAccessToken(response.data.token);

                setSuccessMessage("Login successful! Redirecting...");

                setTimeout(() => navigate('/home'), 1500);

            } else {
                console.warn('Unexpected response during login: ', response);
                setErrors([ 'Invalid credentials. Please check your email and password.']);
            }
        } catch (error) {
            console.error('Login failed:', error);
            const errorMessage = error.response?.data?.message || 'Login Failed. Invalid credentials or server error.';
            setErrors([ errorMessage ]);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const response = await apiAuth.post('/auth/logout/');

            if(response.status === 200) {
                navigate('/login');
            }
        } catch (error) {
            console.error(`Error logging out: ${error}`);
        } finally {
            clearAuth();
        }
    };


    const fetch_profile = async () => {
        try {
            const profile = await apiAuth.get('/profile/fetch_profile/');
            console.log('fetch response: ', profile.data.user)

            localStorage.setItem('user', JSON.stringify(profile.data.user));
            setUserData(profile.data);

        } catch (error) {
            console.error('Error fetching: ', error);
        }
    };


    useEffect(() => {
        if(accessToken) {
            fetch_profile();
        }
    }, [ accessToken ])



    return (
        <AuthContext.Provider 
            value={{ 
                loading, 
                successMessage, 
                errors, 
                userData, 
                login, 
                logout, 
                fetch_profile,
                accessToken
            }}
        >{children}</AuthContext.Provider>
    )
};

export default AuthProvider;