import { Box, Container, Typography } from "@mui/material";
import logo from "../../assets/logo.png";
import Footer from "./Footer";
import Navbar from "../Navbar";
import AppFooter from "./AppFooter";

const About = () => {
  return (
    <>
    <Navbar />
    <Container maxWidth="md">
      <Box sx={{ mt: 5, textAlign: "center", mb: 5 }}>
        <img src={logo} alt="Logo" style={{ width: 350, height: 120 }} />
        <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
          About Stady
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Stady is a sports grounds reservation app that aims to simplify the process of finding and booking sports facilities. Our mission is to connect sports enthusiasts with the perfect sports grounds for their needs, whether it's for casual games, league matches, or training sessions.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          With Stady, you can easily browse through a wide range of sports grounds, including football fields, basketball courts, tennis courts, and more. Our user-friendly interface allows you to search for grounds based on location, sports type, availability, and amenities.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Whether you're an individual looking for a place to play your favorite sport or a team manager organizing regular matches, Stady provides you with all the tools you need to make informed decisions and secure your desired booking slots.
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          We are committed to providing a seamless and enjoyable experience for all users, ensuring that you can focus on what you love - playing sports. Join Stady today and discover the perfect sports grounds for your next game!
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          "Play hard, have fun, and let Stady take care of the rest!"
        </Typography>
      </Box>
    </Container>
    <AppFooter />
    </>
  );
};

export default About;