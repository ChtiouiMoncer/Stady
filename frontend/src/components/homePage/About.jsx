import { Box, Container, Typography } from "@mui/material";
import logo from "../../assets/logo.png";
import Footer from "./Footer";
import Navbar from "../Navbar";
import AppFooter from "./AppFooter";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ mt: 5, textAlign: 'center', mb: 5 }}>
          <img src={logo} alt="Logo" style={{ width: 350, height: 120 }} />
          <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
            {t('about.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('about.description1')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('about.description2')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('about.description3')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            {t('about.description4')}
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            {t('about.quote')}
          </Typography>
        </Box>
      </Container>
      <AppFooter />
    </>
  );
};

export default About;