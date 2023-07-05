import React, { useEffect, useState } from 'react';
import { makeStyles, styled } from '@mui/styles';
import { Box, Button, CircularProgress, MenuItem, TextField, Toolbar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { Controller, useForm } from 'react-hook-form';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const MobileAllPitchSearch = () => {
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


// This line calls the `useForm` hook, which returns an object with several properties and methods that we can use to manage our form state and behavior.
const { handleSubmit, reset, control, getValues, formState: { errors, isDirty, isSubmitting, touchedFields, submitCount, touched, isValid, register, setValue }, watch, validate, setError } = useForm();

//validation rules for form inputs.
const validationRules = {
  name: {
    required: 'Please write a Name',
  },
  sportsType: {
    required: 'Please choose a Sports Type',  
  }, 
  state: {
    required: 'Please choose a State',  
  }
};

const { t } = useTranslation();

//Pitch data state
const [pitches, setPitches] = useState([]);
const [ isPending, setIsPending ] = useState(false); //manage pending time from the server response
const [success, setSuccess] = useState(false);

const navigate = useNavigate();

const onSubmit =  async (data, e) => {
  //FORM DATA
  const pitchNameValue = watch('name');
  const sportsTypevalue = watch('sportsType');
  const stateValue = watch('state');

  // Construct the URL
  const PITCHES_URL = `/api/grounds?page=1&name=${pitchNameValue}&sportsType.SportsName=${sportsTypevalue}&isApproved=true&state.name=${stateValue}`;


  e.preventDefault();
  setIsPending(true);
  try {
      const response = await axios.get(PITCHES_URL, {
              headers: {'accept': 'application/json'}      
          }
      );
      
      setPitches(response.data);
      setIsPending(false);
      setSuccess(true);

    // Redirect to another route and pass the fetched data as state
    navigate('/pitches', { state: { pitches: response.data } });

  } catch (err) {
    setSuccess(false);
     console.log(err)            
  }
 
};

  return (
    <>
       <>
      <Paper //paper is typically used as a background for other content
      component="form"
      sx={{ display: 'flex', flexDirection: 'column', width: 350, border: '2px solid #007B65', borderRadius: 2// add this line
      }}
      >
          <Controller
          name="name" 
          control={control} 
          defaultValue="" 
          rules={validationRules.name} 
          render={({ field, fieldState }) => (
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <InputBase  
                      {...field}
                      placeholder={t('searchbar')}
                      inputProps={{ 'aria-label': 'Search for a facility' }}
                      sx={{ ml: 1, flex: 1 }}
                  />
                  <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                      <NearMeOutlinedIcon />
                  </IconButton>
              </Box>
          )}
      />
       
        <Divider sx={{ height: 2, m: 1 }} orientation="horizontal" />

        <Controller 
          name="sportsType"
          control = {control}
          rules={validationRules.sportsType}
          render={({ field, fieldState }) => (
              <TextField
                  variant="filled"
                  sx={{ 
                    width: '100%',
                    backgroundColor: 'transparent',
                    '& .MuiFilledInput-root': {
                        backgroundColor: 'transparent',
                    }
                }}
                  select
                  label="Sports Type"
                  {...field}
                  error={!!fieldState.error}
                  SelectProps={{
                    IconComponent: SportsSoccerIcon,
                  }}
              >
                  {
                      sportsTypes && sportsTypes.map((sportType) => (
                          <MenuItem key={sportType.id} value={sportType.SportsName}>
                              {sportType.SportsName}
                          </MenuItem>
                      ))
                  }
              </TextField>
          )}
      />   


        <Controller 
          name="state"
          control = {control}
          rules={validationRules.sportsType}
          render={({ field, fieldState }) => (
              <TextField
                  variant="filled"
                  sx={{ 
                    width: '100%',
                    backgroundColor: 'transparent',
                    '& .MuiFilledInput-root': {
                        backgroundColor: 'transparent',
                    }
                }}
                  select
                  label={t('searchstate')}
                  {...field}
                  error={!!fieldState.error}
                  SelectProps={{
                    IconComponent: LocationCityIcon,
                  }}
              >
                  {
                    states && states.map((state) => (
                      <MenuItem key={state.id} value={state.name}>
                        {state.name}
                      </MenuItem>
                    ))
                  }
              </TextField>
          )}
      />      

      <Button
            className='search-button'
            variant="contained"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            endIcon={<SearchIcon />} 
              sx={{
              bgcolor: "green.main",
              color: "white.main",
              "&:hover": {backgroundColor: 'green.light'}
              }}
            >
              {isPending ? (
                <CircularProgress color="white" size={24} />
              ) : (
                t('searchbutton')
              )}
            </Button>      
      </Paper>
    </>

    </>

  );
};

export default MobileAllPitchSearch;

