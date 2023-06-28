import {Box, Button, Card, CardContent, CircularProgress, Divider, Grid, Link, Paper, Rating, TextField, Tooltip, Typography, styled } from '@mui/material';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DataGrid } from '@mui/x-data-grid';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // import the styles
import { Carousel } from "react-responsive-carousel";
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShowerIcon from '@mui/icons-material/Shower';
import { Checkroom, Google, SpaceDashboard } from "@mui/icons-material";
import ReservationBasket from './ReservationBasket';
import { useCallback } from 'react';





const StyledModal = styled(Box) (({ theme }) => ({

    //backgroundColor: theme.palette.green.main,
    height: '90vh',
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',    
  }));

const StyledBox = styled(Box) (({ theme }) => ({

    bgcolor: "background.default",
    display: 'flex',
    flexDirection:"column",
    justifyContent:'center',
    padding: '10px',
}));  

const TimeslotSelection = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
    const location = useLocation();
    const { pitchName } = useParams();
    const { pitchId } = location.state;
    const [pitch, setPitch] = useState();
    const [timeslots, setTimeslots] = useState([]);
    const [ pendingTimeSlots, setPendingTimeSlots ] = useState(false);
    const [averageRating, setAverageRating] = useState(0);


    const [selectedDate, setSelectedDate] =  React.useState(dayjs());    

    

    useEffect(() => {

        const getTimeSlots = async () => {
            setPendingTimeSlots(true);
            const formattedDate = selectedDate.format('YYYY-MM-DD');

            try {
                const response = await axios.get(`/api/time_slots?date=${formattedDate}&isOutdated=false&pitch.name=${pitchName}&isAvailable=true`, {
                    headers: {'accept': 'application/json'}
                });
                // handle the fetched data
                console.log(response.data);
                setTimeslots(
                    response.data.map(timeslot => ({
                        id: timeslot.id,
                        start_time: timeslot.startTime,
                        end_time: timeslot.endTime,
                        price: timeslot.price,
                    }))
                );
                setPendingTimeSlots(false);
            } catch (err) {
                console.log(err);
            }
        }

        
        const getPitchData = async () => {
            try {
                const response = await axios.get(`/api/grounds/${pitchId}`, {
                    headers: {'accept': 'application/json'}
                });

                // handle the fetched data
                setPitch(response.data);
                let sum = 0;
                response.data.reviews.forEach(review => {
                sum += review.reviewStar;
                });

                let averageRating = sum / response.data.reviews.length;
                setAverageRating(averageRating);

            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log('Request canceled', err.message);
                } else {
                    console.log(err);
                }
            }
        }

        getTimeSlots();
        getPitchData();


      }, [selectedDate, pitchName]);

    

      const columns = [
        { field: 'id', headerName: 'Code', width: isMobile ? 85: 100, disableColumnMenu: true },
        { field: 'start_time', headerName: isMobile ? 'Start' : 'Start Time' ,  width: isMobile ? 90: 150, disableColumnMenu: true },
        { field: 'end_time', headerName: isMobile ? 'End' : 'End Time',  width: isMobile ? 90: 150, disableColumnMenu: true },
        { field: 'price', headerName: 'Price',  width: isMobile ? 90: 150, disableColumnMenu: true },
    ];
    console.log(pitch);
    return ( 
    <div>
        <Navbar />
        <Box sx={{ bgcolor: 'green.main', padding: '5px'}}>
            <Typography variant="h6" sx={{ color: 'white.main', fontWeight: 600, margin: '10px' }}>Reservation Process</Typography>
        </Box>
        <StyledBox>     
            <Box>
            <Grid container spacing={2}>

                    <Grid item xs={12} sm={12} md={5}>   
                    <Typography variant="subtitle1" sx={{ color: 'green.main', fontWeight: 600, margin: '10px', textAlign:'center' }}>Select a Timeslot</Typography>                   
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker 
                                sx={{ width: isMobile ? 'auto': '100%', margin:'10px'}}
                                label="Pick a date"
                                value={selectedDate}
                                minDate={dayjs()} 
                                maxDate={dayjs().add(1, 'month')} 
                                onChange={(newValue) => setSelectedDate(newValue)}
                                renderInput={(params) => <TextField {...params}  />}
                                />
                            </DemoContainer>
                        </LocalizationProvider>

                        <Box sx={{ display: "flex",  justifyContent: "space-between", margin:'10px'}}>
                            <Typography variant="subtitle1" textAlign="left" sx={{ color: "green.main" }}>
                                Available TimeSlots:
                            </Typography>
                        
                        </Box>

                        <div style={{ height: 500, width: '100%' }}>

                        {!pendingTimeSlots ? (
                                    <DataGrid
                                        sx={{ bgcolor: 'white.main', margin:'10px'}}
                                        rows={timeslots}
                                        columns={columns}
                                        initialState={{
                                            pagination: {
                                            paginationModel: { page: 0, pageSize: 10 },
                                            },
                                        }}
                                        pageSizeOptions={[5, 10]}
                                        checkboxSelection
                                      
                                    />
                                    ) : (
                                    
                                        <CircularProgress sx={{ color:"green.main" }} />
                            )}
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} sx={{textAlign:'center'}}>                      
                        <Typography variant="subtitle1" sx={{ color: 'green.main', fontWeight: 600, margin: '10px' }}>Pitch Informations</Typography>
                            {pitch && (
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
                                        height: isMobile ? '95%' : 'auto',
                                        margin: '2px',
                                    }}
                                >
                                    <Carousel autoPlay infiniteLoop useKeyboardArrows dynamicHeight>
                                        {pitch.images.map((image, idx) => (
                                            <div key={idx}>
                                                <img src={`http://127.0.0.1:8000${image.contentUrl}`} alt={pitch.name} />
                                            </div>
                                        ))}
                                    </Carousel>

                                    <Divider sx={{ marginTop:"2px", marginBottom:"2px" }} />

                                    <CardContent>

                                        <Box sx={{  padding: '0px 10px', display: 'flex', flexDirection: 'row',   justifyContent: 'space-between' , marginBottom: '2px'}}> 
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

                                    <Box sx={{  padding: '0px 10px', display: 'flex', flexDirection: 'row',   justifyContent: 'space-between' , marginBottom: '2px'}}> 
                                        <Typography variant="subtitle1" color="text.secondary">Contact </Typography>
                                        <Link href={`tel:${pitch.phoneNumber}`} underline="none" color="inherit">
                                            <Typography variant="subtitle1" color="text.secondary">{pitch.phoneNumber}</Typography>
                                        </Link>
                                    </Box>
            
                                    <Divider sx={{ marginTop:"5px", marginBottom:"5px" }} />

                                    <Box sx={{  padding: '0px 10px', display: 'flex', flexDirection: 'row',   justifyContent: 'space-between' , marginBottom: '2px'}}> 
                                        <Typography variant="subtitle1" color="text.secondary">Rating </Typography>
                                        <Rating sx={{color: 'green.main'}} name="read-only" value={averageRating} precision={0.5} readOnly />
                                    </Box>

                                    <Divider sx={{ marginTop:"5px", marginBottom:"5px" }} />

                                    <Box sx={{  padding: '0px 10px', display: 'flex', flexDirection: 'row',   justifyContent: 'space-between' , marginBottom: '5px'}}> 
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

                                    <Divider sx={{ marginTop:"5px", marginBottom:"5px" }} />

                                    <Box sx={{  padding: '0px 10px', display: 'flex', flexDirection: 'row',   justifyContent: 'space-between' , marginBottom: '5px'}}> 
                                        <Typography variant="subtitle1" color="text.secondary">Location </Typography>
                                        {pitch?.address && (
                                         <Button 
                                         variant="outlined" 
                                         startIcon={<Google />}
                                         href={`https://www.google.com/maps/?q=${pitch.address.latitude},${pitch.address.longitude}`}
                                         target="_blank" 
                                         rel="noopener noreferrer"
                                       >
                                         View on Maps
                                       </Button>
                                        )}
                                    </Box>
                                </Card>
                            )}             
                    </Grid>

                    <Grid item xs={12} sm={12} md={4} sx={{textAlign:'center'}}>                      
                        <Typography variant="subtitle1" sx={{ color: 'green.main', fontWeight: 600, margin: '10px' }}>Reservation Informations</Typography>

                    </Grid>
                </Grid>
            </Box>
        </StyledBox>
    </div>

    );
}
 
export default TimeslotSelection;
