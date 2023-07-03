import { Link as RouterLink } from "react-router-dom";
import { Box, Grid, Link, Typography } from "@mui/material";
import logo from '../../assets/logo.png'

const Footer = () => {
    const currentYear = new Date().getFullYear();
  return (
    <>
    <Box sx={{ padding: "40px", marginBottom: "30px" }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Link component={RouterLink} to="/" underline="none">
              <img src={logo} alt="Logo" width="110px" height="40px" />
            </Link>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Typography variant="h6" sx={{ color: "green.main" }}>
              About Stady
            </Typography>

            <Link component={RouterLink} to="/about" underline="none">
              <Typography variant="body2" sx={{ color: "grey.main" }}>
                About Stady
              </Typography>
            </Link>

            <Link component={RouterLink} to="/process" underline="none">
              <Typography variant="body2" sx={{ color: "grey.main" }}>
                How it works?
              </Typography>
            </Link>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Typography variant="h6" sx={{ color: "green.main" }}>
              Partner with Us
            </Typography>

            <Link component={RouterLink} to="/" underline="none">
              <Typography variant="body2" sx={{ color: "grey.main" }}>
                Partnership programs
              </Typography>
            </Link>

            <Link component={RouterLink} to="/" underline="none">
              <Typography variant="body2" sx={{ color: "grey.main" }}>
                Promotions and events
              </Typography>
            </Link>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Typography variant="h6" sx={{ color: "green.main" }}>
              Support
            </Typography>

            <Link component={RouterLink} to="/contact" underline="none">
              <Typography variant="body2" sx={{ color: "grey.main" }}>
                Contact us
              </Typography>
            </Link>

            <Link component={RouterLink} to="/terms" underline="none">
              <Typography variant="body2" sx={{ color: "grey.main" }}>
                Terms and conditions
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
              &#169; {currentYear} DOT-IT. All rights reserved
            </Typography>
    </Box>
   </>
  );
}

export default Footer;