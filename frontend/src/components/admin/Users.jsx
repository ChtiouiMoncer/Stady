import { useState, useEffect } from "react";
import axios from "../../api/axios";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import useAuth from "../../Hooks/useAuth";
import Navbar from "../Navbar";


const Users = () => {

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
        <Navbar />
        <article>
            <Button component={RouterLink} to="/">
                        <Typography variant="subtitle2" className="greySubtitle">Home</Typography>
            </Button>
            <h2>Users List</h2>
            {users?.length
                ? (
                    <ul>
                        {users.map((user, i) => <li key={i}>{user?.username}</li>)}
                    </ul>
                ) : <p>No users to display</p>
            }
           
        </article>
        </>
    );
};

export default Users;