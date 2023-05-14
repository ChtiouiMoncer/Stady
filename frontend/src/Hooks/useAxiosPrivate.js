import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";


const useAxiosPrivate = () => {
    const refresh = useRefreshToken(); //get the refresh function from useRefreshToken()
    const { auth } = useAuth(); //get auth from useAuth HOOk


    useEffect(() => 
    {
        //setting up the request Intercepteur    
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.access_token}`;
                }
                return config;
            //if there is an error we passe it as a promise reject
            }, (error) => Promise.reject(error) //anonymous arrow function. It does not have a specific name that  returns a rejected promise.
        );    


        //setting up the response Intercepteur    
        const responseIntercept = axiosPrivate.interceptors.response.use( //intercept the  response 
            response => response, //if the response is good we get the response 
            async (error) => { //otherwise will have async handle error (for example our token expired)
                const prevRequest = error?.config;
                if(
                    error?.response?.status === 401 && //get the error status from the server
                    error?.response?.data?.message === "Expired JWT Token" && //if the token was expired
                    !prevRequest?.sent //check if the error response status & if sent is not true                  
                    ) { 
                    prevRequest.sent = true; //set prevRequest to true 
                    const newAccessToken = await refresh(); // get a new access token
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`; // pass the new access toekn with headers request
                    return axiosPrivate(prevRequest); //updated the request with the new access token
                }
                //if the if block doesn't work we  return the error 
                return Promise.reject(error); //handle any errors that may occur during the request interception process 

            }
        );

    return () => {
        //setting up the clean up function to remove the interceptors
        axiosPrivate.interceptors.request.eject(requestIntercept);
        axiosPrivate.interceptors.response.eject(responseIntercept);
    }    

    }, [auth, refresh]) //auth and refresh could change so we put them in the dependency array

    return axiosPrivate;
}
 
export default useAxiosPrivate;