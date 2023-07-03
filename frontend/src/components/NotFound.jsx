import { Box, Button, Typography, styled, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import loginbg from '../assets/herobg.png'
import notfound from '../assets/notFound.png'
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import Footer from "./homePage/Footer";




const StyledModal = styled(Box) (({ theme }) => ({

    //backgroundColor: theme.palette.green.main,
    backgroundImage: `url(${loginbg})`,
    height: '90vh',
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',    
  }));



  
const NotFound = () => {
    const theme = useTheme(); //using the the Material-UI theme object, which is provided by the useTheme hook from Material-UI.
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // checking if device is mobile
    return (
        <>
        <StyledModal>
            <Box  
            sx={{
            position: "relative",  
            bgcolor: "background.default",
            color: "text.primary",
            padding: 4,
            borderRadius: 2,
            border: `2px solid ${theme.palette.green.main}`, // Add border property
            //'& > *': { marginBottom:'10px' },
            maxHeight: '80vh',
            width: isMobile ? '80vw' : '400px', 
            height: isMobile ? 'auto' : 'auto',     
            ".my-button": {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.green.main,
                textTransform: "none",
                "&:hover": {
                    backgroundColor: theme.palette.green.light,
                  },
              }     
 
            }}
             >              
                <Box sx={{ display: "flex" , flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="h6" textAlign="center" sx={{ color: "green.main"}}>
                     404 Page Not Found
                    </Typography>
                    <Typography variant="h5" textAlign="center"   sx={{ color: "grey.main"}}>
                    we can't seem to find the page you're looking for.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent:'center', gap: '5px', marginTop: '5px'}}>
                        <Button  component={RouterLink} to="/"  variant="contained" className="my-button"    >
                            <Typography variant="subtitle2"  >
                                        {"Home page"}                        
                            </Typography>
                        </Button>  
                    </Box>  
                    <img
                    src={notfound}
                    alt="Not found Page"
                    width="350px"
                    height="400px"
                    />       
                </Box>
                
            </Box>
        
        </StyledModal>
        <Footer />
        </>
     );
}
 
export default NotFound;