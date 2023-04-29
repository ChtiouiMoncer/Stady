import {Box, Button, Checkbox, Chip, Divider, FormControlLabel, FormGroup, IconButton, Link, Modal, styled, TextField, Typography, useMediaQuery } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import googleLogo from '../../assets/logoGoogle.png'
import facebookLogo from '../../assets/logoFacebook.png'
import { useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';


const StyledModal = styled(Modal) (({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "auto",
  ".action-button": {
      marginTop: "20px",
      marginBottom: "8px",
      color: theme.palette.white.main,
      backgroundColor: theme.palette.green.main,
      textTransform: "none",
      "&:hover": {
          backgroundColor: theme.palette.green.light,
        },
    },
 ".social-login": {
    borderColor: theme.palette.green.main, // Set the color of the border
    color: theme.palette.green.main,
        backgroundColor: theme.palette.white.main,
        textTransform: "none",
        "&:hover": {
            backgroundColor: theme.palette.green.light,
            color: theme.palette.white.main, // Set the color of the border

          },
        '& .MuiButton-startIcon': {
            position: "absolute",
            left: "20px"
          },
      }
  
}));


const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        height: '40px', // replace with your desired height
        marginTop: '20px',
    
        '& fieldset': {
          borderColor: 'grey', // default border color
        },
        '&:hover fieldset': {
          borderColor: 'green', // border color when hovering over input
        },
        '&.Mui-focused fieldset': {
          borderColor: 'green', // border color when input is focused
        },
      },
      '& .MuiInputLabel-outlined': {
        top: '12px', // replace with your desired vertical position
      },
  });
  
const LoginModal = (props) => {  
const  { open, onClose }  = props; //defining the necessary props
const theme = useTheme(); //using the the Material-UI theme object, which is provided by the useTheme hook from Material-UI.
const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // checking if device is mobile

  return (
    <StyledModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        overflowY: 'auto', // add this line to make the modal scrollable
        width: isMobile ? '90vw' : '400px', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
        height: isMobile ? '90vh' : '570px', // use 90vh (90% of the width of the viewport) height for mobile devices, otherwise use 570px height
      }}
    > 
        <Box
            sx={{
            bgcolor: "background.default",
            color: "text.primary",
            padding: 4,
            borderRadius: 2,
            '& > *': { marginBottom:'14px' },
            }}
        > 

            <Box sx={{ display: "flex",  justifyContent: "space-between" }}>
                <Typography variant="h6" textAlign="left" sx={{ color: "green.main"}}>
                Welcome Back!
                </Typography>
                <IconButton onClick={onClose} >
                    <CloseIcon sx={{ height:"20px", width:"20px", color: "grey.main", position: "absolute"}}  />
                </IconButton>
            </Box>
            
  
            <StyledTextField
            fullWidth
            id="outlined-username-input"
            label= {<Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
            Username or Email
            </Typography>}
            type="text"
            autoComplete="Email or phone number"    
            />

            <StyledTextField
            sx={{ marginTop: "10px"}}
            fullWidth
            id="outlined-password-input"
            label= {<Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
            Password
            </Typography>}
            type="password"
            autoComplete="Password"
            />

            <Button fullWidth className="action-button" variant="contained">Login</Button>

            <Link href="#" variant="subtitle2" sx={{ color: "grey.main"}}>
            {'I Forgot My Password'}
            </Link>

            <Divider sx={{ marginTop:"15px", marginBottom:"15px" }}>
                <Chip label={
                    <Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                    or
                    </Typography>   
                } />
            </Divider> 

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Button startIcon={ <img src={googleLogo} alt="Google" width="20px" height="20px" />} fullWidth className="social-login" variant="outlined"> Continue with Google </Button>
                <Button startIcon={<img src={facebookLogo} alt="Google" width="20px" height="20px" />}  fullWidth className="social-login" variant="outlined"> Continue with Facebook </Button> 
            </Box>       
        </Box>
    </StyledModal>
  );
};






export default LoginModal;
