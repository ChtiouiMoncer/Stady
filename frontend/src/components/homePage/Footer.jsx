import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Grid, Link, Typography } from "@mui/material";
import logo from '../../assets/logo.png';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <>
            <Box sx={{ padding: "40px", marginBottom: "30px" }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
                            <Link component={RouterLink} to="/" underline="none">
                                <img src={logo} alt="Logo" width="110px" height="40px" />
                            </Link>
                        </Box>
                        <LanguageSwitcher />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <Typography variant="h6" sx={{ color: "green.main" }}>
                                {t('aboutFooter')}
                            </Typography>

                            <Link component={RouterLink} to="/about" underline="none">
                                <Typography variant="body2" sx={{ color: "grey.main" }}>
                                    {t('aboutFooter')}
                                </Typography>
                            </Link>

                            <Link component={RouterLink} to="/process" underline="none">
                                <Typography variant="body2" sx={{ color: "grey.main" }}>
                                    {t('howItWorksFooter')}
                                </Typography>
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <Typography variant="h6" sx={{ color: "green.main" }}>
                                {t('partner')}
                            </Typography>

                            <Link component={RouterLink} to="/" underline="none">
                                <Typography variant="body2" sx={{ color: "grey.main" }}>
                                    {t('partnership')}
                                </Typography>
                            </Link>

                            <Link component={RouterLink} to="/" underline="none">
                                <Typography variant="body2" sx={{ color: "grey.main" }}>
                                    {t('promotions')}
                                </Typography>
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <Typography variant="h6" sx={{ color: "green.main" }}>
                                {t('support')}
                            </Typography>

                            <Link component={RouterLink} to="/contact" underline="none">
                                <Typography variant="body2" sx={{ color: "grey.main" }}>
                                    {t('contactFooter')}
                                </Typography>
                            </Link>

                            <Link component={RouterLink} to="/terms" underline="none">
                                <Typography variant="body2" sx={{ color: "grey.main" }}>
                                    {t('terms')}
                                </Typography>
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor:'green.main', padding:'10px' }}>
                   <Typography variant="body2" sx={{ color: "white.main" }}>
              Made With{" "}
              <span role="img" aria-label="Red Heart" style={{ color: "red" }}>
                ❤️
              </span>{" "}
              By{" "}
              <Link href="http://www.dotit-corp.com/" target="_blank" rel="noopener" sx={{color:'white.main'}}>
                DOT-IT
              </Link>
            </Typography>
                <Typography variant="body2" sx={{ color: "white.main" }}>
                 &#169; {currentYear}  {t('copyright')}
                </Typography>
            </Box>
        </>
    );
}

export default Footer;

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    return (
        <Box>
            <Button sx={{margin:'10px'}} variant="outlined" color="inherit" onClick={() => i18n.changeLanguage('en')}><Typography sx={{ color: 'green.main'}} variant="body">ENG</Typography></Button>
            <Button sx={{margin:'10px'}} variant="outlined" color="inherit" onClick={() => i18n.changeLanguage('fr')}><Typography sx={{ color: 'green.main'}} variant="body">FR</Typography></Button>
        </Box>
    );
}
