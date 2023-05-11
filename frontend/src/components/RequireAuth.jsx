import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth(); //get the auth object from useAuth
    const location = useLocation(); //get the current url (representing the URL and allowing access to route information)

    return (

        /*
         //optional chaining (if auth is null or undefined result will be undefined else we can accesse the auth object this helps prevent unexpected errors when accessing nested properties)   
        auth?.username  //if we have a username (checks if the user logged in or not)
            ? <Outlet /> // represents any child compoent of RequireAuth (only when we have a user we can show the comp's inside the Outlet)
            : <Navigate to="/login" state={{ from: location }} replace /> //This effectively replaces the current route with the new one. (and store the path of the protected route in from)
        */




       auth?.roles?.find(role => allowedRoles?.includes(role)) //check if allowedRoles includes auth.roles 
            ? <Outlet />
            : auth?.username
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
       
    );
} 

export default RequireAuth;  