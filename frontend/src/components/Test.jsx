import { Link } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const Test = () => {

    const { auth, setAuth } = useAuth(); // Access the setAuth function and auth variable from the AuthContext
    console.log(auth.roles);
    return ( 
        <div className="not-found">Test Page
        <Link to="/">Test Page</Link>
        </div>
     );
}
 
export default Test;