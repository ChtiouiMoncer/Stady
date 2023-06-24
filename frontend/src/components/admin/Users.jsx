import { useState, useEffect } from "react";
import axios from "../../api/axios";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import useAuth from "../../Hooks/useAuth";
import Navbar from "../Navbar";
import SidebarOwner from "../owner/SidebarOwner";
import SidebarAdmin from "./SidebarAdmin";
import Feed from "../owner/Feed";


const Users = () => {

    const [activeItem, setActiveItem] = useState('Members');

    //users data state
    const [users, setUsers] = useState(); 

    const { auth, setAuth } = useAuth();


    // axios private (with Token Bearer)
    const axiosPrivate = useAxiosPrivate();

    //react dom
    const navigate = useNavigate();
    const location = useLocation();

    //REFRESH TOKEN ENDPOINT
    const USERS_URL = '/api/users'

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController(); //cancel the request when the comp unmounts

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get(USERS_URL, {
                        signal: controller.signal, //cancel the request if we need to    
                        headers: {'accept': 'application/json'} // include the accept header
                    },
                  
                );
                
                //console.log(response.data);
                isMounted && setUsers(response.data);
                

            } catch (err) {
                //console.error(err);
                //console.log(err);
                
                //Handling an expired refresh token
                if (err?.response?.status === 401 && err?.response?.data?.message === "Invalid JWT Refresh Token")
                {
                navigate('/login', { state: { from: location }, replace: true });
                }       

                
    
            }
        }

        getUsers ();

        // cleanup function is used to handle any necessary clean-up tasks when the component is unmounted
         return () => {
            isMounted = false; //the code ensures that the state is only updated if the component is still mounted.
            controller.abort(); //cancel any requests when the comp unmounts
        }
    }, [])

    return (
        <>
        <Box>
            <Navbar />
            <Stack direction="row"  > {/* comment above */} 
                 <SidebarAdmin activeItem={activeItem} />
                 <Feed />

               
            </Stack> 

        </Box>
        </>
    );
};

export default Users;