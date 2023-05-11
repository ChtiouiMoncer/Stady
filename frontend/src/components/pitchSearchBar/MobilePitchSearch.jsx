import React from 'react';
import { makeStyles, styled } from '@mui/styles';
import { Box, Button, Toolbar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import './pitchSearchBar.css';


const StyledBox = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 10px'
})


const MobilePitchSearch = () => {

  return (
    <>
       <>
      <Paper //paper is typically used as a background for other content
      component="form"
      sx={{ display: 'flex', flexDirection: 'column', width: 350, border: '2px solid #007B65', borderRadius: 2// add this line
      }}
      >
        <StyledBox> 
            <InputBase  
            placeholder="Search for a facility"
            //defaultValue="react-bootstrap"
            inputProps={{ 'aria-label': 'search google maps' }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <   NearMeOutlinedIcon />
            </IconButton>
        </StyledBox>

        <Divider sx={{ height: 2, m: 1 }} orientation="horizontal" />

        <StyledBox>
            <InputBase
            placeholder="Sun, 19/03/2023"
            inputProps={{ 'aria-label': 'search google maps' }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <CalendarMonthIcon />
            </IconButton>
        </StyledBox>

        <Divider sx={{ height: 2, m: 1 }} orientation="horizontal" />

        <StyledBox>
            <InputBase
            sx={{ ml: 1, flex: 4 }}
            placeholder="State"
            inputProps={{ 'aria-label': 'search google maps' }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <LocationCityIcon />
            </IconButton>
        </StyledBox>

        <Button className='search-button' variant="contained" endIcon={<SearchIcon />} sx={{ bgcolor: "green.main", color: "white.main", "&:hover": {backgroundColor: 'green.light'} }}>Search</Button>
      </Paper>
    </>

    </>

  );
};

export default MobilePitchSearch;

