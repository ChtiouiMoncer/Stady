import {Box, Button, Checkbox, Chip, Alert, Divider, FormControl, FormControlLabel, CircularProgress, FormGroup, FormHelperText, IconButton, InputLabel, Link, MenuItem, Modal, Select, styled, TextField, Tooltip, Typography, useMediaQuery, Stack, Container } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
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
import loginbg from '../../assets/herobg.png'
import {Link as RouterLink} from 'react-router-dom';
import Navbar from "../Navbar";
import { green } from "@mui/material/colors";




// Steps of the form
const steps = ['Add Informations', 'Add Assets', 'Add Opening Times'];

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
      margin: '5px 0px',
      color: theme.palette.white.main,
      backgroundColor: theme.palette.green.main,
      textTransform: "none",
      "&:hover": {
          backgroundColor: theme.palette.green.light,
        },
      // when an element receives "focus," it means that the element is currently selected or "active" 
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
  
const Addpitch = (props) => {  

//multi step form declaration 

  // The active step index
  const [activeStep, setActiveStep] = React.useState(0);
  // The set of skipped steps
  const [skipped, setSkipped] = React.useState(new Set());

  // This function determines whether a step is optional or not
  const isStepOptional = (step) => {
    return step === 1;
  };

  // This function determines whether a step is skipped or not
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  // This function handles the "Next" button click
  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  // This function handles the "Back" button click
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // This function handles the "Skip" button click
  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  // This function handles the "Reset" button click
  const handleReset = () => {
    setActiveStep(0);
  };


const theme = useTheme(); //using the the Material-UI theme object, which is provided by the useTheme hook from Material-UI.
const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // checking if device is mobile
const [role, setRole] = React.useState('ROLE_MEMBER'); //set the dafault role as a 'member'
const [showPassword, setShowPassword] = React.useState(false); //manage the state of 'showPassword'
const [ isPending, setIsPending ] = useState(false); //manage pending time from the server response

const activeIconStyle = {
    color: theme.palette.primary.main, // Change this to your preferred color
  };

//for the ERRORS AND SUCCESS
const [errMsg, setErrMsg] = useState('');
const [success, setSuccess] = useState(false);

//SIGN UP ENDPOINT
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
      value: /^[a-zA-Z0-9._%+-.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i, //i flag at the end of the pattern to make the match case-insensitive
      message: 'Invalid email address',
    },
  },
  password: {
    required: 'Password is required',
    minLength: { value: 5, message: 'Password must be at least 5 characters long' },
    maxLength: { value: 20, message: 'Password must be at most 30 characters long' },
    pattern: {
      value: /^[^\s]+$/, //disallow spaces anywhere in the password.
      message: 'Your password must not include spaces',
    },
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
};

//onSubmit arrow function
const onSubmit =  async (data, e) => {
  setIsPending(true);
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
  /*console.log(response.data);
    console.log(JSON.stringify(response))*/
  setErrMsg('');
  setSuccess(true);
  handleReset();
  setIsPending(false);

  } catch (err) {
  if (err.response && err.response.status === 422) {
    setIsPending(false);
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
    setIsPending(false);

  }
 }
};


const handleFormReset = () => {
  reset(); // This will clear all of the input fields and their errors
};

//handle the role change select
const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <>
    <Navbar />            
    <StyledModal
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{  
        //overflowY: 'auto',  // add this line to make the modal scrollable
        //display: 'block', //takes up the full width of its container and starts on a new line
        //margin: 'auto', // center the modal horizontally
        top: '-40px'
      }}  
    >
        <Box
            sx={{
            border: `1px solid ${theme.palette.green.main}`, // Add border property    
            maxHeight: '80vh',
            width: isMobile ? '75vw' : '800px', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
            height: isMobile ? 'auto' : 'auto', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
            bgcolor: "background.default",
            padding: 3,
            borderRadius: 2,
            }}
        > 
            <Box sx={{ display: "flex",  justifyContent: "space-between", marginBottom:'10px'}}>
                <Typography variant="h6" textAlign="left" sx={{ color: "green.main" }}>
                Add a Pitch 
                </Typography>
                <Tooltip title="Reset" arrow>
                  <IconButton onClick={handleFormReset} >
                      <RestartAltIcon sx={{ height:"20px", width:"20px", color: "grey.main", position: "absolute"}}  />
                  </IconButton>
                </Tooltip>
               
            </Box>
            
            <Stack sx={{ width: '100%' }} spacing={2}>
              {success && (
                <Alert sx={{
                  borderRadius: 5,
                  backgroundColor: 'white.main',
                  color: 'green.main',
                  '& .MuiAlert-icon': {
                      color: 'green.main', // set the color of the icon
                    },
                    }} severity="success">
                  Pitch added successfully!
                </Alert>
              )}
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
          
            <Stepper activeStep={activeStep} >
                {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepSkipped(index)) {
                    stepProps.completed = false;
                }
                return (
                    <Step key={label} {...stepProps}>
                        <StepLabel
                        {...labelProps}
                        sx={{
                        '.css-1pj4fnu-MuiSvgIcon-root-MuiStepIcon-root.Mui-active': { // default step styles
                            color: 'green.main', // change non-active step color here
                        },
                        '.css-86lzs0-MuiStepIcon-text' : {
                            fill: 'white'
                        },
                        '.css-1pj4fnu-MuiSvgIcon-root-MuiStepIcon-root.Mui-completed' : {
                            color: 'green.main', // change non-active step color here
                        }
                        }}
                    >
                        {label}
                    </StepLabel>
                    </Step>
                );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                    All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleReset}>Reset</Button>
                </Box>
                </React.Fragment>
            ) : ( 
                <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>   
                {/** Here we add TextFields for each step **/}
          {activeStep === 0 && (    
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
                        {showPassword ? <Visibility /> : <VisibilityOff />}{/* If showPassword is true, we render the VisibilityOff */} 
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
                    defaultValue={false} // set default value to false
                    rules={validationRules.terms}
                    render={ ({ field, fieldState }) => ( 
                      <FormControlLabel 
                        sx={{ marginBottom: "-7px" }} 
                        control={
                          <Checkbox size="small" //defaultChecked
                          {...field} 
                          checked={field.value} //checkbox will be reset to unchecked when the reset()
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
                 
                 </FormControl>
              </FormGroup>
             </Box>
             <Button
              disableElevation={true} //Elevation means determines how raised or lifted an element appears to be.
              fullWidth
              className="action-button"
              type="submit"
              variant="contained"
              disabled={isPending} // disable the button when the form is being submitted
              //prevent the button's elevation from changing with disableElevation
             >
              {isPending ? (
                <CircularProgress color="white" size={24} /> // use MUI's Button component for the progress indicator
              ) : (
                "Create account"
              )}
             </Button>
            </form>
            )}
             {activeStep === 1 && (
            <TextField label="Assets" variant="outlined" sx={{ mt: 2, mb: 2 }} fullWidth />
            )}
            {activeStep === 2 && (
                <TextField label="Opening Times" variant="outlined" sx={{ mt: 2, mb: 2 }} fullWidth />
            )}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                >
                <Typography sx={{ color: "grey.main" }} >Back</Typography> 
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                <Typography sx={{ color: "grey.main" }} >Skip</Typography> 
                </Button>
                )}

                <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ?
                <Typography sx={{ color: "green.main" }} >Finish</Typography> 
                :
                <Typography sx={{ color: "green.main" }}>Next</Typography> 
                }
                </Button>
            </Box>
        </React.Fragment>
      )}
            
        </Box>
    </StyledModal>
    </>


  );
};

export default Addpitch;
