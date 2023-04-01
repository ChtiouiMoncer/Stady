import { useMediaQuery } from '@mui/material';
import React from 'react';
import DesktopPitchSearch from './DesktopPitchSearch';
import MobilePitchSearch from './MobilePitchSearch';


  const PitchSearch = () => {
    const isDesktop = useMediaQuery('(min-width:768px)'); //useMediaQuery returns a boolean value based on the screen size. If the screen width is at least 768 pixels
    return isDesktop ? <DesktopPitchSearch /> : <MobilePitchSearch />;
  };
  
  export default PitchSearch;

