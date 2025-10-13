
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";


export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {

    const [ loading, setLoading ] = useState(false);
    const [ successMessage, setSuccessMessage ] = useState("");
    const [ errors, setErrors ] = useState([]);

    const navigate = useNavigate();

    const [ userData, setUserData ] = useState(() => {
        try {
            const storedToken = localStorage.getItem('access_token');
            const user = localStorage.getItem('user')

            if(storedToken || userData) {
                return { 
                    accessToken: storedToken,
                    user: JSON.parse(user)
                }
            }
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
        }

        return null;
    });


    // Clear token from localStorage
    const clearAuth = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
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

            const response = await api.post('login/', { 
                ...data
            });

            if(response.status === 200 || response.status === 201) {

                localStorage.setItem('access_token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                console.log('Login response: ', response.data);

                setUserData({
                    accessToken: response.data.token,
                    user: response.data.user
                });

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
            setLoading(false)
        }
    };

    const logout = async () => {
        try {
            const response = await api.post('logout/', {}, {
                withCredentials: true
            });

            if(response.status === 200) {
                navigate('/login');
            }
        } catch (error) {
            console.error(`Error logging out: ${error}`);
        } finally {
            clearAuth();
        }
    };


    return (
        <AuthContext.Provider 
            value={{ loading, successMessage, errors, login, logout }}
        >{children}</AuthContext.Provider>
    )
};

export default AuthProvider;