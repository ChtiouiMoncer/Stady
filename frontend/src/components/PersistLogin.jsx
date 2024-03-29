import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useRefreshToken from "../Hooks/useRefreshToken";
import useAuth from "../Hooks/useAuth";
import jwt_decode from 'jwt-decode';
import { Box, CircularProgress } from "@mui/material";
import { green, grey } from "@mui/material/colors";


const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true); //track whether the component is in a loading state or not
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth();

    // This useEffect will run only when the component mounts.
    useEffect(() => {
        // Function to verify the refresh token.
        const verifyRefreshToken = async () => { 
            // We try to get the new access token before reaching the require auth component,
            // as otherwise, the require auth will redirect us back to the login page.
            try{ 
                 const decoded_token = jwt_decode(await refresh()); 
                 const username = decoded_token.username; 
                 const roles = decoded_token.roles; 
                 const iat = decoded_token.iat; 
                 const exp = decoded_token.exp; 
                 const userId = decoded_token.userId; //(expiration time) represents the timestamp when the token is set to expire
                 const email = decoded_token.email; 
                 const phone = decoded_token.phoneNumber; 

                 setAuth(prev => { //get the prev state
                     return {...prev, username, roles, iat, exp, userId, email, phone} 
                  }); 
              
            }
            catch (err) {
                console.error(err);
            }
            finally { 
                setIsLoading(false);
            }
        }
        
        // The verifyRefreshToken function will run only when we lack an access token.
        // Otherwise, it will always hit the refresh endpoint.
        !auth?.access_token ? verifyRefreshToken() : setIsLoading(false);
    }, [])

    return (
        <>
        {isLoading
            ?
                <Box
                sx={{
                height: '90vh',
                display: 'flex',
                flexDirection:"column",
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: grey[250], // Use the green color value here
                }}
                >

                    <CircularProgress sx={{color:"green.main"}} />

                </Box>

            : <Outlet />
        }   
        </>


      );
}
 
export default PersistLogin;