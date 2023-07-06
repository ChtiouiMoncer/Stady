import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../Navbar";
import loginbg from '../../assets/herobg.png'
import { styled } from "@mui/material";
import useAuth from "../../Hooks/useAuth";
import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import { useNavigate } from "react-router-dom/dist";
import CancelIcon from '@mui/icons-material/Cancel';
import { DataGrid } from "@mui/x-data-grid";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import QRCode from "qrcode.react";
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CloseIcon from '@mui/icons-material/Close';
import FeedbackIcon from '@mui/icons-material/Feedback';
import Footer from "../homePage/Footer";
import { useTranslation } from "react-i18next";

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: '20px',
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
    backgroundImage: `url(${loginbg})`,
    height: '90vh',
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',
    
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

const Reservations = () => {
    const { t } = useTranslation();

    const theme = useTheme(); //using the the Material-UI theme object, which is provided by the useTheme hook from Material-UI.
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // checking if device is mobile

    const [ isReservationsPending, setIsReservationsPending ] = useState(false);
    const [reservations, setReservations] = useState([]);
    const [loadingRow, setLoadingRow] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setSnackbarOpen(false);
    };

    const [ isPending, setIsPending ] = useState(false);

    //for the ERRORS AND SUCCESS
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();


    const { auth, setAuth } = useAuth();
    const user_id = auth.userId;

    const handleReject = async (id) => {
        setLoadingRow(id);
        const PATCH_RESERVATION_URL = `/api/reservations/${id}`;
      
        try {
          const response = await axiosPrivate.patch(PATCH_RESERVATION_URL,
            JSON.stringify({
                isCancelled: true,
            }),
            {
              headers: {'Content-Type' : 'application/merge-patch+json'},
            }
          );
          setSnackbarOpen(true);   
          setErrMsg('');
          setSuccess(true);
         
        } catch (err) {

          setIsPending(false);
          if (err?.response?.data['hydra:description'] === "Cannot cancel a reservation that is outdated.") {
            setErrMsg("Soory, but we can't cancel a reservation that is Outdated!");
        } else if (err?.response?.data['hydra:description'] === "Cannot cancel a reservation that have a timeslot that is going to start less than 10min from now.") {
            setErrMsg("Soory, but we can't can't cancel a reservation that has a timeslot starting less than 10 minutes from now.");
        } else if (err?.response?.data['hydra:description'] === "Cannot cancel a reservation that is already available.") {
            setErrMsg("Soory, but we can't can't cancel a reservation that is already available");
        }
        setSnackbarOpen(true); 
        }
        // Refresh data after rejecting
        getReservations();
        setLoadingRow(null);
      };

    const RESERVATIONS_URL = `/api/users/${user_id}/reservations`;

    const getReservations = async () => {
        let isMounted = true;
        const controller = new AbortController();
        setIsReservationsPending(true);
        try {
            const response = await axiosPrivate.get(RESERVATIONS_URL, {
                    signal: controller.signal,
                    headers: {'accept': 'application/json'}      
                }
            );
            
            if (isMounted) {
                console.log(response?.data);
                setReservations(
                    response.data.map(reservation => ({
                        id: reservation.id, 
                        reservationCode: reservation.id,
                        pitchName: reservation.pitch.name,
                        totalPrice: reservation.totalPrice + " DT", // Add 'DT' at the end of the price
                        timeSlots: reservation.timeSlots.map(slot => 
                            `Start: ${slot.startTime}, End: ${slot.endTime}, Price: ${slot.price} DT, Date: ${slot.date}`).join('\n'), // Use line break instead of '; '
                        status:reservation.isCancelled ? 'Cancelled' : 'Active', // Show 'Cancelled' if isCancelled is true, else 'Active'
                        actions: "Actions" 
                    }))
                );
            }
            setIsReservationsPending(false);

        } catch (err) {
            console.log(err)            
        }
    }


        //Load Reservations Data  
        useEffect(() => {
            let isMounted = true;
            const controller = new AbortController();
            setTimeout(() => {
                getReservations();
            }, 1000);
            return () => {
                isMounted = false; 
                controller.abort();
            }
        }, [])


        const columns = [];

        if (!isMobile) {
          columns.push(
            { field: 'pitchName', headerName: t('UserReservtion.pitch'), width: 140 },
            { field: 'totalPrice', headerName: t('UserReservtion.price'), width: 70 },
            { field: 'status', headerName: t('UserReservtion.status'), width: 100 },
            {
              field: 'timeSlots',
              headerName: t('UserReservtion.timeslots'),
              width: 550,
              renderCell: (params) => <pre>{params.value}</pre>,
            }
          );
        }
        
        columns.push(
          { field: 'reservationCode', headerName: 'Code', width: isMobile ? 90 : 100, disableColumnMenu: true  },
          {
            field: 'qr',
            headerName: 'QR Code',
            width: isMobile ? '70vw' : 130,
            renderCell: (params) => (
              <Tooltip title="QR CODE">
                <StyledButton  disabled={params.row.status === 'Cancelled'} startIcon={<QrCode2Icon />} variant="contained" onClick={() => handleOpenQR(params.row)}>
                  <Typography variant="body2">Get QR</Typography>
                </StyledButton>
              </Tooltip>
            ),
            disableColumnMenu: true 
          },
          {
            field: 'actions',
            headerName: 'Actions',
            width: isMobile ? '70vw' : 130,
            renderCell: (params) => (
              <Tooltip title="Cancel Reservation">
                <IconButton
                  color="secondary"
                  onClick={() => handleReject(params.row.id)}
                  disabled={params.row.status === 'Cancelled'}
                >
                  {loadingRow === params.row.id ? (
                    <CircularProgress size={24} />
                  ) : (
                    <CancelIcon sx={{ color: params.row.status === 'Cancelled' ? 'grey' : 'red' }} />
                  )}
                </IconButton>
              </Tooltip>
            ),
            disableColumnMenu: true 
          }
        );
        
        // Declare a state to control the open status of the dialog and the current QR code data
        const [openQR, setOpenQR] = useState(false);
        const [currentQRData, setCurrentQRData] = useState(null);

        // Function to handle opening the QR dialog
        const handleOpenQR = (rowData) => {
          const { reservationCode, pitchName, totalPrice, timeSlots, status } = rowData;
          
          // Check if timeSlots is a string and split into an array
          const timeSlotsArray = typeof timeSlots === 'string' ? timeSlots.split('\n') : [timeSlots];
        
          // Format each time slot with its corresponding slot number
          const formattedTimeSlots = timeSlotsArray.map((slot, index) => `Slot ${index + 1}: ${slot}`).join('\n');
          
          const formattedQRData = `Reservation Code: ${reservationCode}\nPitch Name: ${pitchName}\nTotal Price: ${totalPrice}\nTime Slots:\n${formattedTimeSlots}\nStatus: ${status}`;
          
          setCurrentQRData(formattedQRData);
          setOpenQR(true);
        }

        // Function to handle closing the QR dialog
        const handleCloseQR = () => {
        setOpenQR(false);
        setCurrentQRData(null);
        }

        // Function to download the QR code
        const downloadQR = () => {
        const canvas = document.getElementById("qrcode");
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "qrcode.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        };


       //APP REVIEW
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
    return ( 
        <>
            <Navbar />
            <StyledModal>
                {!isReservationsPending ? (
                <Box 
                sx={{
                position: "relative",  
                bgcolor: "background.default",
                color: "text.primary",
                padding: 3,
                borderRadius: 2,
                border: `1px solid ${theme.palette.green.main}`, // Add border property
                //'& > *': { marginBottom:'10px' },
                maxHeight: '80vh',
                width: isMobile ? '80vw' : '80vw', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
                height: isMobile ? 'auto' : 'auto', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
                }}
                >   
                    <Box sx={{ display: "flex",  justifyContent: "space-between" }}>
                        <Typography variant="h6" textAlign="left" sx={{ color: "green.main", marginBottom:'10px'}}> {t('UserReservtion.reservation')}</Typography>
                    </Box>
                        <div style={{ height: 500, width: '100%' }}>
                            <DataGrid
                                sx={{ bgcolor: 'white.main'}}
                                rows={reservations}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                    paginationModel: { page: 0, pageSize: 10 },
                                    },
                                }}
                                pageSizeOptions={[5, 10]}
                                rowHeight={80}
                                //checkboxSelection
                            />  
                        </div>
                        <Dialog open={openQR} onClose={handleCloseQR}>
                        <DialogTitle>QR Code</DialogTitle>
                        <DialogContent>
                            <QRCode id="qrcode" value={currentQRData} size={256} level={"H"} includeMargin={true} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={downloadQR}>
                            {t('UserReservtion.qr3')}
                            </Button>
                            <Button onClick={handleCloseQR}>
                            {t('UserReservtion.close')}
                            </Button>
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
                            t('UserReservtion.reservationSuccess')
                            ) : errMsg} 
                        </Alert>
                        </Snackbar>        
                </Box>
                ) : (
                    <CircularProgress sx={{ color:"green.main" }} />
                )}
            </StyledModal>
            <Footer />
          </>


     );
}
 
export default Reservations;