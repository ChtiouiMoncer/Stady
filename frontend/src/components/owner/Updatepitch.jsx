import {Box, Button, Checkbox, Chip, Alert, Divider, FormControl, FormControlLabel, CircularProgress, FormGroup, FormHelperText, IconButton, InputLabel, Link, MenuItem, Modal, Select, styled, TextField, Tooltip, Typography, useMediaQuery, Stack, Container, FormLabel, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, Switch } from "@mui/material";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from "@mui/system/Unstable_Grid/Grid";
import axios from '../../api/axios'
import loginbg from '../../assets/herobg.png'
import Navbar from "../Navbar";
import MuiPhoneNumber from 'mui-phone-number';
import GroupsIcon from '@mui/icons-material/Groups';
import WidthFullIcon from '@mui/icons-material/WidthFull';
import { Checkroom, SpaceDashboard } from "@mui/icons-material";
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShowerIcon from '@mui/icons-material/Shower';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import useAuth from "../../Hooks/useAuth";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Footer from "../homePage/Footer";




const StyledModal = styled(Box) (({ theme }) => ({
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
      "&.MuiButton-focusVisible": {
        boxShadow: "none !important"
      }
    },
 ".social-login": {
    borderColor: theme.palette.green.main, 
    color: theme.palette.green.main,
        backgroundColor: theme.palette.white.main,
        textTransform: "none",
        "&:hover": {
            backgroundColor: theme.palette.green.light,
            color: theme.palette.white.main, 

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

  const StyledTextFieldDesc = styled(TextField)({
    marginBottom:'5px',
   '& .MuiOutlinedInput-root': {
       height: '100px', // replace with your desired height
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
  
// Steps of the form
const steps = ['Add Informations', 'Add Assets', 'Add Opening Times'];

const Updatepitch = (props) => {  

  const locationn = useLocation();
  const { pitchName } = useParams();
  const { state } = locationn;
  const pitcheId = state && state.pitchId ? state.pitchId : null;
  const [pitch, setPitch] = useState();

  const getPitchData = async () => {
    try {
        const response = await axios.get(`/api/grounds/${pitcheId}`, {
            headers: {'accept': 'application/json'}
        });

        // handle the fetched data
        setPitch(response.data);
     

    } catch (err) {
        console.log(err);

    }
}

useEffect(() => {

    getPitchData();

  }, [pitchName]);




  //auth context
  const { auth } = useAuth(); //get the auth object from useAuth
  
  // This line calls the `useForm` hook, which returns an object with several properties and methods that we can use to manage our form state and behavior.
  const { handleSubmit, reset, control, getValues, formState: { errors, isDirty, isSubmitting, touchedFields, submitCount, touched, isValid, register, setValue }, watch, validate, setError } = useForm();

  // The active step index
  const [activeStep, setActiveStep] = React.useState(0);
  // The set of skipped steps
  const [skipped, setSkipped] = React.useState(new Set());

  // This function determines whether a step is skipped or not
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  // This function handles the "Next" button click
  const handleNext = () => {
    if (activeStep === 0) {
    }
  
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

  // This function handles the "Reset" button click
  const handleReset = () => {
    setActiveStep(0);
  };

  //for the ERRORS AND SUCCESS
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  //sportsType data state
  const [sportsTypes, setSportsTypes] = useState();  
  const [states, setStates] = useState();  


 //sportsType ENDPOINT
 const SPORTS_TYPES_URL = '/api/sports_types'
 const STATES_URL = '/api/states'


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController(); //cancel the request when the comp unmounts

    const getSportsType = async () => {
        try {
            const response = await axios.get(SPORTS_TYPES_URL, {
                    signal: controller.signal, //cancel the request if we need to    
                    headers: {'accept': 'application/json'} // include the accept header
                },    
            );    
            console.log(response.data);
            isMounted && setSportsTypes(response.data);
        } catch (err) {
          console.log(err)
        }
    }
    const getStates = async () => {
      try {
          const response = await axios.get(STATES_URL, {
                  signal: controller.signal, //cancel the request if we need to    
                  headers: {'accept': 'application/json'} // include the accept header
              },    
          );    
          console.log(response.data);
          isMounted && setStates(response.data);
      } catch (err) {
        console.log(err)
      }
  }
    getSportsType();
    getStates();
     return () => {
        isMounted = false; 
        controller.abort(); 
    }
}, [])

const theme = useTheme(); //using the the Material-UI theme object, which is provided by the useTheme hook from Material-UI.
const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // checking if device is mobile
const [ isPending, setIsPending ] = useState(false); //manage pending time from the server response

const navigate = useNavigate(); //hook from 'react-router' to redirect to a path for example

//validation rules for form inputs.
const validationRules = {
  name: {
    required: 'Name is required',
    minLength: { value: 5, message: 'Pitch Name must be at least 5 characters long' },
    maxLength: { value: 50, message: 'Pitch Name must be at most 50 characters long' },
    pattern: {
      value: /^[a-zA-Z0-9-_. ]+$/,
      message: 'Name can only contain letters, numbers, and some special characters',
    },
  },
  description: {
    required: 'Description is required',
    minLength: { value: 5, message: 'Describe  the Pitch at least with 5 characters long' },
    maxLength: { value: 200, message: 'Describe  the Pitch at max with 200 characters long' },
    
  },
  phone: {
    required: 'Phone is required',
  },  
  capacity: {
    required: 'Write your Pitch Capacity',
    minLength: { value: 2, message: 'Min Capacity is 2' },
    maxLength: { value: 100, message: 'Max Capacity is 100' },
   
  }, 
  size: {
    required: 'Write your Pitch Size',
    pattern: {
      value: /^[0-9]+X[0-9]+$/i,
      message: 'Size format (widthXlength)',
    },
  },
  sportsType: {
    required: 'Please Select a Sports Type ',
  },
  floorType: {
    required: 'Please Select a Floor Type ',
  },  
  town:{
    required: 'Please Select a State',
  }, 
  terms:{
    required: 'Please Accept our Terms & Conditions',
  },  
    
};

//FORM VALUES
const nameValue = watch('name');
const descriptionValue = watch('description');
const phoneValue = watch('phoneNumber');
const capacityValue = parseInt(watch('capacity'), 10);
const sizeValue = watch('size');
const sportsTypeValue = watch('sportsType');
const floorTypeValue = watch('floorType');
const stateValue = watch('town');
const hasShowerValue = watch('Shower');
const hasSecureStorageValue = watch('Storage');
const hasChangingRoomValue = watch('Locker_Room');
const hasRestaurantValue = watch('Restaurant');
const hasParkingValue = watch('Parking');


//SPORTS TYPE
// Watch the sportsType field
const selectedSportsType = watch('sportsType');

// Get the floorTypes for the selected sportsType
let selectedFloorTypes = [];
if (selectedSportsType) {
  const selectedSport = sportsTypes.find(sport => sport.id === selectedSportsType);
  if (selectedSport) {
    selectedFloorTypes = selectedSport.floorTypes;
  }
}

//USER ID
let userId = auth.userId;
//URL
const sportsTypeUrl = `/api/sports_types/${sportsTypeValue}`;
const floorTypeUrl = `/api/floor_types/${floorTypeValue}`;
const stateUrl = `/api/states/${stateValue}`;
const ownerUrl = `/api/users/${userId}`;


//AMENTIES
const amenitiesList = [
  {name: 'Shower', icon: <ShowerIcon />},
  {name: 'Storage', icon: <SpaceDashboard />},
  {name: 'Locker_Room', icon: <Checkroom />},
  {name: 'Restaurant', icon: <RestaurantIcon />},
  {name: 'Parking', icon: <LocalParkingIcon />},
];



//OPENING_TIMES
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const [openingTimes, setOpeningTimes] = useState(
  daysOfWeek.map(day => ({
    day,
    openTime: "09:00:00",
    closeTime: "22:00:00",
    isClosed: false,
    interval: 90,
    price: 50.00,
  }))
);

const handleInputChange = (index, field) => event => {
  const newOpeningTimes = [...openingTimes];
  newOpeningTimes[index][field] = event.target.value;
  
  // Parse the value as a number if it's for the 'interval' or 'price' field
  if (field === 'interval') {
    newOpeningTimes[index][field] = parseInt(event.target.value, 10);
  } else if (field === 'price') {
    newOpeningTimes[index][field] = parseFloat(event.target.value);
  } else {
    newOpeningTimes[index][field] = event.target.value;
  }

  setOpeningTimes(newOpeningTimes);
};

const handleSwitchChange = index => event => {
  const newOpeningTimes = [...openingTimes];
  newOpeningTimes[index].isClosed = event.target.checked;
  setOpeningTimes(newOpeningTimes);
};

//GOOGLE MAPS
const { isLoaded } = useJsApiLoader({
  id: 'google-map-script',
  googleMapsApiKey: "AIzaSyC1aTRiewjhy6DnOvFZwTxEDcxdrVh83xA"
})
const [location, setLocation] = useState(null);
// get long and lat
useEffect(() => {
  if (location) {
    console.log(location.lng, location.lat); // or do something else with the updated location
  }
}, [location]); 


//UPLOAD IMAGES
const MAX_FILES = 10;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

const inputRef = useRef();
const [files, setFiles] = useState([]);

const handleUploadClick = () => {
  inputRef.current.click();
};

const handleFileChange = (event) => {
  const selectedFiles = Array.from(event.target.files);
  
  // Check total files
  if (selectedFiles.length > MAX_FILES) {
    alert(`You can only select up to ${MAX_FILES} files.`);
    return;
  }

  // Check file sizes and types
  for (let i = 0; i < selectedFiles.length; i++) {
    if (selectedFiles[i].size > MAX_FILE_SIZE) {
      alert(`File "${selectedFiles[i].name}" is too large. Maximum file size is ${MAX_FILE_SIZE / 1024 / 1024} MB.`);
      return;
    }
    if (!ALLOWED_TYPES.includes(selectedFiles[i].type)) {
      alert(`File "${selectedFiles[i].name}" is not a valid image. Only JPEG and PNG images are allowed.`);
      return;
    }
  }

  setFiles(selectedFiles);
  // TODO: Upload files to server
};

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: pitch?.address.longitude,
  lng: pitch?.address.latitude,
};

const handleFileDelete = (indexToDelete) => {
  setFiles(files.filter((file, index) => index !== indexToDelete));
};

const axiosPrivate = useAxiosPrivate();

//REGISTER PITCH ENDPOINT
const PATCH_PITCH_URL = `/api/grounds/${pitcheId}`;

const amentiesData = {
  hasShower: hasShowerValue,
  hasSecureStorage: hasSecureStorageValue,
  hasChangingRoom: hasChangingRoomValue,
  hasRestaurent: hasRestaurantValue,
  hasParking: hasParkingValue
};

//SNACKBAR:
const [snackbarOpen, setSnackbarOpen] = useState(false);

const handleClose = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }

  setSnackbarOpen(false);
};
//SUBMIT FORM
const onSubmit = async (data, e) => {
  console.log(ownerUrl);  

  e.preventDefault();
  setIsPending(true);
  try {
    const response = await axiosPrivate.patch( PATCH_PITCH_URL,
      JSON.stringify({
        name: nameValue,
        description: descriptionValue,
        capacity: capacityValue,
        size: sizeValue,
        phoneNumber: phoneValue,
        //sportsType: sportsTypeUrl,
        //floorType: floorTypeUrl,
        //state: stateUrl,
        /*address: {
          longitude: location.lng,
          latitude: location.lat,
        },*/
        /*amenties: {
          hasShower: hasShowerValue,
          hasSecureStorage: hasSecureStorageValue,
          hasChangingRoom: hasChangingRoomValue,
          hasRestaurent: hasRestaurantValue,
          hasParking: hasParkingValue,
        },*/
        openingTimes: openingTimes, 
        //owner: ownerUrl
      }),
      {
        headers: { 'Content-Type': 'application/merge-patch+json' },
      }
    );
    const pitchId = response.data.id;
    // Upload images
    const uploadPromises = files.map((file) => {
      const formData = new FormData();
      formData.append("title", file.name);
      formData.append("imageFile", file);
      formData.append("pitch", `/api/pitches/${pitchId}`);
      
      return axiosPrivate.post("/api/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    });
    await Promise.all(uploadPromises);
    //Success
    setErrMsg('');
    setSuccess(true);
    setSnackbarOpen(true); 
    setIsPending(false);
    handleReset();
    setTimeout(() => {
      navigate('/owner/dashboard', {replace: true});
    }, 2000); 

  } catch (err) {
    setIsPending(false);
    console.log(err);
    if (err.response && err.response.status === 422) {
      setSuccess(false);
      setIsPending(false);
      const violations = err.response.data.violations;
      const nameError = violations.find(v => v.propertyPath === 'name');

      if ( nameError ) {
        setErrMsg('Pitch name already taken');
      } 

    } else {
      setSuccess(false);
      setIsPending(false);
      setErrMsg('Pitch Update failed, Try Again!');
    }
 
  }
};

const handleFormReset = () => {
  reset(); // This will clear all of the input fields and their errors
};



  return (
  <>
    <Navbar />            
    <StyledModal
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{  
      
        //margin: 'auto', // center the modal horizontally
        top: '-40px'
      }}  
    >
      {pitch && pitch.name && (

      <Box
            sx={{
            maxHeight: '75vh',  
            overflow: 'auto',  // add this line to make the modal scrollable
            display: 'block', //takes up the full width of its container and starts on a new line
            margin: 'auto', // center the modal horizontally
            border: `2px solid ${theme.palette.green.main}`, // Add border property    
            width: isMobile ? '75vw' : '900px', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
            height: isMobile ? 'auto' : 'auto', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
            bgcolor: "background.default",
            padding: 3,
            borderRadius: 2,
            }}
      > 
            <Box sx={{ display: "flex",  justifyContent: "space-between", marginBottom:'10px'}}>
                <Typography variant="h6" textAlign="left" sx={{ color: "green.main" }}>
                Update a Pitch 
                </Typography>
                <Tooltip title="Reset" arrow>
                  <IconButton onClick={handleFormReset} >
                      <RestartAltIcon sx={{ height:"20px", width:"20px", color: "grey.main", position: "absolute"}}  />
                  </IconButton>
                </Tooltip>
               
            </Box>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleClose}
              action={
                <React.Fragment>
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={() => setSnackbarOpen(false)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </React.Fragment>
              }
            >
              <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                Pitch Updated successfully!
                </Alert>
            </Snackbar>
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
                Pitch Updated successfully!
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
                          '.css-86lzs0-MuiStepIcon-text' : {
                              fill: 'white'
                          },  
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
                    <>  
                      {/* First step */}

                        <Controller
                          name="name" 
                          control={control} 
                          defaultValue={pitch.name} 
                          rules={validationRules.name} 
                          render={({ field, fieldState }) => (
                            <TextField 
                              defaultValue={pitch?.name}
                              fullWidth
                              id="outlined-username-input"
                              label= {
                                <Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                                  Name
                                </Typography>
                              }
                              type="text"
                              autoComplete="Right Down The Pitch Name!"
                              error={!!fieldState.error} 
                              helperText={fieldState.error?.message} 
                              {...field}   
                            />
                          )}
                        />
                   
                                            
                      <Controller
                      name="description" 
                      control={control} 
                      defaultValue="A very Good Pitch" 
                      rules={validationRules.description} 
                      render={({ field, fieldState }) => ( 
                        <StyledTextFieldDesc
                        defaultValue="A very Good Pitch" 
                        multiline
                        rows={4}
                        fullWidth
                        id="outlined-email-input"
                        label= {<Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                        Description
                        </Typography>}
                        type="text"
                        autoComplete="Write a description"    
                        error={!!fieldState.error} 
                        helperText={fieldState.error?.message} 
                        {...field} 
                        />
                      )}
                      />   
                      <Grid container spacing={2}>
                        <Grid  xs={4}>
                          <Controller 
                          name="phoneNumber"
                          control = {control}
                          defaultValue={pitch.phoneNumber} 
                          rules={validationRules.phone}
                          render={ ({ field, fieldState }) => (
                            <MuiPhoneNumber
                            sx={{ marginTop: '15px', marginLeft: '5px' }}
                              defaultCountry={'tn'}
                              fullWidth
                              id="outlined-phoneNumber-input"
                              label= {
                              <Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                                The Facility Phone Number
                              </Typography>}
                              type='text'
                              autoComplete="Write the pitch phone number"
                              error={!!fieldState.error} 
                              helperText={fieldState.error?.message} 
                              {...field} 
                            />
                          )}
                          />    
                        </Grid>
                        <Grid xs={4}>
                          <Controller 
                          name="capacity"
                          control = {control}
                          defaultValue={pitch.capacity} 
                          rules={validationRules.capacity}
                          render={ ({ field, fieldState }) => (
                            <StyledTextField
                              fullWidth
                              id="outlined-capacity-input"
                              label= {
                              <Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                                Pitch Capacity 
                              </Typography>}
                              type={ 'number'}
                              InputProps={{  //pass additional props to the Input    
                                endAdornment: ( // prop that specifies the element that should appear at the end of the input field
                                //position the icon button at the end of the input field.
                                <InputAdornment position="end"> 
                                  <IconButton>
                                    <GroupsIcon />
                                  </IconButton>
                                </InputAdornment>
                                ),
                              }}
                              autoComplete="Capacity"
                              error={!!fieldState.error} 
                              helperText={fieldState.error?.message} 
                              {...field} 
                            />
                          )}
                          />      
                        </Grid> 
                        <Grid  xs={4}>
                          <Controller 
                          name="size"
                          control = {control}
                          defaultValue={pitch.size} 
                          rules={validationRules.size}
                          render={ ({ field, fieldState }) => (
                            <StyledTextField
                              fullWidth
                              id="outlined-size-input"
                              label= {
                              <Typography  variant="subtitle2" textAlign="left" sx={{ color: "grey.main"}}>
                                Pitch Size
                              </Typography>}
                              InputProps={{  //pass additional props to the Input    
                                endAdornment: ( // prop that specifies the element that should appear at the end of the input field
                                //position the icon button at the end of the input field.
                                <InputAdornment position="end"> 
                                  <IconButton>
                                    <WidthFullIcon />
                                  </IconButton>
                                </InputAdornment>
                                ),
                              }}
                              type='text'
                              autoComplete="Size"
                              error={!!fieldState.error} 
                              helperText={fieldState.error?.message} 
                              {...field} 
                            />
                          )}
                          />    
                        </Grid>
                      </Grid>                   
                      <Grid container spacing={2}>
                        <Grid  xs={6}>      
                          <Controller 
                            name="sportsType"
                            control = {control}
                            rules={validationRules.sportsType}
                            render={ ({ field, fieldState }) => (          
                              <StyledRoleSelect fullWidth>
                                <InputLabel id="role-sportsType-label">Sports Type</InputLabel>
                                <Select
                                  labelId="role-sportsType-label"
                                  id="sportsType-select"
                                  label="sportsType"
                                  error={!!fieldState.error} 
                                  {...field} 
                                  defaultValue={pitch.sportsType?.id} 
                                >
                                  {
                                    sportsTypes && sportsTypes.map((sportType) => (
                                      <MenuItem key={sportType.id} value={sportType.id}>
                                        {sportType.SportsName}
                                      </MenuItem>
                                    ))
                                  }
                                </Select>
                                <FormHelperText>Choose a Sports Type for your facility</FormHelperText>
                              </StyledRoleSelect>
                            )}
                          /> 
                        </Grid>
                        <Grid  xs={6}>      
                        <Controller 
                            name="floorType"
                            control = {control}
                            defaultValue=""
                            rules={validationRules.floorType}
                            render={ ({ field, fieldState }) => (          
                              <StyledRoleSelect fullWidth>
                                <InputLabel id="role-floorType-label">Floor Type</InputLabel>
                                <Select
                                  labelId="role-floorType-label"
                                  id="floorType-select"
                                  {...field}
                                  error={!!fieldState.error}
                                >
                                  {selectedFloorTypes.map((floorType, index) => (
                                    <MenuItem key={index} value={floorType.id}>
                                      {floorType.floorName}
                                    </MenuItem>
                                  ))}
                                </Select>
                                <FormHelperText>Choose a Floor Type for your facility</FormHelperText>
                              </StyledRoleSelect>
                            )}
                          /> 
                        </Grid>
                    </Grid>   
                    </>
                    )}
                    {activeStep === 1 && (
                     <>
                     {/* Second step */}
                      <Box mb={1} >
                        <Typography variant="h5" textAlign="left" sx={{ color: "green.main" }}>Pitch Amenities:</Typography>
                        <Grid container spacing={20}>
                          <FormControl component="fieldset">
                            <FormGroup row>
                              {amenitiesList.map((amenity) => (
                                <Grid item xs={2} key={amenity.name}>
                                  <Controller 
                                    name={amenity.name}
                                    control = {control}
                                    defaultValue={false}
                                    render={ ({ field }) => ( 
                                      <FormControlLabel 
                                        control={
                                          <Checkbox size="small"
                                            {...field} 
                                            checked={field.value}
                                            color="primary"
                                            icon={amenity.icon}
                                          /> 
                                        } 
                                        label={amenity.name}
                                      />
                                    )}
                                  />
                                </Grid> 
                              ))}
                            </FormGroup>
                          </FormControl>
                        </Grid>
                      </Box>
                      <Box mb={1} >
                        <Typography variant="h5" textAlign="left" sx={{ color: "green.main" }}>Pitch Location & Photos:</Typography>
                        <Grid container spacing={1}>      
                          <Grid item xs={6} >    
                            <GoogleMap
                              mapContainerStyle={containerStyle}
                              center={center}
                              zoom={10}
                              onClick={e => setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
                              
                            >
                              {location && <Marker position={location} />}
                            </GoogleMap> 
                          </Grid> 
                          <Grid item xs={6} >    
                            <Typography variant="h5" textAlign="left" sx={{ color: "green.main" }}>Pitch Longitude & Latitude</Typography>
                            <Controller 
                            name="town"
                            control = {control}
                            rules={validationRules.town}
                            render={ ({ field, fieldState }) => (          
                              <StyledRoleSelect fullWidth>
                                <InputLabel id="role-states-label">States</InputLabel>
                                <Select
                                  labelId="role-states-label"
                                  id="states-select"
                                  label="states"
                                  error={!!fieldState.error} 
                                  {...field} 
                                  defaultValue={pitch.state?.id} 
                                  
                                >
                                  {
                                    states && states.map((state) => (
                                      <MenuItem key={state.id} value={state.id}>
                                        {state.name}
                                      </MenuItem>
                                    ))
                                  }
                                </Select>
                                <FormHelperText>Choose a State</FormHelperText>
                              </StyledRoleSelect>
                            )}
                          /> 

                              <StyledTextField
                                label="Longitude"
                                value={location ? location.lng : ''}
                                variant="outlined"
                                fullWidth
                                disabled
                                required
                              />
                              <StyledTextField
                                  label="Latitude"
                                  value={location ? location.lat : ''}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                  required
                              />   

                              <Typography variant="h5" textAlign="left" sx={{ color: "green.main" }}>Pitch Photos</Typography>
                              <>
                                <input
                                  type="file"
                                  ref={inputRef}
                                  hidden
                                  multiple
                                  onChange={handleFileChange}
                                  required
                                />
                                <Button className="action-button" startIcon={<AddIcon />} variant="contained" onClick={handleUploadClick}>
                                  Upload Images
                                </Button>
                                {/* Display selected file names */}
                                <List >
                                    {files.map((file, index) => (
                                      <ListItem key={index}>
                                        <ListItemAvatar>
                                          <Avatar>
                                            <ImageIcon />
                                          </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                          primary={file.name}
                                        />
                                        <ListItemSecondaryAction>
                                          <IconButton edge="end" aria-label="delete" onClick={() => handleFileDelete(index)}>
                                            <DeleteIcon />
                                          </IconButton>
                                        </ListItemSecondaryAction>
                                      </ListItem>
                                    ))}
                                  </List>
                              </>                            
                          </Grid> 
                        </Grid>
                      </Box>
                    </>            
                    )}
                    {activeStep === 2 && (
                    <>                
                      <Box mb={1}>
                        <Typography variant="h5" textAlign="left" sx={{ color: "green.main" }}>Pitch Opening Times:</Typography>
                        <Grid container spacing={2}>
                          {openingTimes.map((time, index) => (
                            <Grid item xs={4} key={index}>
                              <Box sx={{ '& > :not(style)': { m: 1 }, width: '40ch' }}>
                              <Typography variant="h5" textAlign="left" sx={{ color: "grey.main" }}>{time.day}</Typography>
                                <TextField
                                  label="Open Time"
                                  type="time"
                                  value={time.openTime}
                                  onChange={handleInputChange(index, 'openTime')}
                                  disabled={time.isClosed}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                                <TextField
                                  label="Close Time"
                                  type="time"
                                  value={time.closeTime}
                                  onChange={handleInputChange(index, 'closeTime')}
                                  disabled={time.isClosed}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                                <TextField
                                  label="Interval"
                                  type="number"
                                  value={time.interval}
                                  onChange={handleInputChange(index, 'interval')}
                                  disabled={time.isClosed}
                                />
                                <TextField
                                  label="Price"
                                  type="number"
                                  value={time.price}
                                  onChange={handleInputChange(index, 'price')}
                                  disabled={time.isClosed}
                                />
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={time.isClosed}
                                      onChange={handleSwitchChange(index)}
                                      color="primary"
                                    />
                                  }
                                  label="Closed"
                                />
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                         
                      </Box>
                     
                    </>
                    )}          
                    {/* Navigation buttons */}
                      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                          color="inherit"
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          Back
                        </Button>
                                  
                        <Box sx={{ flex: '1 1 auto' }} />
                        
                         {/* Conditional rendering: Display "Next" or "Finish" based on the active step */}
                          {activeStep === steps.length - 1 ? (
                            <Button
                              disableElevation={true}
                              className="action-button"
                              type="submit"
                              variant="contained"
                              disabled={isPending}
                              onClick={handleSubmit(onSubmit)}
                            >
                              {isPending ? (
                                <CircularProgress color="white" size={24} />
                              ) : (
                                "Finish"
                              )}
                            </Button>
                          ) : (
                            <Button
                              onClick={handleNext}
                              disabled={isSubmitting || (touched && !isValid)}
                            >
                              Next
                            </Button>
                          )}
                      </Box>
                </React.Fragment>
            )}
      </Box>
      )}
    </StyledModal>
    <Footer />
  </>
  );
};

export default Updatepitch;
