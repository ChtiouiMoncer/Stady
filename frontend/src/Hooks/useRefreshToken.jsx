import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {

    const { auth, setAuth } = useAuth(); // Access the setAuth function and auth variable from the AuthContext
    const refreshToken = auth?.refresh_token; //get the refresh token from auth object
    //console.log(auth.access_token);
    //console.log(auth.refresh_token);


    //REFRESH TOKEN ENDPOINT
    const REFRESH_URL = '/authentication_token/refresh'

    const refresh = async () => {

        const response = await axios.post(REFRESH_URL,
            //withCredentials: true
            JSON.stringify({
                refresh_token : refreshToken,
                }),
                {
                    headers: {'Content-Type' : 'application/ld+json'},
                    
                }
        );
        
        /* const access_token = response.data.token; //get the access token from the response
        const refresh_token = response.data.refresh_token; //get the refresh token from the response
        console.log(access_token);
        console.log(refresh_token); */

        setAuth(prev => { //get the prev state
            //console.log(JSON.stringify(prev));
            //console.log(response.data.token);
           return {...prev, access_token: response.data.token } //overide the access token inside the auth object with the new access token from the REFRESH ENDPOINT response.
        });
        //console.log(auth.access_token)

        return response.data.token; //return the new access token to use it with our request (when our access token is expired the we will refresh and retry the request )

    } 

    return refresh;
};
 
export default useRefreshToken;