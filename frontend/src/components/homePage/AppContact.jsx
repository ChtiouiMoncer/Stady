import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";
import Navbar from "../Navbar";
import AppFooter from "./AppFooter";

const ContactContainer = styled(Container)(({ theme }) => ({
  mt: theme.spacing(5),
  textAlign: "center",
  mb: theme.spacing(5),
}));

const ContactBox = styled(Box)(({ theme }) => ({
  mt: theme.spacing(2),
  mb: theme.spacing(4),
}));

const ContactLink = styled("a")(({ theme }) => ({
  color: theme.palette.grey.main,
  textDecoration: "none",
}));

const AppContact = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ margin: "60px", paddingBottom:'30px', paddingTop:'20px' }}>
        <ContactContainer maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={logo} alt="Logo" style={{ width: 200, height: 90 }} />
            <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
              Contact Us
            </Typography>
          </motion.div>

          <ContactBox
            component={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              For any inquiries or support, feel free to reach out to us.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Phone:{" "}
              <ContactLink href="tel:+21652956813">
                +216 52 956 813
              </ContactLink>
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Email:{" "}
              <ContactLink href="mailto:stady.booking@gmail.com">
                stady.booking@gmail.com
              </ContactLink>
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Location: Sousse, Tunisia
            </Typography>
          </ContactBox>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              "We're here to assist you and answer your questions!"
            </Typography>
          </motion.div>
        </ContactContainer>
      </Box>
      <AppFooter />
    </>
  );
};

export default AppContact;
