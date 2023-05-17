import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const AuthGuard  = () => {
    const { auth } = useAuth(); //get the auth object from useAuth
    const location = useLocation(); //get the current url (representing the URL and allowing access to route information)

    return (

            auth?.username
                ? <Navigate to="/" state={{ from: location }} replace />
                : <Outlet />
       
    );
} 

export default AuthGuard ;  