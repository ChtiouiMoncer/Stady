import {Alert, Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Link, Modal, Paper, Rating, Snackbar, TextField, Tooltip, Typography, styled } from '@mui/material';
import { useLocation, useParams, useNavigate, redirect } from 'react-router-dom';
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
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // import the styles
import { Carousel } from "react-responsive-carousel";
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShowerIcon from '@mui/icons-material/Shower';
import { Checkroom, Google, SpaceDashboard } from "@mui/icons-material";
import CancelIcon from '@mui/icons-material/Cancel';
import StadiumIcon from '@mui/icons-material/Stadium';
import useAuth from '../../Hooks/useAuth';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import CloseIcon from '@mui/icons-material/Close';
import emailjs from 'emailjs-com';
import QRCode from 'qrcode';
import DownloadIcon from '@mui/icons-material/Download';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ViewListIcon from '@mui/icons-material/ViewList';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Footer from '../homePage/Footer';
import AppFooter from '../homePage/AppFooter';
import { useTranslation } from 'react-i18next';
import ReviewCard from '../pitches/ReviewCard';
import DeleteIcon from '@mui/icons-material/Delete';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DiscountIcon from '@mui/icons-material/Discount';

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: '8px',
    marginBottom: '8px',
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
    //backgroundImage: `url(${loginbg})`,
    bgcolor: "background.default",
    display: 'flex',
    flexDirection:"column",
    justifyContent:'center',
    padding: '4px',
}));  

const StyledModalQr = styled(Modal) (({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    ".action-button": {
        marginTop: "20px",
        marginBottom: "8px",
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

const TimeslotsManagement = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
    const location = useLocation();
    const { pitchName } = useParams();
    const { state } = location;
    const pitchId = state && state.pitchId ? state.pitchId : null;    const [pitch, setPitch] = useState();
    const [timeslots, setTimeslots] = useState([]);
    const [ pendingTimeSlots, setPendingTimeSlots ] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const startingDate = dayjs('2023-01-01'); // Create a dayjs object for the starting date
    const [newPrice, setNewPrice] = useState('');


    //DATE & TIMESLOTS 
    const [selectedDate, setSelectedDate] =  React.useState(dayjs());    

    // Add the following state variables
    const [selectedTimeslots, setSelectedTimeslots] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [fees, setFees] = useState(2); // Assume fees is 2DT

      //for the ERRORS AND SUCCESS
      const [succMsg, setSucssMsg] = useState('');
    
    // Function to handle changes in timeslot selection
    const handleTimeslotSelection = (selectedTimeslotIds) => {
    const newSelectedTimeslots = timeslots.filter(timeslot =>
      selectedTimeslotIds.includes(timeslot.id)
    );
    setSelectedTimeslots(newSelectedTimeslots);
    const newTotalPrice = newSelectedTimeslots.reduce(
      (total, timeslot) => total + timeslot.price,
      0
    );
    setTotalPrice(newTotalPrice);
    };


    // Function to handle timeslot removals from the reservation card
    const handleTimeslotRemoval = (timeslotToRemove) => {
        const newSelectedTimeslots = selectedTimeslots.filter(timeslot =>
        timeslot.id !== timeslotToRemove.id
        );
        setSelectedTimeslots(newSelectedTimeslots);
        const newTotalPrice = newSelectedTimeslots.reduce(
        (total, timeslot) => total + timeslot.price,
        0
        );
        setTotalPrice(newTotalPrice);
    };

    const apiRef = useGridApiRef();

    const getTimeSlots = async () => {
        setPendingTimeSlots(true);
        const formattedDate = selectedDate.format('YYYY-MM-DD');

        try {
            const response = await axios.get(`/api/time_slots?date=${formattedDate}&pitch.name=${pitchName}`, {
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
                    isAvailable: timeslot.isAvailable ? "Available" : "Unavailable",
                    isOutdated: timeslot.isOutdated ? "Outdated" : "Active",

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
            console.log(err);

        }
    }

    useEffect(() => {

        getTimeSlots();
        getPitchData();


      }, [selectedDate, pitchName]);
      
      useEffect(() => {
        // Load reservation state and pitch info from localStorage
        const reservationState = JSON.parse(localStorage.getItem('reservationState'));
        const pitchInfo = JSON.parse(localStorage.getItem('pitchInfo'));
        const totalPrice = JSON.parse(localStorage.getItem('totalPrice'));
        const selectedDateString = localStorage.getItem('date');
        const timeSlots = localStorage.getItem('timeslots');


        if (reservationState) {
            setSelectedTimeslots(reservationState);
        }
        if (pitchInfo) {
            setPitch(pitchInfo);
        }
        if (totalPrice) {
            setTotalPrice(totalPrice);
        }
        /*if (selectedDateString) {
            setSelectedDate(dayjs(selectedDateString));
        }
        if (timeSlots) {
            setTimeslots(timeSlots);
        }*/
    }, []);


    const handleDelete = async (id) => {
        setLoadingRow(id);
        const DELETE_TIMESLOT_URL = `/api/time_slots/${id}`;

        try {
            const response = await axiosPrivate.delete(DELETE_TIMESLOT_URL,
            {
                headers: {'Content-Type' : 'application/json'},
            }
            );
            setSnackbarOpen(true);   
            setErrMsg('');
            setSucssMsg('TimeSlot Deleted Successfully!')
            setSuccess(true);
        } catch (err) {
            setSnackbarOpen(true); 
            setIsPending(false);
            setSuccess(false);     
             
            setErrMsg("An error occurred while deleting the timeslot.");
        
        }
        // Refresh data after accepting
        getTimeSlots();
        getPitchData();
        setLoadingRow(null);
    };


    const handleAvailibility = async (id) => {
        setLoadingRow(id);
        const PATCH_TIMESLOT_URL = `/api/time_slots/${id}`;
      
        try {
          const response = await axiosPrivate.patch(PATCH_TIMESLOT_URL,
            JSON.stringify({
                isAvailable: false,
            }),
            {
              headers: {'Content-Type' : 'application/merge-patch+json'},
            }
          );
          setSnackbarOpen(true);   
          setErrMsg('');
          setSucssMsg('TimeSlots Availability Status Changed Successfully!')
          setSuccess(true);
        } catch (err) {
          setSuccess(false);
          setIsPending(false);
          setErrMsg('They was a problem while updating the timeSlot, Try Again!')
        }
        // Refresh data after rejecting
        getTimeSlots();
        getPitchData();
        setLoadingRow(null);
    };
    

    const handlePriceincrease = async (id, price) => {
        setLoadingRow(id);
        const PATCH_TIMESLOT_URL = `/api/time_slots/${id}`;
        const newPrice = price + (price * 0.1);

        try {
          const response = await axiosPrivate.patch(PATCH_TIMESLOT_URL,
            JSON.stringify({
                price: newPrice,
            }),
            {
              headers: {'Content-Type' : 'application/merge-patch+json'},
            }
          );
          setSnackbarOpen(true);   
          setErrMsg('');
          setSucssMsg('TimeSlots Price Changed Successfully!')
          setSuccess(true);
        } catch (err) {
          setSuccess(false);
          setIsPending(false);
          setErrMsg('Error, try again!')
        }
        // Refresh data after rejecting
        getTimeSlots();
        getPitchData();
        setLoadingRow(null);
    };

    const handlePricedecrease = async (id, price) => {
        setLoadingRow(id);
        const PATCH_TIMESLOT_URL = `/api/time_slots/${id}`;
        const newPrice = price - (price * 0.1);

        try {
          const response = await axiosPrivate.patch(PATCH_TIMESLOT_URL,
            JSON.stringify({
                price: newPrice ,
            }),
            {
              headers: {'Content-Type' : 'application/merge-patch+json'},
            }
          );
          setSnackbarOpen(true);   
          setErrMsg('');
          setSucssMsg('TimeSlots Price Discounted Successfully!')
          setSuccess(true);
        } catch (err) {
          setSuccess(false);
          setIsPending(false);
          setErrMsg('Error, try again!')
        }
        // Refresh data after rejecting
        getTimeSlots();
        getPitchData();
        setLoadingRow(null);
    };

    const [loadingRow, setLoadingRow] = useState(null);

      const columns = [
        { field: 'id', headerName: t('Reservation.code'), width: isMobile ? 85: 100 },
        { field: 'start_time', headerName: isMobile ? t('Reservation.start') : t('Reservation.startTime') ,  width: isMobile ? 95: 110, disableColumnMenu: true,
        valueFormatter: (params) => formatTime(params.value),
        },
        
        { field: 'end_time', headerName: isMobile ? t('Reservation.end') : t('Reservation.endTime'),  width: isMobile ? 85: 110, disableColumnMenu: true ,
        valueFormatter: (params) => formatTime(params.value),
        },

        { field: 'price', headerName: t('Reservation.price'),  width: isMobile ? 85: 110 ,
        },

        { field: 'isAvailable', headerName: 'Availability',  width: isMobile ? 85: 150, 
        },
        { field: 'isOutdated', headerName: 'Status ',  width: isMobile ? 85: 150,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 160,
            renderCell: (params) => (
              <>
                <Tooltip title="Delete">
                    <IconButton color="primary" onClick={() => handleDelete(params.row.id)} disabled={params.row.isAvailable === "Unavailable"} sx={{ color: 'grey.dark'}} >
                    {loadingRow === params.row.id ? <CircularProgress size={24} /> : <DeleteIcon  />}
                    </IconButton>
                </Tooltip> 
                <Tooltip title="Change TimeSlots Availibility">
                    <IconButton color="secondary" onClick={() => handleAvailibility(params.row.id)} disabled={params.row.isAvailable === "Unavailable" || params.row.isOutdated === "Outdated"} sx={{ color: 'grey.dark'}}> 
                    {loadingRow === params.row.id ? <CircularProgress size={24} /> : <EventAvailableIcon  />}
                    </IconButton>
                </Tooltip> 
                <Tooltip title="increase the price by 10% ">
                    <IconButton color="secondary" onClick={() => handlePriceincrease(params.row.id,params.row.price)} disabled={params.row.isAvailable === "Unavailable" || params.row.isOutdated === "Outdated"}  sx={{color:'grey.dark'}}>
                    {loadingRow === params.row.id ? <CircularProgress size={24} /> : <PriceChangeIcon  />}
                    </IconButton>
                </Tooltip>
                <Tooltip title="decrease the price by 10%">
                    <IconButton color="secondary" onClick={() => handlePricedecrease(params.row.id,params.row.price)} disabled={params.row.isAvailable === "Unavailable" || params.row.isOutdated === "Outdated"}  sx={{color:'grey.dark'}}>
                    {loadingRow === params.row.id ? <CircularProgress size={24} /> : <DiscountIcon  />}
                    </IconButton>
                </Tooltip>  

              </>
              
            ),
        },
    ];

    const formatTime = (timeString) => {
        const time = timeString.split(":");
        return `${time[0]}:${time[1]}`;
    };

    const { auth, setAuth } = useAuth();
    const navigate = useNavigate(); //hook from 'react-router' to redirect to a path for example
    const axiosPrivate = useAxiosPrivate();

    // Prepare the timeSlots data
    const timeSlotsData = selectedTimeslots.map(timeslot => `/api/time_slots/${timeslot.id}`);

    //for the ERRORS AND SUCCESS
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [ isPending, setIsPending ] = useState(false); //manage pending time from the server response

    //SNACKBAR:
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }

    setSnackbarOpen(false);
    };

    //REVIEW 
    const [reviews, setReviews] = useState([]);
    const [openReviewsModal, setOpenReviewsModal] = useState(false);
    const [reviewOpen, setReviewOpen] = useState(false);
    const [isPendingReview, setIsPendingReview] = useState(false);

    const [reviewFormData, setReviewFormData] = useState({
    reviewText: '',
    reviewStar: 0
    });

    const handleReviewOpen = () => {
        setReviewOpen(true);
    };

    const handleReviewClose = () => {
        setReviewOpen(false);
    };

    const handleOpenReviewsModal = () => {
        setOpenReviewsModal(true);
    };

      const handleCloseReviewsModal = () => {
        setOpenReviewsModal(false);
    };

    const [feedbackOpen, setFeedbackOpen] = useState(false);

    const handleFeedbackClose = () => {
        setFeedbackOpen(false);
      };

    const handleReviewSubmit = async () => {
        try {
          setIsPending(true);
          // Convert reviewStar to an integer
          const reviewStar = parseInt(reviewFormData.reviewStar);
          
          // Create the review object
          const review = {
            reviewText: reviewFormData.reviewText,
            reviewStar: reviewStar,
            owner: `/api/users/${auth.userId}`,
            pitch: `/api/grounds/${pitch.id}`
          };
      
          // Make the POST request to create the review
          const response = await axiosPrivate.post('/api/reviews', review, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          // Close the review dialog and clear the form data
          setIsPending(false);
          setReviewOpen(false);
          setReviewFormData({
            reviewText: '',
            reviewStar: 0
          });
          getPitchData();
          getTimeSlots();
          setFeedbackOpen(true);         
        } catch (error) {
            setIsPending(false);
          setReviewOpen(false);
          setReviewFormData({
            reviewText: '',
            reviewStar: 0
          });
          getPitchData();
          getTimeSlots();
          setFeedbackOpen(true);
        }
      };

      const handleFetchReviews = async () => {
        try {
          setIsPendingReview(true);  
          const response = await axios.get(`/api/grounds/${pitch.id}/reviews`);
          setReviews(response.data['hydra:member']);
          setIsPendingReview(false);  
          setOpenReviewsModal(true);
        } catch (error) {
          // Handle error (e.g., show an error message)
        }
      };
      
    return ( 
    <div>
        <Navbar />
            {!isMobile ? (
            <Box sx={{ bgcolor: 'green.main', padding: '5px', display: 'flex', justifyContent: 'space-between' }}>

                <Grid container alignItems="center">
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" sx={{ color: 'white.main', fontWeight: 600, margin: '4px' }}>
                    TimeSlos Management
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ margin: '4px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        sx={{ color: 'white.main', mr: 1 }}
                        variant="outlined"
                        onClick={handleFetchReviews}
                        startIcon={<ViewListIcon />}
                    >
                          {isPendingReview ? (
                        <CircularProgress color="white" size={24} />
                    ) : (
                        t('Reservation.reviews')
                        )}
                    </Button>
                    </Box>
                </Grid>
                </Grid>
            </Box>

            ) : (
                <>
                <Box sx={{ bgcolor: 'green.main', padding: '5px', display: 'flex', justifyContent: 'space-between', textAlign:'center', alignItems:'center' }}>
                     <Typography variant="h6" sx={{ color: 'white.main', fontWeight: 600, margin: '4px' }}>
                    TimeSlots Management
                    </Typography>
                </Box>
                <Box sx={{ bgcolor: 'white.main', padding: '5px', display: 'flex', justifyContent: 'space-between', textAlign:'center', alignItems:'center', margin:'10px' }}>
                <Button
                        sx={{ color: 'green.main', mr: 1 }}
                        variant="outlined"
                        onClick={handleFetchReviews}
                        startIcon={<ViewListIcon />}
                    >
                        {t('Reservation.reviews')}
                    </Button>
                </Box>
                <Divider sx={{ marginTop:"5px", marginBottom:"5px" }} /> 
                </>
            )}
        <StyledBox>
           
            
            <Dialog 
            open={reviewOpen} 
            onClose={handleReviewClose}
            >
                <DialogTitle>
                    <Typography variant="h5" sx={{ color: 'green.main' }}>
                    {t('Reservation.addReview')}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ width: isMobile ? '280px' : '500px' }}>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ marginBottom: '10px' }}>
                    {t('Reservation.opinion')}
                    </Typography>
                    <TextField
                    required
                    sx={{ width: isMobile ? '280px' : '500px' }}
                    label="Review Text"
                    multiline
                    rows={5}
                    value={reviewFormData.reviewText}
                    variant="filled"
                    onChange={(e) =>
                        setReviewFormData({
                        ...reviewFormData,
                        reviewText: e.target.value,
                        })
                    }
                    />
                    <Box sx={{ marginTop: '10px' }}>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ marginBottom: '10px' }}>
                    {t('Reservation.note')}
                    </Typography>
                    <Rating
                        name="reviewStar"
                        value={reviewFormData.reviewStar}
                        onChange={(event, newValue) =>
                        setReviewFormData({
                            ...reviewFormData,
                            reviewStar: newValue,
                        })
                        }
                        sx={{ color: 'green.main' }}
                        required
                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                    />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleReviewClose}>Cancel</Button>
                    <Button
                    onClick={handleReviewSubmit}
                    disabled={!reviewFormData.reviewText || !reviewFormData.reviewStar}
                    >
                    {isPending ? (
                        <CircularProgress color="green" size={24} />
                    ) : (
                        t('Reservation.submit')
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={feedbackOpen} onClose={handleFeedbackClose}>
            <DialogTitle>
                <Typography variant="h5" sx={{ color: 'green.main' }}>Thank You!</Typography>
            </DialogTitle>
            <DialogContent sx={{ width: isMobile ? '280px' : '500px' }}>
               <Typography variant='body2'>{t('Reservation.thanks')}</Typography> 
            </DialogContent>
            <DialogActions>
                <Button onClick={handleFeedbackClose} autoFocus>
                {t('Reservation.cancel')}
                </Button>
            </DialogActions>
            </Dialog>

                        

            <Dialog open={openReviewsModal} onClose={handleCloseReviewsModal} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography variant="h5" sx={{ color: 'green.main' }}>
                    {t('Reservation.reviewsDialog')} 
                    </Typography>
                </DialogTitle>                <DialogContent>
                    {Array.isArray(reviews) && reviews.length > 0 ? (
                    reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))
                    ) : (
                    <Typography>{t('Reservation.reviewsNo')} </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReviewsModal}>{t('Reservation.close')}</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => {
                setSnackbarOpen(false);
            }}
            >
                <Alert
                    onClose={() => {
                    setSnackbarOpen(false);
                    }}
                    severity={success ? "success" : "error"}
                >
                    {success ? (
                    succMsg
                    ) : errMsg}
                </Alert>
             </Snackbar>
            <Box>
                
            <Grid container spacing={2}>

                    <Grid item xs={12} sm={12} md={9}>   
                    <Typography variant="subtitle1" sx={{ color: 'green.main', fontWeight: 600, margin: '10px', textAlign:'center' }}>Pick a date</Typography>  
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker 
                                sx={{ width: isMobile ? 'auto': '100%', margin:'10px'}}
                                label={t('Reservation.pickDate')}
                                value={selectedDate}
                                minDate={startingDate}                                maxDate={dayjs().add(1, 'month')} 
                                onChange={(newValue) => setSelectedDate(newValue)}
                                renderInput={(params) => <TextField {...params}  />}
                                />
                            </DemoContainer>
                        </LocalizationProvider>

                        <Box sx={{ display: "flex",  justifyContent: "space-between", margin:'10px'}}>
                            <Typography variant="subtitle1" textAlign="left" sx={{ color: "green.main" }}>
                            TimeSlots:
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
                                        onRowSelectionModelChange={(newSelectionModel) => handleTimeslotSelection(newSelectionModel)}
                                    />
                                    ) : (
                                    
                                        <CircularProgress sx={{ color:"green.main" }} />
                            )}
                        </div>
                    </Grid>
                 

                    <Grid item xs={12} sm={12} md={3} sx={{textAlign:'center'}}>     
                        <Typography variant="subtitle1" sx={{ color: 'green.main', fontWeight: 600, margin: '10px' }}>{t('Reservation.pitchInfo')}</Typography>
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
                                        width: isMobile ? '98%' : '95%',
                                        height: isMobile ? '93%' : 'auto',
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
                                        <Typography variant="subtitle1" color="text.secondary">{t('PitchCard1.contact')} </Typography>
                                        <Link href={`tel:${pitch.phoneNumber}`} underline="none" color="inherit">
                                            <Typography variant="subtitle1" color="text.secondary">{pitch.phoneNumber}</Typography>
                                        </Link>
                                    </Box>
            
                                    <Divider sx={{ marginTop:"5px", marginBottom:"5px" }} />

                                    <Box sx={{  padding: '0px 10px', display: 'flex', flexDirection: 'row',   justifyContent: 'space-between' , marginBottom: '4px'}}>    
                                        <Typography variant="subtitle1" color="text.secondary">{t('PitchCard1.rating')} </Typography>
                                        <Rating sx={{color: 'green.main'}} name="read-only" value={averageRating} precision={0.5} readOnly />
                                         
                                    </Box>
                                    <Divider sx={{ marginTop:"5px", marginBottom:"5px" }} />

                                    <Box sx={{  padding: '0px 10px', display: 'flex', flexDirection: 'row',   justifyContent: 'space-between' , marginBottom: '5px'}}> 
                                        <Typography variant="subtitle1" color="text.secondary">{t('PitchCard1.amenties')} </Typography>     
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
                                        <Typography variant="subtitle1" color="text.secondary">{t('PitchCard1.location')} </Typography>
                                        {pitch?.address && (
                                         <Button 
                                         variant="outlined" 
                                         startIcon={<Google />}
                                         href={`https://www.google.com/maps/?q=${pitch.address.latitude},${pitch.address.longitude}`}
                                         target="_blank" 
                                         rel="noopener noreferrer"
                                       >
                                         {t('PitchCard1.maps')}
                                       </Button>
                                        )}
                                    </Box>
                                </Card>
                            )}             
                    </Grid>

                   
                    
                </Grid>
            </Box>
        </StyledBox>
        <AppFooter />
    </div>

    );
}
 
export default TimeslotsManagement;
