import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Grid, Link, Typography } from "@mui/material";
import logo from '../../assets/logo.png'
import { useTranslation } from "react-i18next";

const AppFooter = () => {
    const currentYear = new Date().getFullYear();
  return (
    <>
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
              &#169; {currentYear} DOT-IT. All rights reserved
            </Typography>
            <LanguageSwitcher />
    </Box>
   </>
  );
}

export default AppFooter;

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
      <Box>
          <Button sx={{margin:'10px'}} variant="contained" color="inherit" onClick={() => i18n.changeLanguage('en')}><Typography sx={{ color: 'grey.black'}} variant="body">ENG</Typography></Button>
          <Button sx={{margin:'10px'}} variant="contained" color="inherit" onClick={() => i18n.changeLanguage('fr')}><Typography sx={{ color: 'grey.black'}} variant="body">FR</Typography></Button>
      </Box>
  );
}