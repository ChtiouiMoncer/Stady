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
import ReviewCard from './ReviewCard';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Footer from '../homePage/Footer';
import AppFooter from '../homePage/AppFooter';
import { useTranslation } from 'react-i18next';

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

const TimeslotSelection = () => {
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

    //DATE & TIMESLOTS 
    const [selectedDate, setSelectedDate] =  React.useState(dayjs());    

    // Add the following state variables
    const [selectedTimeslots, setSelectedTimeslots] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [fees, setFees] = useState(2); // Assume fees is 2DT

    
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


      const columns = [
        { field: 'id', headerName: t('Reservation.code'), width: isMobile ? 85: 100, disableColumnMenu: true },
        { field: 'start_time', headerName: isMobile ? t('Reservation.start') : t('Reservation.startTime') ,  width: isMobile ? 95: 150, disableColumnMenu: true,
        valueFormatter: (params) => formatTime(params.value),
        },
        
        { field: 'end_time', headerName: isMobile ? t('Reservation.end') : t('Reservation.endTime'),  width: isMobile ? 85: 150, disableColumnMenu: true ,
        valueFormatter: (params) => formatTime(params.value),
        },

        { field: 'price', headerName: t('Reservation.price'),  width: isMobile ? 85: 150, disableColumnMenu: true ,
        valueFormatter: (params) => `${params.value} DT`,
        }
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

    const [openModal, setOpenModal] = useState(false);
    const [qrValue, setQrValue] = useState('');

    const handleCloseModal = () => {
        setOpenModal(false);
      };

    const [paymentUrl, setPaymentUrl] = useState(null);
    const [paymentId, setPaymentId] = useState(null); 

        const makeReservation = async () => {

        setPaymentUrl(null);
        setPaymentId(null);    
        // Prepare the timeSlots data
        const timeSlotsData = selectedTimeslots.map(timeslot => `/api/time_slots/${timeslot.id}`);
        // Prepare the reservation data
        const reservationData = {
            totalPrice: totalPrice + fees, // Remember to add the fees to the total price
            pitch: `/api/grounds/${pitch?.id}`,
            timeSlots: timeSlotsData,
            owner: `/api/users/${auth?.userId}`
        };

        try {
            // Make the POST request
            const response = await axiosPrivate.post('/api/reservations', JSON.stringify(reservationData), {
                headers: {
                    'Content-Type' : 'application/ld+json',
                }
            });

            // Handle the response...
            console.log(response.data);

            // Clear the reservation state
            setSelectedTimeslots([]);
            setTotalPrice(0);
            setFees(2);
            localStorage.removeItem('reservationState');
            localStorage.removeItem('pitchInfo');
            localStorage.removeItem('date');
            localStorage.removeItem('timeslots');

            setErrMsg('');
            setSuccess(true);
            setSnackbarOpen(true); 
            setIsPending(false);
            getTimeSlots();

            // data to be encoded in the QR code
            const data = {
                ReservationCode: response.data.id,
                timeslots: selectedTimeslots, // you need to adapt this to the actual timeslot data
                totalPrice: totalPrice,
                username: auth.username, // you need to adapt this to the actual username
            };

            // Format data as string 
            const dataStr = `Reservation Code: ${data.ReservationCode}\nBooked By: ${data.username}\nTotal Price: ${data.totalPrice}DT\nTimeslots:\n${data.timeslots.map((slot, index) => `    Slot ${index+1}: ${slot.start_time} to ${slot.end_time}, Code: ${slot.id}`).join('\n')}`;
            QRCode.toDataURL(dataStr)
            .then(url => {
                console.log(url);
                setQrImage(url);
            })
            .catch(err => {
                console.error(err);
            });

            const emailParams = {
                from_name: 'Stady Team', // you can customize this
                to_name: auth.username, // replace with the recipient's name
                user_email: auth.email, // replace with the recipient's email
                message: dataStr, // url is the QR code data URL we generated earlier
            };
                
            emailjs.send('service_5sw52ng', 'template_zva59j4', emailParams, 'kSM8tqZ2IFIcz3Hpd')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
            }, (error) => {
                console.log('FAILED...', error);
            });
        
            setOpenModal(true);

        } catch (err) {
            setSuccess(false);
            setIsPending(false);
            getTimeSlots();
            if (err?.response?.data['hydra:description'] === "Cannot reserve a timeslot that is already Reserved.") {
                setErrMsg("Cannot reserve a Timeslot that is already Reserved");
            } else if (err?.response?.data['hydra:description'] === "Cannot reserve a timeslot that is outdated.") {
                setErrMsg("Cannot reserve a timeslot that is Outdated");
            }
        }
    };

    const cancelReservation = async () => {
            setPaymentUrl(null);
            setPaymentId(null);  
            setErrMsg('There was An Error with your Payment Try Again!');
            setSuccess(false);
            setSnackbarOpen(true); 
            setIsPending(false);

    };

    const makePayment = async () => {
        try {
            setIsPending(true);
        
            const Amount = 0o400;
            //PAYMENT API
            const totalAmount = (totalPrice + fees) * 1000;
            const payment = await axios.post('https://api.konnect.network/api/v2/payments/init-payment',
            
            {
                "receiverWalletId": "64a82c25edd4795ff4be0ceb",
                "token": "TND",
                "amount": 0o400,
                "type": "immediate",
                "description": "Reservation payment description",
                "lifespan": 5,
                "addPaymentFeesToAmount": true,
                "firstName": auth.username,
                "email": auth.email,
                "orderId": "1234657",
                "successUrl": "https://konnect.network/gateway/payment-success",
                "failUrl": "https://konnect.network/gateway/payment-failure",
                "checkoutForm": true,
                "acceptedPaymentMethods": [
                "wallet",
                "bank_card",
                "e-DINAR"
                ]            },
            {
                headers: {
                    'x-api-key' : '64a82c25edd4795ff4be0ce8:1jQ83PMMUKbOJ56vtLWuK6kkimvJZ4S',
                    'Content-Type' : 'application/json',
                }
            });

            const payment_url = payment.data.payUrl;
            const paymentId = payment.data.paymentRef;
            setPaymentUrl(payment_url);
            setPaymentId(paymentId);
            
            window.open(payment_url, '_blank');

            const intervalId = setInterval(async () => {
                try {
                    // Make a GET request to check the payment status
                    const response = await axios.get(`https://api.konnect.network/api/v2/payments/${paymentId}`,
                    {
                            headers: {
                                'Content-Type' : 'application/json',
                            }
                        }
                    );

                    const payment_status = response.data.payment.status;
                    const hasFailedTransaction = response.data.payment.transactions.some(transaction => transaction.status === "failed_payment");

                    console.log(payment_status);
                    // Handle the different statuses
                    if (payment_status === "completed") {
                        // If payment is completed, stop the interval and proceed with reservation
                        clearInterval(intervalId);
                        makeReservation();
                    } else if (hasFailedTransaction) {
                        // If payment is canceled or failed, stop the interval and handle error
                        clearInterval(intervalId);
                        cancelReservation();
                    }
                    // For "pending" status, do nothing, just wait for the next check
                } catch (error) {
                    console.error(`Error checking payment status: ${error}`);
                    // On error, stop the interval
                    clearInterval(intervalId);
                }
            }, 5000); // Check every 5 seconds (5000 milliseconds)
        } catch (error) {
            setIsPending(false);
            console.error(`Error initiating payment: ${error}`);
        }
    };

    const handleReservation = () => {
        if (auth?.username) {
            makePayment(); // Make the reservation
        } else {
            // Save current state to local storage
            localStorage.setItem('reservationState', JSON.stringify(selectedTimeslots));
            localStorage.setItem('pitchInfo', JSON.stringify(pitch));
            localStorage.setItem('date', selectedDate.format());
            localStorage.setItem('timeslots', JSON.stringify(timeslots));
            localStorage.setItem('totalPrice', JSON.stringify(totalPrice));

            // Save current path to local storage
            localStorage.setItem('previousPath', window.location.pathname);
            navigate('/login', { replace: true });
        }
    };

    const [qrImage, setQrImage] = useState(null);

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
                    {t('Reservation.reservation')}
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
                    {auth.username && (
                        <Button
                        sx={{ color: 'white.main' }}
                        variant="outlined"
                        onClick={handleReviewOpen}
                        startIcon={<RateReviewIcon />}
                        >
                        {t('Reservation.writeReview')}
                        </Button>
                    )}
                    </Box>
                </Grid>
                </Grid>
            </Box>

            ) : (
                <>
                <Box sx={{ bgcolor: 'green.main', padding: '5px', display: 'flex', justifyContent: 'space-between', textAlign:'center', alignItems:'center' }}>
                     <Typography variant="h6" sx={{ color: 'white.main', fontWeight: 600, margin: '4px' }}>
                    {t('Reservation.reservation')}
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
                    {auth.username && (
                        <Button
                        sx={{ color: 'green.main' }}
                        variant="outlined"
                        onClick={handleReviewOpen}
                        startIcon={<RateReviewIcon />}
                        >
                        {t('Reservation.writeReview')}
                        </Button>
                    )}
                </Box>
                <Divider sx={{ marginTop:"5px", marginBottom:"5px" }} /> 
                </>
            )}
        <StyledBox>
            <StyledModalQr
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            >
                <Box
                    sx={{
                    bgcolor: "background.default",
                    color: "text.primary",
                    padding: 4,
                    borderRadius: 2,
                    //'& > *': { marginBottom:'10px' },
                    maxHeight: '80vh',
                    width: isMobile ? 'auto' : 'auto', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
                    height: isMobile ? 'auto' : 'auto', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
                    display:'flex',
                    flexDirection:'column',
                    margin:'10px'    
                    }}
                >    
                    <Typography variant="h6" textAlign="center" sx={{ color: "green.main", marginBottom:'10px'}}>
                    {t('Reservation.qr')}
                    </Typography>
                    <Typography variant="h5" textAlign="center" sx={{ color: "grey.main", marginBottom:'10px'}} >{t('Reservation.qr2')}</Typography>

                    <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center'}}> 
                    <img src={qrImage} alt="QR Code" />
                    
                    </Box>  
                    <Button
                        href={qrImage}
                        download="QR_Code.png"
                        variant="contained"
                        color="primary"
                        disabled={!qrImage}
                        startIcon={<DownloadIcon/>}
                    >
                       {t('Reservation.qr3')}
                    </Button>
                </Box>
            </StyledModalQr>
            
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
              <Alert
               onClose={handleClose}
               severity={success ? "success" : "error"}
               sx={{ width: '100%' }}
               >
                {success ? (
                 t('Reservation.reservationSuccess')
                ) : errMsg} 
               </Alert>
             </Snackbar>         
            <Box>
                
            <Grid container spacing={2}>

                    <Grid item xs={12} sm={12} md={5}>   
                    <Typography variant="subtitle1" sx={{ color: 'green.main', fontWeight: 600, margin: '10px', textAlign:'center' }}>{t('Reservation.timeslot')}</Typography>  
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker 
                                sx={{ width: isMobile ? 'auto': '100%', margin:'10px'}}
                                label={t('Reservation.pickDate')}
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
                            {t('Reservation.AvailableTimeSlots')}
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
                    <Grid item xs={12} sm={12} md={4} sx={{textAlign:'center'}}> 
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <Typography variant="subtitle1" sx={{ color: 'green.main', fontWeight: 600, margin: '10px', textAlign:'center' }}>{t('Reservation.basket')}</Typography>
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
                                height: isMobile ? '94%' : 'auto',
                                margin: '0px',
                            }}
                            >
                                <CardContent> 
                                    {pitch ? (
                                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '5px', alignItems:'center', justifyContent: 'center'}}>
                                            <StadiumIcon sx={{ color: 'grey.main'}} />
                                            <Typography variant="subtitle1" color="text.secondary">
                                                {pitch.name.toUpperCase()}, 
                                            </Typography>
                                            <Typography variant="subtitle1" color="green.main" >
                                                {pitch.state.name} 
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Typography variant="h5" color="text.secondary">
                                            Loading...
                                        </Typography>
                                    )}

                                    {selectedTimeslots && selectedTimeslots.length > 0 ? (
                                    <>
                                       <Box sx={{display: 'flex', flexDirection: 'column', marginTop: '15px'}}>
                                            <Divider sx={{ marginTop:"5px", marginBottom:"20px" }} />
                                            <Typography variant="h5" sx={{ color: 'grey.main', marginBottom: '10px'}}>Timeslots:</Typography>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <Typography variant="body1" sx={{ color: 'grey.main'}}>Code</Typography>
                                                <Typography variant="body1" sx={{ color: 'grey.main'}}>Start </Typography>
                                                <Typography variant="body1" sx={{ color: 'grey.main'}}>End </Typography>
                                                <Typography variant="body1" sx={{ color: 'grey.main'}}></Typography>
                                                <Typography variant="body1" sx={{ color: 'grey.main'}}></Typography>
                                            </Box>

                                            {selectedTimeslots.map(timeslot => (
                                                <Box key={timeslot.id} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                    <Typography variant="body1">{timeslot.id}</Typography>
                                                    <Typography variant="body1">{formatTime(timeslot.start_time)}</Typography>
                                                    <Typography variant="body1">{formatTime(timeslot.end_time)}</Typography>
                                                    <Button onClick={() => handleTimeslotRemoval(timeslot)}><CancelIcon /></Button>
                                                </Box>
                                            ))}
                                        </Box>
                                        <Divider sx={{ marginTop:"5px", marginBottom:"20px" }} />

                                        <Box sx={{display: 'flex', flexDirection: 'column', marginTop: '15px'}}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <Typography variant="h5" sx={{ color: 'grey.main'}}>{t('Reservation.price1')}</Typography>
                                            <Typography variant="h5" sx={{ color: 'grey.main'}}>{totalPrice} DT</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <Typography variant="h5" sx={{ color: 'grey.main'}}>{t('Reservation.fees')}</Typography>
                                            <Typography variant="h5" sx={{ color: 'grey.main'}}>{fees} DT</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <Typography variant="h5" sx={{ color: 'grey.main'}}>{t('Reservation.total')}</Typography>
                                            <Typography variant="h5" sx={{ color: 'grey.main'}}>{totalPrice + fees} DT</Typography>
                                        </Box>
                                        </Box>
                                        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '15px'}}>
                                        <StyledButton
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={handleReservation}
                                            disabled={isPending}
                                        >
                                            {isPending ? (
                                                <CircularProgress color="white" size={24} />
                                            ) : (
                                                t('Reservation.reserve')
                                            )}
                                        </StyledButton>
                                        </Box>
                                    </>
                                    ) : (
                                    <Typography variant="h5" sx={{marginTop: '15px', color: 'grey.main'}}>{t('Reservation.noTimeSlotSelect')}</Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Box>                 
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
 
export default TimeslotSelection;
