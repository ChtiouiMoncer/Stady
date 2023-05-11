import { createContext, useState } from "react";

const AuthContext = createContext({}); //creates a new context called AuthContext using the createContext function.

export const AuthProvider = ({ children }) => { //Exports a co mponent called AuthProvider with a a prop called children, which represents the child components that will be wrapped by this provider.
    const [auth, setAuth] = useState({ }); //define a state variable called auth
    
    //const [isLoggedIn, setIsLoggedIn] = useState(false); //define another state variable

    return ( 
        // This code wraps the children components with the AuthContext.Provider 
        <AuthContext.Provider value={{ auth, setAuth }}> {/* This makes the auth state variable and its setter function available to all components nested inside the provider */}
            {children}
        </AuthContext.Provider>
    )
}

//exports the AuthContext object as the default export of this file to allow other modules to  use the context without knowing the name of the provider.
export default AuthContext;
