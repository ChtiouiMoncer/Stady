import {Box, Button, Checkbox, Chip, Alert, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, IconButton, InputLabel, Link, MenuItem, Modal, Select, styled, TextField, Tooltip, Typography, useMediaQuery, Stack } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import googleLogo from '../../assets/logoGoogle.png'
import facebookLogo from '../../assets/logoFacebook.png'
import { useTheme } from '@mui/material/styles';
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from "@mui/system/Unstable_Grid/Grid";
import axios from '../../api/axios'


const StyledModal = styled(Modal) (({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "auto",
  ".action-button": {
      margin: '5px 0px',
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
     marginBottom:'5px',
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

  const StyledRoleSelect = styled(FormControl)({
    '& .MuiOutlinedInput-root': {
        height: '40px', // replace with your desired height
        marginTop: '20px',
    
        '& fieldset': { //fieldset used for border 
          borderColor: 'green', // default border color
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
        color: 'green',

        '&.Mui-focused': {
          color: 'green',
        },
  
    },

  });
  
const SignUpModal = (props) => {  
const  { open, onClose }  = props; //defining the necessary props
const theme = useTheme(); //using the the Material-UI theme object, which is provided by the useTheme hook from Material-UI.
const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // checking if device is mobile
const [role, setRole] = React.useState('ROLE_MEMBER'); //set the dafault role as a 'member'
const [showPassword, setShowPassword] = React.useState(false); //manage the state of 'showPassword'

//for the ERRORS AND SUCCESS
const [errMsg, setErrMsg] = useState('');
const [success, setSuccess] = useState(false);

//
const REGISTER_URL = '/api/users'

  const handleClickShowPassword = () => setShowPassword((show) => !show); // updates the state of showPassword by passing the opposite boolean value of show.

  // when a user clicks on a button, the button is highlighted and focused.
  // By calling event.preventDefault(), this behavior is prevented and the button remains unfocused and unhighlighted when clicked.
  const handleMouseDownPassword = (event) => {
    event.preventDefault(); // used to prevent(turn off) the default behavior of a mousedown event on the icon button.
     
  };

  // This line calls the `useForm` hook, which returns an object with several properties and methods that we can use to manage our form state and behavior.
  const { handleSubmit,  reset, control, getValues, formState: { errors }, watch, } = useForm();

//validation rules for form inputs.
const validationRules = {
  username: {
    required: 'Username is required',
    minLength: { value: 5, message: 'Username must be at least 5 characters long' },
    maxLength: { value: 20, message: 'Username must be at most 20 characters long' },
    pattern: {
      value: /^[a-zA-Z0-9-_.]+$/,
      message: 'Username can only contain letters, numbers, and some special characters',
    },
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  },
  password: {
    required: 'Password is required',
    minLength: { value: 5, message: 'Password must be at least 5 characters long' },
    maxLength: { value: 20, message: 'Password must be at most 30 characters long' },
    /*validate: {
      hasUppercase: (value) =>
        /[A-Z]/.test(value) || 'Password must include at least one uppercase letter',
      hasLowercase: (value) =>
        /[a-z]/.test(value) || 'Password must include at least one lowercase letter',
      hasNumber: (value) => /\d/.test(value) || 'Password must include at least one number',
      hasSymbol: (value) => /[\W_]/.test(value) || 'Password must include at least one symbol',
    },*/
  },  
  passwordMatch: {
    required: 'Confirm your password',
    validate: {
      matchesPassword: (value) => {
        const password = getValues().password; //get the password field value
        return password === value || 'Passwords do not match'; //If password is equal to value,the function returns true, which means the validation passes.
      },
    },
  }, 
  roles: {
    required: 'Please Select a Role ',
  },
  terms:{
    required: 'Please Accept our Terms & Conditions',
  },  
  conditions:{
    required: 'Please Accept our Conditions',
  },   
  // Add more input validation rules here...
};

//onSubmit arrow function
const onSubmit =  async (data, e) => {
  // Prevent the default form submission behavior from occurring (e is the event of submitting )
  e.preventDefault();
  const usernameValue = watch('username');
  const emailValue = watch('email');
  const passwordValue = watch('password');
  const rolesValue = watch('roles');
  //console.log(rolesValue);

  try {
  const response = await  axios.post(REGISTER_URL,
    JSON.stringify({
      email: emailValue,
      roles: [rolesValue],
      plainPassword: passwordValue,
      username : usernameValue
      }),
      {
        headers: {'Content-Type' : 'application/ld+json'},
        //withCredentials: true
      }
  );
  console.log(response.data);
  console.log(JSON.stringify(response))
  setSuccess(true);
  reset();
} catch (err) {
  if (err.response && err.response.status === 422) {
    const violations = err.response.data.violations;
    const emailError = violations.find(v => v.propertyPath === "email");
    const usernameError = violations.find(v => v.propertyPath === "username");
    
    if (emailError && usernameError) {
      setErrMsg('Email and username are already taken');
    } else if (emailError) {
      setErrMsg('Email is already taken');
    } else if (usernameError) {
      setErrMsg('Username is already taken');
    } else {
      setErrMsg('Registration failed');
    }
  } else {
    setErrMsg('No server response');
  }
}


};


const handleReset = () => {
  reset(); // This will clear all of the input fields and their errors
};


//handle the role change select
const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <StyledModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ 
        maxHeight: '90vh',
        width: isMobile ? '90vw' : '410px', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
        height: isMobile ? 'auto' : 'auto', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
        //overflowY: 'auto',  // add this line to make the modal scrollable
        //display: 'block', //takes up the full width of its container and starts on a new line
        //margin: 'auto', // center the modal horizontally

        top: '-40px'

      }}  
    >
        <Box
            sx={{
            bgcolor: "background.default",
            padding: 3,
            borderRadius: 2,
            }}
        > 

            <Box sx={{ display: "flex",  justifyContent: "space-between", marginBottom:'10px'}}>
                <Typography variant="h6" textAlign="left" sx={{ color: "green.main" }}>
                Sign up for Stady
                </Typography>
                <Tooltip title="Reset" arrow>
                  <IconButton onClick={handleReset} >
                      <RestartAltIcon sx={{ height:"20px", width:"20px", color: "grey.main", position: "absolute"}}  />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Close" arrow>
                  <IconButton onClick={onClose} >
                      <CloseIcon sx={{ height:"20px", width:"20px", color: "grey.main", position: "absolute"}}  />
                  </IconButton>
                </Tooltip>
            </Box>
            {/*<Typography variant="subtitle2" textAlign="left" sx={{ color: "grey.main", marginBottom:'0px'}}>
                Sign up using your email address to get started.
          </Typography>*/}
            
            <Stack sx={{ width: '100%' }} spacing={2}>
              {success && (
                <Alert sx={{ color: 'green.main', backgroundColor: 'green.dark' }} severity="success">
                  User added successfully!
                </Alert>
              )}
              {errMsg && (
                <Alert sx={{  }} severity="error">
                  {errMsg}
                </Alert>
              )}
            </Stack>
          
            <form onSubmit={handleSubmit(onSubmit)}>

              <Controller
              // Specify the name of the form field that this input represents
              name="username" //if u want that user write at two input fields at the same time give them the same username
              // Pass The control prop that will  connects the Controller component with the input field
              control={control} 
              // Set the default value of the input field
              defaultValue="" 
              // Specify the validation rules for this input field
              rules={validationRules.username} 
              // Use the 'render' prop to customize the rendering of the input field
              render={({ field, fieldState }) => ( //
                  <StyledTextField 
                  fullWidth
                  id="outlined-username-input"
                  label= {<Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                  Username
                  </Typography>}
                  type="text"
                  autoComplete="Right Down your Username!"
                  // Set the 'error' prop to a boolean that indicates whether the input field has a validation error
                  error={!!fieldState.error} 
                  // Set the 'helperText' prop to an error message that describes the validation error, if there is one
                  helperText={fieldState.error?.message} 
                  // Spread the 'field' prop to pass all of the necessary props (e.g. onChange, onBlur) to the TextField component
                  {...field} // When you pass ...field, it is equivalent to passing value={field.value}, onBlur={field.onBlur}, and onChange={field.onChange}                 
                  />
              )}
            />  
            
            <Controller
              name="email" 
              control={control} 
              defaultValue="" 
              rules={validationRules.email} 
              render={({ field, fieldState }) => ( 
                <StyledTextField
                fullWidth
                id="outlined-email-input"
                label= {<Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                Email
                </Typography>}
                type="text"
                autoComplete="Email or phone number"    
                error={!!fieldState.error} 
                helperText={fieldState.error?.message} 
                {...field} 
                />
              )}
              />   


            <Grid container spacing={2}>
              <Grid xs={6}>
                <Controller 
                name="password"
                control = {control}
                defaultValue=""
                rules={validationRules.password}
                render={ ({ field, fieldState }) => (
                  <StyledTextField
                    fullWidth
                    id="outlined-password-input"
                    label= {
                    <Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                      Password
                    </Typography>}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{  //pass additional props to the Input    
                      endAdornment: ( // prop that specifies the element that should appear at the end of the input field
                      //position the icon button at the end of the input field.
                      <InputAdornment position="end"> 
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword} //responsible for toggling the visibility of the password
                          onMouseDown={handleMouseDownPassword} //responsible for temporarily changing the input type to "text" 
                          edge="end"
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}{/* If showPassword is true, we render the VisibilityOff */} 
                        </IconButton>
                      </InputAdornment>
                      ),
                    }}
                    autoComplete="Password"
                    error={!!fieldState.error} 
                    helperText={fieldState.error?.message} 
                    {...field} 
                  />
                )}
                />      
              </Grid> 

              <Grid  xs={6}>
              
                <Controller 
                name="passwordMatch"
                control = {control}
                defaultValue=""
                rules={validationRules.passwordMatch}
                render={ ({ field, fieldState }) => (
                  <StyledTextField
                    fullWidth
                    id="outlined-passwordMatch-input"
                    label= {
                    <Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                      Confirm Password
                    </Typography>}
                    type='password'
                    autoComplete="password Match"
                    error={!!fieldState.error} 
                    helperText={fieldState.error?.message} 
                    {...field} 
                  />
                )}
                />    
              </Grid>
            </Grid>    
           


             
              
              <Controller 
              name="roles"
              control = {control}
              defaultValue={role}
              rules={validationRules.roles}
              render={ ({ field, fieldState }) => (          
                <StyledRoleSelect fullWidth>
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="rolee-select"
                    value={role} // set default value to 10 for "Member"
                    label="Role"
                    onChange={handleRoleChange}
                    error={!!fieldState.error} 
                    {...field} 
                  >
                    <MenuItem value={'ROLE_MEMBER'}>Member</MenuItem>
                    <MenuItem value={'ROLE_OWNER'}>Owner</MenuItem>
                  </Select>
                  <FormHelperText>If you are a Pitch Owner change the Role.  </FormHelperText>
                </StyledRoleSelect>
              )}
             /> 

            <Box mb={1}>
              <FormGroup>
                <FormControl >
                  <Controller 
                    name="terms"
                    control = {control}
                    rules={validationRules.terms}
                    render={ ({ field, fieldState }) => ( 
                      <FormControlLabel 
                        sx={{ marginBottom: "-7px" }} 
                        control={
                          <Checkbox size="small" //defaultChecked
                          {...field} 
                            sx={{
                            '&.Mui-checked': {
                            color: "green.main",
                            },
                            }} 
                          /> 
                        } 
                        label={
                          <Typography variant="subtitle2" textAlign="left" sx={{ color: "grey.main" }}>
                            I agree to the
                            <Link href="#" underline="none" sx={{ color: "green.main" }}>
                              {" terms and conditions"}
                            </Link>
                          </Typography>
                        }
                      />
                   )}
                  />
                  {errors.terms && (
                    <FormHelperText error color="error" variant="caption">
                      {errors.terms.message}
                    </FormHelperText>
                   )} 
                            
                    { /* <FormControlLabel
                      control={
                        <Checkbox size="small" //defaultChecked
                          sx={{
                            '&.Mui-checked': {
                              color: "green.main",
                              },
                            }} 
                        /> 
                      } 
                      label={
                        <Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                         Send me the latest deal alerts
                        </Typography>}
                      /> */ }
                 </FormControl>
              </FormGroup>
            </Box>

            <Button fullWidth className="action-button" type="submit" variant="contained" >Create account</Button>

            </form>


            <Divider sx={{ marginTop:"10px", marginBottom:"10px" }}>
                <Chip label={
                    <Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                    or
                    </Typography>   
                } />
            </Divider> 

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Button startIcon={ <img src={googleLogo} alt="Google" width="20px" height="20px" />} fullWidth className="social-login" variant="outlined"> Continue with Google </Button>
                {/*<Button startIcon={<img src={facebookLogo} alt="Google" width="20px" height="20px" />}  fullWidth className="social-login" variant="outlined"> Continue with Facebook </Button> */ }
            </Box>       
        </Box>
    </StyledModal>

  );
};






export default SignUpModal;
