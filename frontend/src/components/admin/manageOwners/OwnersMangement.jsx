import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom/dist";
import CancelIcon from '@mui/icons-material/Cancel';
import { DataGrid } from "@mui/x-data-grid";
import QRCode from "qrcode.react";
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CloseIcon from '@mui/icons-material/Close';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { useTranslation } from "react-i18next";
import useAxiosPrivate from "../../../Hooks/useAxiosPrivate";
import useAuth from "../../../Hooks/useAuth";
import DeleteIcon from '@mui/icons-material/Delete';

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

const OwnersMangement = () => {
    const { t } = useTranslation();

    const theme = useTheme(); //using the the Material-UI theme object, which is provided by the useTheme hook from Material-UI.
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // checking if device is mobile

    const [ isReservationsPending, setIsReservationsPending ] = useState(false);
    const [users, setUsers] = useState([]);
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
    const [succMsg, setSuccMsg] = useState('');

    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();


    const { auth, setAuth } = useAuth();
    const user_id = auth.userId;

    const handleDelete = async (id) => {
        setLoadingRow(id);
        const DELETE_USER_URL = `/api/users/${id}`;
      
        try {
          const response = await axiosPrivate.delete(DELETE_USER_URL,
            {
              headers: {'Content-Type' : 'application/json'},
            }
          );
          setSnackbarOpen(true);   
          setErrMsg('');
          setSuccess(true);
          setSuccMsg('User Deleted Successfully')
          getUsers();

        } catch (err) {

            setIsPending(false);
            setSuccess(false);
            
            if (err?.response?.data['hydra:description'] === "Cannot delete Pitch. There are active reservations associated with it.") {
              setErrMsg("Soory, but we can't delete a User that have Pitches with active Reservations");
            } else {
                setErrMsg("There was a problem while deleting the User, Try Again");
            }
        
            setSnackbarOpen(true);
        }
        // Refresh data after rejecting
        getUsers();
        setLoadingRow(null);
      };

    const USERS_URL = `/api/users`;

    const getUsers = async () => {
        let isMounted = true;
        const controller = new AbortController();
        setIsReservationsPending(true);
        try {
            const response = await axiosPrivate.get(USERS_URL, {
                    signal: controller.signal,
                    headers: {'accept': 'application/json'}      
                }
            );
            
            if (isMounted) {
                console.log(response?.data);
                
                const memberUsers = response.data
                    .filter(user => user.roles.includes('ROLE_OWNER'))
                    .map(user => ({
                        id: user.id,
                        email: user.email,
                        roles: user.roles,
                        password: user.password,
                        username: user.username,
                        pitchesCount: user.pitches.length, // Count of reviews
                       
                    }));
    
                setUsers(memberUsers); // Assuming that you have a function to set users state
                console.log(users);
            }
            setIsReservationsPending(false);
    
        } catch (err) {
            console.log(err);         
        }
    }


        //Load Reservations Data  
        useEffect(() => {
            let isMounted = true;
            const controller = new AbortController();
            setTimeout(() => {
                getUsers ();
            }, 1000);
            return () => {
                isMounted = false; 
                controller.abort();
            }
        }, [])


        const columns = [];

        if (!isMobile) {
          columns.push(
            { field: 'id', headerName: "ID", width: 120 },
            { field: 'username', headerName: "Username", width: 220 },
            { field: 'email', headerName: "Email", width: 300 },
            { field: 'pitchesCount', headerName: "Number of Facilities", width: 200 },
        
          );
        }
        
        columns.push(
          {
            field: 'actions',
            headerName: 'Actions',
            width: isMobile ? '70vw' : 130,
            renderCell: (params) => (
              <Tooltip title="Delete User">
                <IconButton
                  onClick={() => handleDelete(params.row.id)}
                >
                  {loadingRow === params.row.id ? (
                    <CircularProgress size={24} />
                  ) : (
                    <DeleteIcon   />
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
                <Box flex={8} 
                sx={{
                    m: 4, 
                    marginTop: 4,
                    border: `2px solid ${theme.palette.green.main}`, // Add border property    
                    bgcolor: "white.light",
                    padding: 3,
                    borderRadius: 2,
                    maxHeight: '80vh',
                    width: isMobile ? '80vw' : '80vw', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
                    height: isMobile ? 'auto' : 'auto', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
                    }}
                >   
                    <Box sx={{ display: "flex",  justifyContent: "space-between" }}>
                        <Typography variant="h6" textAlign="left" sx={{ color: "green.main", marginBottom:'10px'}}> Pitch Owners Users</Typography>
                    </Box>
                        <div style={{ height: 500, width: '100%' }}>
                        {!isReservationsPending ? (
                            <DataGrid
                                sx={{ bgcolor: 'white.main'}}
                                rows={users}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                    paginationModel: { page: 0, pageSize: 10 },
                                    },
                                }}
                                pageSizeOptions={[5, 10]}
                                
                                //checkboxSelection
                            />  
                            ) : (
                                <CircularProgress sx={{ color:"green.main" }} />
                            )}
                        </div>
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
                            succMsg
                            ) : errMsg} 
                        </Alert>
                        </Snackbar>        
                </Box>
          </>


     );
}
 
export default OwnersMangement;