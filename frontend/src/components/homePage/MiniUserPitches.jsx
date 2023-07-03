import PitchSearch from "../pitchSearchBar/PitchSearch";
import loginbg from '../../assets/herobg2.png'
import useAuth from "../../Hooks/useAuth";
import React, { useEffect, useState } from "react";
import axios, { axiosPrivate } from "../../api/axios";
import AllPitchSearch from "../AllPitchesSearchBar/AllPitchSearch";
import { Box, Button, Chip, CircularProgress, Divider, Grid, Link, Rating, Stack, Tooltip, Typography, styled } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Navbar from "../Navbar";
import useMediaQuery from '@mui/material/useMediaQuery';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // import the styles
import { Carousel } from "react-responsive-carousel";
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShowerIcon from '@mui/icons-material/Shower';
import { Checkroom, SpaceDashboard } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import EastIcon from '@mui/icons-material/East';

const StyledModal = styled(Box) (({ theme }) => ({

    backgroundImage: `url(${loginbg})`,
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',
 
  }));

  const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: '8px',
    marginBottom: '8px',
    padding:'10px',
    color: theme.palette.white.main,
    backgroundColor: theme.palette.green.main,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.green.light,
    },
    '&.MuiButton-focusVisible': {
      boxShadow: 'none !important',
    },
  }));  
  
const MiniUserPitches = () => {

    const navigate = useNavigate();

    const theme = useTheme(); //using the the Material-UI theme object, which is provided by the useTheme hook from Material-UI.
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // checking if device is mobile

    const [pitches, setPitches] = useState([]);
    const [isPendingPitches, setIsPendingPitches] = useState(false);

    const handleFetchPitches = async () => {
    try {
        setIsPendingPitches(true);  
        const response = await axios.get(`/api/grounds?page=1&isApproved=true`);
        setPitches(response.data['hydra:member']);  
        setIsPendingPitches(false);  
    } catch (error) {
        // Handle error (e.g., show an error message)
    }
};

//Load FeedBacks Data  
useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    setTimeout(() => {
        handleFetchPitches();
    }, 1000);
    return () => {
        isMounted = false; 
        controller.abort();
    }
}, [])
    return ( 

            <>
            {!isPendingPitches ? (
            <StyledModal>
              <Box sx={{ marginTop: '20px', textAlign: 'left' }}>
                <Typography variant="h6" sx={{marginTop:'10px', marginBottom: '1px', color: 'white.main' }}>Explore unique Pitches!</Typography>
            </Box>
                <Box 
                sx={{ 
                    color: "text.primary",
                    padding: 3,
                    borderRadius: 2,
                    marginBottom: '2px',
                    width: isMobile ? '80vw' : '80vw', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
                    height: isMobile ? 'auto' : 'auto', 
                    overflow: 'auto',

                }}
                >   
                    
                       {/* Add the UI here */}
                       <Grid container spacing={2}>
                            {pitches.slice(0, 3).map((pitch, index) => {
                                let sum = 0;
                                pitch.reviews.forEach(review => {
                                    sum += review.reviewStar;
                                });

                                let averageRating = sum / pitch.reviews.length;

                                return (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                backgroundColor: '#FFFFFF',
                                                boxShadow: '0px 2px 4px rgba(28, 5, 77, 0.1), 0px 12px 32px rgba(0, 0, 0, 0.05)',
                                                borderRadius: '12px',
                                                flexGrow: 1,
                                                mb: 2,
                                                width: isMobile ? 'auto' : 'auto',
                                                height: isMobile ? 'auto' : 'auto',
                                                margin: '5px',
                                                cursor: 'pointer',
                                                maxHeight: '600px', // Add max height property

                                            }}
                                            onClick={() => navigate(`/timeslots/${pitch.name}`, { state: { pitchId: pitch.id } })}
                                        >
                                    <Carousel autoPlay infiniteLoop useKeyboardArrows >
                                    {pitch.images.map((image, idx) => (
                                        <div key={idx} style={{ height: "300px" }}>
                                            <img src={`http://127.0.0.1:8000${image.contentUrl}`} alt={pitch.name} />
                                        </div>
                                    ))}
                                     </Carousel>

                                <Divider sx={{ marginTop:"5px", marginBottom:"5px" }} />

                                <CardContent>

                                    <Box sx={{  padding: '0px 10px', display: 'flex', flexDirection: 'row',   justifyContent: 'space-between' , marginBottom: '5px'}}> 
                                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '5px'}}>
                                            <Typography variant="subtitle1" color="text.secondary">
                                            {pitch.name.toUpperCase()}, 
                                            </Typography>
                                            <Typography variant="subtitle1" color="green.main" >
                                                {pitch.state.name} 
                                            </Typography>
                                        </Box>
                                        <Typography variant="subtitle1" color="text.secondary" textAlign="end">
                                            {pitch.openingTimes && Math.min(...pitch.openingTimes.map(time => time.price))} DT
                                        </Typography>
                                    </Box>
                                 

                                </CardContent>
                            
                                <Divider sx={{ marginTop:"5px", marginBottom:"5px" }} />

                                <Box sx={{  padding: '0px 10px', display: 'flex', flexDirection: 'row',   justifyContent: 'space-between' , marginBottom: '5px'}}> 
                                    <Typography variant="subtitle1" color="text.secondary">Rating </Typography>
                                    <Rating sx={{color: 'green.main'}} name="read-only" value={averageRating} precision={0.5} readOnly />
                                </Box>

                                <Divider sx={{ marginTop:"5px", marginBottom:"5px" }} />

                                
                                <Box sx={{  padding: '0px 10px', display: 'flex', flexDirection: 'row',   justifyContent: 'space-between' , marginBottom: '30px'}}> 
                                        <Typography variant="subtitle1" color="text.secondary">Amenties </Typography>     
                                        <Typography variant="h5" textAlign="left" sx={{ color: "grey.dark", fontWeight: 500  }}>
                                        { (pitch.amenties.hasShower && pitch.amenties.hasSecureStorage && pitch.amenties.hasChangingRoom && pitch.amenties.hasRestaurent && pitch.amenties.hasParking)  ? (
                                            <>
                                            <Tooltip title="Shower">
                                                {pitch.amenties.hasShower ? <ShowerIcon sx={{marginBottom:'-5px'}} style={{ color: 'grey.main' }} /> : ( <></> )}
                                            </Tooltip>
                                            <Tooltip title="Secure Storage">
                                                {pitch.amenties.hasSecureStorage ? <SpaceDashboard sx={{marginBottom:'-5px'}} style={{ color: 'grey.main' }} /> : ( <></> )}
                                            </Tooltip>
                                            <Tooltip title="Changing Room">
                                                {pitch.amenties.hasChangingRoom ? <Checkroom sx={{marginBottom:'-5px'}} style={{ color: 'grey.main' }} /> : ( <></> )}
                                            </Tooltip>
                                            <Tooltip title="Restaurent">
                                                {pitch.amenties.hasRestaurent ? <RestaurantIcon sx={{marginBottom:'-5px'}} style={{ color: 'grey.main' }} /> : ( <></> )}
                                            </Tooltip>
                                            <Tooltip title="Parking">
                                                {pitch.amenties.hasParking ? <LocalParkingIcon sx={{marginBottom:'-5px'}} style={{ color: 'grey.main' }} /> : ( <></> )}
                                            </Tooltip>
                                            </>
                                        ) : (
                                        <>
                                            No Amenities
                                        </>
                                        )}
                                        </Typography>
                                </Box>
                            </Card>
                        </Grid>
                        )
                    })}
                </Grid>
                <Box
                    sx={{
                        display:'flex',
                        alignItems: 'center',
                        justifyContent:'right',
                        marginBottom: '10px',
                        marginTop:'10px'
                    }}
                    >
                        <StyledButton
                        component={RouterLink}
                        to="/pitches/search"
                        endIcon={<EastIcon />}
                        sx={{bgcolor:'white.main', color:'green.main'}}
                        >                     
                        Sell All
            
                        </StyledButton>
                    </Box>
            </Box>
            </StyledModal>
            ) : (
                <Box
                sx={{
                height: '90vh',
                display: 'flex',
                flexDirection:"column",
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: grey[250], // Use the green color value here
                }}
                >

                    <CircularProgress sx={{color:"green.main"}} />

                </Box>
            )}
        </>     );
}
 
export default MiniUserPitches ;