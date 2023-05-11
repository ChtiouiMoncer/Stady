import { Link } from "react-router-dom";

const NotFound = () => {
    return ( 
        <div className="not-found">This page doesn't exist!
        <h2>Sorry!</h2>
        <Link to="/">Back to the Home Page.</Link>
        </div>
     );
}
 
export default NotFound;