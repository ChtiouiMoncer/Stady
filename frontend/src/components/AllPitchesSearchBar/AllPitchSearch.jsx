import { useMediaQuery } from '@mui/material';
import React from 'react';
import DesktopAllPitchSearch from './DesktopAllPitchSearch';
import MobileAllPitchSearch from './MobileAllPitchSearch';


  const AllPitchSearch = () => {
    const isDesktop = useMediaQuery('(min-width:768px)'); //useMediaQuery returns a boolean value based on the screen size. If the screen width is at least 768 pixels
    return isDesktop ? 
    <DesktopAllPitchSearch /> : <MobileAllPitchSearch />;
  };
  
  export default AllPitchSearch;

