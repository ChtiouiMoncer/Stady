import styled from '@emotion/styled';
import { Box, Typography} from '@mui/material';
import React from 'react';
import herobg from '../../assets/herobg.png'
import mobileHerobg2 from '../../assets/mobileHerobg2.png'
import PitchSearch from '../pitchSearchBar/PitchSearch';
import { useTranslation } from 'react-i18next';




const StyledHero = styled(Box) (({ theme }) => ({
    backgroundImage: `url(${herobg})`,
    height: '90vh',
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      backgroundImage: `url(${mobileHerobg2})`, // replace with the mobile version of the image
      height: '93vh',

    },
  }));

const ContentWrapper = styled(Box) (({ theme }) => ({
    marginTop: '-200px', // add negative margin to move the content up
    textAlign: 'center', // center the typography
    display: 'flex',
    flexDirection:"column",
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: '-350px', // add negative margin to move the content up
      '& > h1': { //targets direct child h1 elements of the ContentWrapper
        fontSize: '30px', // set font size for mobile screens

      },
    },
    
  }));  


const Hero = () => {
  const { t } = useTranslation();

    return ( 
        <StyledHero>
          <ContentWrapper>
            <Typography variant='h1' margin={4} >{t('book')}</Typography>
            <PitchSearch  />
          </ContentWrapper>
        </StyledHero>


     );
}
 
export default Hero ;