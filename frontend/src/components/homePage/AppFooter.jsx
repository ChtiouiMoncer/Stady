import { Link as RouterLink } from "react-router-dom";
import { Box, Grid, Link, Typography } from "@mui/material";
import logo from '../../assets/logo.png'

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
    </Box>
   </>
  );
}

export default AppFooter;