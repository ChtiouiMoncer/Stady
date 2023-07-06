import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,Link, IconButton, Snackbar, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material";
import React, { useEffect, useState } from "react";
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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { AddCircle } from "@mui/icons-material";


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

const AdminsMangement = () => {
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
          setSuccMsg('Admin Deleted Successfully')
          getUsers();

        } catch (err) {

            setIsPending(false);
            setSuccess(false);
            
           
             setErrMsg("There was a problem while deleting the Admin, Try Again");
          
        
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
                    .filter(user => user.roles.includes('ROLE_ADMIN'))
                    .map(user => ({
                        id: user.id,
                        email: user.email,
                        roles: user.roles,
                        password: user.password,
                        username: user.username,
                        phone: user.phoneNumber, // Count of reviews
                       
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
            { field: 'username', headerName: "Username", width: 300 },
            { field: 'email', headerName: "Email", width: 400 },
            { field: 'phone', headerName: "Phone Number", width: 200 },
        
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
                        <Typography variant="h6" textAlign="left" sx={{ color: "green.main", marginBottom:'10px'}}> Admin Users</Typography>
                        <Tooltip title="Add Admin">
                          <StyledButton
                                  component={RouterLink}
                                  to="/superadmin/manage/users/admins/add"
                                  variant="contained"
                                  className="my-button"
                                  startIcon={<AddCircle />}
                                  size="small"
                                  >
                                      <Typography variant="subtitle2">
                                      Add Admin
                                      </Typography>
                          </StyledButton>
                      </Tooltip>
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
 
export default AdminsMangement;