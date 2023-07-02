import {Alert, Box, Button, Card, CardContent, CircularProgress, Divider, Grid, IconButton, Link, Modal, Paper, Rating, Snackbar, TextField, Tooltip, Typography, styled } from '@mui/material';
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
        { field: 'id', headerName: 'Code', width: isMobile ? 85: 100, disableColumnMenu: true },
        { field: 'start_time', headerName: isMobile ? 'Start' : 'Start Time' ,  width: isMobile ? 85: 150, disableColumnMenu: true,
        valueFormatter: (params) => formatTime(params.value),
        },
        
        { field: 'end_time', headerName: isMobile ? 'End' : 'End Time',  width: isMobile ? 85: 150, disableColumnMenu: true ,
        valueFormatter: (params) => formatTime(params.value),
        },

        { field: 'price', headerName: 'Price',  width: isMobile ? 85: 150, disableColumnMenu: true ,
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
            pitch: `/api/grounds/${pitch.id}`,
            timeSlots: timeSlotsData,
            owner: `/api/users/${auth.userId}`
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

            //PAYMENT API
            const totalAmount = (totalPrice + fees) * 1000;
            const payment = await axios.post('https://api.preprod.konnect.network/api/v2/payments/init-payment',
            {
                "receiverWalletId": "649eafe6a31ee65780ff2dd2",
                "token": "TND",
                "amount": totalAmount,
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
                    'x-api-key' : '649eafe6a31ee65780ff2dcf:rp9llMIGOZWrUsI8uZlk',
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
                    const response = await axios.get(`https://api.preprod.konnect.network/api/v2/payments/${paymentId}`,
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

    
    return ( 
    <div>
        <Navbar />
        <Box sx={{ bgcolor: 'green.main', padding: '5px'}}>
            <Typography variant="h6" sx={{ color: 'white.main', fontWeight: 600, margin: '10px' }}>Reservation Process</Typography>
        </Box>
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
              Time To get your QR code!
            </Typography>
            <Typography variant="h5" textAlign="center" sx={{ color: "grey.main", marginBottom:'10px'}} >Please save this QR code and present it at the venue.</Typography>

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
                Download QR Code
            </Button>
        </Box>
        </StyledModalQr>

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
                 'You successfully created your reservation!'
                ) : errMsg} 
               </Alert>
        </Snackbar>         
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
                                        onRowSelectionModelChange={(newSelectionModel) => handleTimeslotSelection(newSelectionModel)}
                                    />
                                    ) : (
                                    
                                        <CircularProgress sx={{ color:"green.main" }} />
                            )}
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} sx={{textAlign:'center'}}> 
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <Typography variant="subtitle1" sx={{ color: 'green.main', fontWeight: 600, margin: '10px', textAlign:'center' }}>Reservation Basket</Typography>
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
                                            <Typography variant="h5" sx={{ color: 'grey.main'}}>Price:</Typography>
                                            <Typography variant="h5" sx={{ color: 'grey.main'}}>{totalPrice} DT</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <Typography variant="h5" sx={{ color: 'grey.main'}}>Fees:</Typography>
                                            <Typography variant="h5" sx={{ color: 'grey.main'}}>{fees} DT</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <Typography variant="h5" sx={{ color: 'grey.main'}}>Total:</Typography>
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
                                                "Reserve"
                                            )}
                                        </StyledButton>
                                        </Box>
                                    </>
                                    ) : (
                                    <Typography variant="h5" sx={{marginTop: '15px', color: 'grey.main'}}>No timeslots selected yet</Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Box>                 
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

                   
                    
                </Grid>
            </Box>
        </StyledBox>
    </div>

    );
}
 
export default TimeslotSelection;
