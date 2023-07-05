import { Box, Container, Typography } from "@mui/material";
import logo from "../../assets/logo.png";
import Navbar from "../Navbar";
import AppFooter from "./AppFooter";
import { useTranslation } from 'react-i18next';

const AppTerms = () => {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ mt: 5, textAlign: "center", mb: 5 }}>
          <img src={logo} alt="Logo" style={{ width: 300, height: 120 }} />
          <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
            {t('termsAndConditions')}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('termsIntro')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('termsAccess')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              {t('termsApply')}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('ownershipAndIntellectual')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('termsOwnership1')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('termsOwnership2')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              {t('termsOwnership3')}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('userConduct')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('termsUserConduct1')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('termsUserConduct2')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('termsUserConduct3')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('termsUserConduct4')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('termsUserConduct5')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              {t('termsUserConduct6')}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('limitationOfLiability')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('termsLiability1')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('termsLiability2')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('termsLiability3')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              {t('termsLiability4')}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('governingLaw')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('termsGoverningLaw1')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('termsGoverningLaw2')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              {t('termsGoverningLaw3')}
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            {t('termsContact')}
          </Typography>
        </Box>
      </Container>
      <AppFooter />
    </>
  );
};

export default AppTerms;
