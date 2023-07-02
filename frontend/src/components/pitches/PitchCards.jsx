import { Box, Chip, Divider, Grid, Link, Rating, Stack, Tooltip, Typography, styled } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Navbar from "../Navbar";
import useMediaQuery from '@mui/material/useMediaQuery';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // import the styles
import { Carousel } from "react-responsive-carousel";
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import loginbg from '../../assets/herobg.png'
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShowerIcon from '@mui/icons-material/Shower';
import { Checkroom, SpaceDashboard } from "@mui/icons-material";

const StyledBox = styled(Box) (({ theme }) => ({

    bgcolor: "background.default",
    display: 'flex',
    flexDirection:"column",
    justifyContent:'center',
    padding: '10px',
}));

const StyledModal = styled(Box) (({ theme }) => ({

    //backgroundColor: theme.palette.green.main,
    //backgroundImage: `url(${loginbg})`,
    height: '90vh',
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',    
  }));

const PitchCards = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Returns true if screen size is small or smaller

    const location = useLocation();
    const pitches = location.state.pitches;
    const navigate = useNavigate();
    const goBack = () => navigate(-1);


   // If there are no pitches to display, show a message
if (pitches.length === 0) {
    // After 3 seconds, redirect user to the home page
    setTimeout(() => {
        navigate("/");
    }, 3000);

    return (
        <div>
            <Navbar />
            <StyledModal>
                <Box sx={{ display: "flex" , flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h5" sx={{ color: isMobile ? 'white.main' : 'green.main' , fontWeight: 600, margin: '10px' }}>No results found for your search. Redirecting you to the home page...</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent:'center', gap: '5px', marginTop: '5px'}}>
                    <Button onClick={goBack}  component={RouterLink} to="/"  variant="contained" className="my-button"    >
                        <Typography variant="subtitle2"  >
                                    {"Go Back"}                        
                        </Typography>
                    </Button>  
                </Box>  
                
            </Box>
            </StyledModal>
        </div>
    )
}
   
    return (  
    <>
    <div>
    <Navbar />
    <StyledBox>
        <Typography variant="subtitle1" sx={{ color: 'green.main', fontWeight: 600, margin: '10px' }}>Find your next adventure</Typography>

        <Grid container spacing={2}>
            {pitches.map((pitch, index) => {
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
                                    width: isMobile ? '98%' : '88%',
                                    height: isMobile ? '95%' : '95%',
                                    margin: '5px',
                                    cursor: 'pointer', 
                                }}
                                onClick={() => navigate(`/timeslots/${pitch.name}`, { state: { pitchId: pitch.id } })}

                            >
                                <Carousel autoPlay infiniteLoop useKeyboardArrows dynamicHeight>
                                    {pitch.images.map((image, idx) => (
                                        <div key={idx}>
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
    </StyledBox>
</div>

    </>
    );
}
 
export default PitchCards;

