import Navbar from "../Navbar";
import LoginPage from "../auth/LoginPage";
import Hero from "./Hero";

const HomePage = () => {
    return ( 
        <>
            <Navbar />            
            <Hero />
            <LoginPage />
        </>
     );
}
 
export default HomePage;