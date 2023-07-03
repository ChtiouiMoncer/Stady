import Navbar from "../Navbar";
import LoginPage from "../auth/LoginPage";
import Footer from "./Footer";
import Hero from "./Hero";
import MiniUserFeedback from "./MiniUserFeedback";
import MiniUserPitches from "./MiniUserPitches";

const HomePage = () => {
    return ( 
        <>
            <Navbar />            
            <Hero />
            <MiniUserFeedback />
            <MiniUserPitches />
            <Footer />
        </>
     );
}
 
export default HomePage;