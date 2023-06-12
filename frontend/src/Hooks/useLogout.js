import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth } = useAuth();
    const LOGOUT_URL = '/logout';
    const refresh_token = localStorage.getItem('refresh_token');//get the refresh token from auth object


    const logout = async () => {
        try {
            const response = await axios.post(LOGOUT_URL,
                //withCredentials: true
                JSON.stringify({
                    refresh_token : refresh_token,
                }),
                {headers: {'Content-Type' : 'application/ld+json'},}
            );
            setAuth({});
            localStorage.removeItem('refresh_token');
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout