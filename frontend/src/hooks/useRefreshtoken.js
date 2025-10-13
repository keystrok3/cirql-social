
import axios from "axios"

export const useRefreshtoken = async () => {

    try {
        const response = await axios.post('/api/auth/refresh-token/', {}, {
            withCredentials: true
        });

        if(response.status === 201 || response.status === 201) {
            return response.data.access_token;
        } else {
            console.error(response.data);
            return null
        }
    } catch (error) {
        console.log('Error refreshing token: ', error);
        return null
    }
};