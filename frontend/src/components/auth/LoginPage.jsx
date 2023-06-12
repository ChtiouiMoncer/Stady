import {Alert, Box, Button, Checkbox, Chip, CircularProgress, Divider, FormControlLabel, FormGroup, IconButton, Link,  Modal, Stack, styled, TextField, Typography, useMediaQuery } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import googleLogo from '../../assets/logoGoogle.png'
import facebookLogo from '../../assets/logoFacebook.png'
import { useTheme } from '@mui/material/styles';
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from '../../api/axios'
import jwt_decode from 'jwt-decode';
import useAuth from "../../Hooks/useAuth";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import loginbg from '../../assets/herobg.png'
import Navbar from "../Navbar";


const StyledModal = styled(Box) (({ theme }) => ({

  //backgroundColor: theme.palette.green.main,
  backgroundImage: `url(${loginbg})`,
  height: '90vh',
  backgroundSize: 'cover',
  display: 'flex',
  flexDirection:"column",
  alignItems: 'center',
  justifyContent: 'center',
  
  ".action-button": {
      marginTop: "20px",
      marginBottom: "8px",
      color: theme.palette.white.main,
      backgroundColor: theme.palette.green.main,
      textTransform: "none",
      "&:hover": {
          backgroundColor: theme.palette.green.light,
        },
      "&.MuiButton-focusVisible": {
          boxShadow: "none !important"
        }  
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
  
const LoginPage = () => {  

const theme = useTheme(); //using the the Material-UI theme object, which is provided by the useTheme hook from Material-UI.
const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // checking if device is mobile

const [ isPending, setIsPending ] = useState(false); //loading from server

const { auth, setAuth } = useAuth(); // Access the setAuth function and auth variable from the AuthContext


const navigate = useNavigate(); //hook from 'react-router' to redirect to a path for example
const location = useLocation(); //get the current user's path details

const from = location.state?.from?.pathname || "/"; // get the last path that the user attempted to access if it exists we redirect to it it else the user will be redirected to  '/'

//for the ERRORS 
const [errMsg, setErrMsg] = useState('');


//SIGN UP ENDPOINT
const LOGIN_URL = '/authentication_token'

// This line calls the `useForm` hook, which returns an object with several properties and methods that we can use to manage our form state and behavior.
const { handleSubmit,  reset, control, getValues, formState: { errors }, watch, } = useForm();

//validation rules for form inputs.
const validationRules = {
  username: {
    required: 'Enter your username',
  },
  password: {
    required: 'Enter your password',
  },
}

const handleReset = () => {
  reset(); // This will clear all of the input fields and their errors
};

//get the username and password from the form data
const usernameValue = watch('username');
const passwordValue = watch('password');

//onSubmit arrow function
const onSubmit =  async (data, e) => {
  setIsPending(true);
  // Prevent the default form submission behavior from occurring (e is the event of submitting )
  e.preventDefault();
  
  //console.log(data); 
  try {
    const response = await  axios.post(LOGIN_URL,
      JSON.stringify({
        username : usernameValue,
        password: passwordValue,
        }),
        {
          headers: {'Content-Type' : 'application/ld+json'},
          
        }
    );
    //console.log(response?.data);
    setErrMsg('');
    handleReset();
    setIsPending(false);
    const access_token = response.data.token; //get the access token from the response
    const refresh_token = response.data.refresh_token; //get the refresh token from the response
  
    // Store the refresh token in localStorage
    localStorage.setItem('refresh_token', refresh_token);
 

    const decoded_token = jwt_decode(access_token); //decode the access token
    const username = decoded_token.username; //get the username from payload data of the access token
    const roles = decoded_token.roles; //get the roles from payload data of the access token
    const iat = decoded_token.iat; //(issued at) represents the timestamp when the token was issued/generated
    const exp = decoded_token.exp; //(expiration time) represents the timestamp when the token is set to expire
    setAuth({ access_token, username, roles, iat, exp }) //pass user informations to the AuthContext
    //console.log(auth.username);  
    navigate(from, {replace: true})  
  
    } catch (err) {
    if (!err?.response) {
      setErrMsg('No Server Response');

    } else if (err.response && err.response.status === 401) {
      setIsPending(false);
      setErrMsg('username or password is incorrect');

    } else {
      setIsPending(false);
      setErrMsg('Login Failed');

    }
  }
};

  return (
    <>
    <Navbar />            
    <StyledModal
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    > 

        <Box
            
            sx={{
            position: "relative",  
            bgcolor: "background.default",
            color: "text.primary",
            padding: 4,
            borderRadius: 2,
            border: `1px solid ${theme.palette.green.main}`, // Add border property
            //'& > *': { marginBottom:'10px' },
            maxHeight: '80vh',
            width: isMobile ? '70vw' : '330px', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
            height: isMobile ? 'auto' : 'auto', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
            }}
        >              
      
            <Box sx={{ display: "flex",  justifyContent: "space-between" }}>
                <Typography variant="h6" textAlign="left" sx={{ color: "green.main"}}>
                Welcome Back! 👋
                </Typography>
            
            </Box>

            <Stack sx={{ width: '100%' }} spacing={2}>
              {errMsg && (
                <Alert sx={{
                    borderRadius: 5,
                    backgroundColor: 'white.main',
                    color: 'error.main',
                      '& .MuiAlert-icon': {
                        color: 'error.main', // set the color of the icon
                      },  
              }} severity="error">
                  {errMsg}
                </Alert>
              )}
            </Stack>


          <form onSubmit={handleSubmit(onSubmit)}>

            <Controller
              name="username" 
              control={control} 
              defaultValue="" 
              rules={validationRules.username} 
              render={({ field, fieldState }) => ( 
                <StyledTextField
                fullWidth
                id="outlined-username-input"
                label= {<Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                Username
                </Typography>}
                type="text"
                autoComplete="Username"   
                error={!!fieldState.error} 
                helperText={fieldState.error?.message} 
                {...field}  
                />
              )}
              />   

            <Controller
              name="password" 
              control={control} 
              defaultValue="" 
              rules={validationRules.password} 
              render={({ field, fieldState }) => (       
              <StyledTextField
              sx={{ marginTop: "10px"}}
              fullWidth
              id="outlined-password-input"
              label= {<Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
              Password
              </Typography>}
              type="password"
              autoComplete="Password"
              error={!!fieldState.error} 
              helperText={fieldState.error?.message} 
              {...field}  
              />
            )}
            />  

            <Button
              disableElevation={true} //Elevation means determines how raised or lifted an element appears to be.
              fullWidth
              className="action-button"
              type="submit"
              variant="contained"
              //disabled={isPending} // disable the button when the form is being submitted
            >
              {isPending ? (
                <CircularProgress color="white" size={24} /> // use MUI's Button component for the progress indicator
              ) : (
                "Login"
              )}
            </Button>
          </form>    
  
            <Link  component={RouterLink} to="/"  underline="hover" variant="subtitle2" sx={{ color: "grey.main"}}  >
              <Typography sx={{ fontSize: "12px" }} textAlign='center'>
                {'Forgotten account?'}
              </Typography> 
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
            </Box>  

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent:'center', gap: '5px', marginTop: '15px'}}>      
              <Typography sx={{ fontSize: "15px", color: "green.main", fontWeight: 600 }} >
                {"Don't have an account? "}
              </Typography> 
              <Link  component={RouterLink} to="/signup"  underline="always" variant="subtitle2" sx={{ color: "grey.main"}}  >
                <Typography sx={{ fontSize: "13px" }} >
                  {"Register now "}
                </Typography>
              </Link>
            </Box>  
        </Box>
    </StyledModal>
    </>

  );
};






export default LoginPage;