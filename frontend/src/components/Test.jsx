import { Link } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import useRefreshToken from "../Hooks/useRefreshToken";

const Test = () => {

    const { auth, setAuth } = useAuth(); // Access the setAuth function and auth variable from the AuthContext
    //console.log(auth.access_token);
    //console.log(auth.refresh_token);


    //const refresh = useRefreshToken();




    return ( 
        <div className="not-found">add Pitch Page
        <Link to="/">Home Page</Link>
        {/* <button onClick={() => refresh() }>Refresh</button>
        <br /> */ }
        </div>
     );
}
 
export default Test;