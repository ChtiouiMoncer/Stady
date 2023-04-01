import {Box, Button, Checkbox, Chip, Divider, FormControlLabel, FormGroup, IconButton, Link, Modal, styled, TextField, Typography, useMediaQuery } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import googleLogo from '../assets/logoGoogle.png'
import appleLogo from '../assets/logoApple.png'
import facebookLogo from '../assets/logoFacebook.png'
import { useTheme } from '@mui/material/styles';







const StyledModal = styled(Modal) (({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "auto",
  ".action-button": {
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
  
const SignUpModal = (props) => {  
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
            '& > *': { marginBottom:'12px' },
            }}
        > 

            <Box sx={{ display: "flex",  justifyContent: "space-between" }}>
                <Typography variant="h6" textAlign="left" sx={{ color: "green.main"}}>
                Sign up for Stady
                </Typography>
                <IconButton onClick={onClose} >
                    <CloseIcon sx={{ height:"20px", width:"20px", color: "grey.main", position: "absolute"}}  />
                </IconButton>
            </Box>
            <Typography variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                Stady is totally free to use. Sign up using your email address or phone number below to get started.
            </Typography>

            <StyledTextField
            fullWidth
            id="outlined-email-input"
            label= {<Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
            Email or phone number
            </Typography>}
            type="email"
            autoComplete="Email or phone number"    
            />

            <StyledTextField
            fullWidth
            id="outlined-password-input"
            label= {<Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
            Password
            </Typography>}
            type="password"
            autoComplete="Password"
            />

            <Box mt={1}>
                <FormGroup>
                    <FormControlLabel sx={{ marginBottom:"-12px",  }}  control={<Checkbox size="small" //defaultChecked
                                                                                sx={{
                                                                                '&.Mui-checked': {
                                                                                    color: "green.main",
                                                                                },
                                                                                }} /> } 
                    label={
                        <Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                        I agree to the 
                            <Link href="#" underline="none" sx={{ color: "green.main"}} >
                                {' terms and conditions'}
                            </Link>
                        </Typography>}
                    />
                <FormControlLabel control={<Checkbox size="small" 
                                                sx={{
                                                '&.Mui-checked': {
                                                    color: "green.main",
                                                },
                                                }} /> } 
                    label={
                    <Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                    Send me the latest deal alerts
                    </Typography>}
                    />
                </FormGroup>
            </Box>

            <Button fullWidth className="action-button" variant="contained" >Create account</Button>

            <Divider sx={{ marginTop:"15px", marginBottom:"15px" }}>
                <Chip label={
                    <Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                    or
                    </Typography>   
                } />
            </Divider> 

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Button startIcon={ <img src={googleLogo} alt="Google" width="20px" height="20px" />} fullWidth className="social-login" variant="outlined"> Continue with Google </Button>
                <Button startIcon={<img src={appleLogo} alt="Google" width="20px" height="20px" />}  fullWidth className="social-login" variant="outlined"> Continue with Apple </Button>
                <Button startIcon={<img src={facebookLogo} alt="Google" width="20px" height="20px" />}  fullWidth className="social-login" variant="outlined"> Continue with Facebook </Button> 
            </Box>       
        </Box>
    </StyledModal>
  );
};






export default SignUpModal;
