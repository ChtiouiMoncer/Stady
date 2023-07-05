import { Box, Container, Typography } from "@mui/material";
import logo from "../../assets/logo.png";
import Navbar from "../Navbar";
import AppFooter from "./AppFooter";
import { useTranslation } from "react-i18next";

const HowItWorks = () => {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ mt: 5, textAlign: "center", mb: 5 }}>
          <img src={logo} alt="Logo" style={{ width: 300, height: 120 }} />
          <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
            {t('howItWorks.title')}
          </Typography>

          {/* Owner Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('howItWorks.ownerSection')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('howItWorks.ownerDescription1')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('howItWorks.ownerDescription2')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('howItWorks.ownerDescription3')}
            </Typography>
          </Box>

          {/* Member Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('howItWorks.memberSection')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('howItWorks.memberDescription1')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('howItWorks.memberDescription2')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('howItWorks.memberDescription3')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('howItWorks.memberDescription4')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              {t('howItWorks.memberDescription5')}
            </Typography>
          </Box>

          {/* Stady Benefits */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('howItWorks.stadyBenefits')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('howItWorks.benefit1')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('howItWorks.benefit2')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('howItWorks.benefit3')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            {t('howItWorks.benefit4')}
          </Typography>

          {/* Join Stady */}
          <Typography variant="body1" sx={{ mb: 4 }}>
            {t('howItWorks.joinStady')}
          </Typography>

        </Box>
      </Container>
      <AppFooter />
    </>
  );
};

export default HowItWorks;
