import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
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
import axios from "../../../api/axios";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';

const StyledButton = styled(Button)(({ theme }) => ({
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

const SportsType = () => {
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
    const [succMsg, setSuccMsg] = useState('');

    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();


    const { auth, setAuth } = useAuth();
    const user_id = auth.userId;

    

         //sportsType data state
        const [sportsTypes, setSportsTypes] = useState([]);  
        const [states, setStates] = useState();  


          //sportsType ENDPOINT
          const SPORTS_TYPES_URL = '/api/sports_types'
          const STATES_URL = '/api/floor_types'

          const getSportsType = async () => {
            let isMounted = true;
            const controller = new AbortController();
            setIsReservationsPending(true);
            try {
                  const response = await axios.get(SPORTS_TYPES_URL, {
                          signal: controller.signal, //cancel the request if we need to    
                          headers: {'accept': 'application/json'} // include the accept header
                      },    
                  );    
                  console.log(response.data);
                  if (isMounted) {
                    console.log(response?.data);
                    setSportsTypes(
                        response.data.map(reservation => ({
                            id: reservation.id, 
                            sportsName: reservation.SportsName,
                            floorTypes: reservation.floorTypes.map(slot => 
                                `Floor Type: ${slot.floorName}`).join('\n'), // Use line break instead of '; '
                            actions: "Actions",
    
                        }))
                    );
                }
                setIsReservationsPending(false);               
              } catch (err) {
                console.log(err)
              }
          }
          const getStates = async () => {
            let isMounted = true;
            const controller = new AbortController();
            setIsReservationsPending(true);
            try {
                const response = await axios.get(STATES_URL, {
                        signal: controller.signal, //cancel the request if we need to    
                        headers: {'accept': 'application/json'} // include the accept header
                    },    
                );    
                console.log(response.data);
                isMounted && setStates(response.data);
            } catch (err) {
              console.log(err)
            }
        }
            useEffect(() => {
              let isMounted = true;
              const controller = new AbortController(); //cancel the request when the comp unmounts
          
              getSportsType();
              getStates();
              return () => {
                  isMounted = false; 
                  controller.abort(); 
              }
          }, [])


        const columns = [];

        if (!isMobile) {
          columns.push(
            { field: 'id',  headerName:'ID', width: 70 },
            { field: 'sportsName',  headerName:'Sports Type', width: 300 },
            {
              field: 'floorTypes',
              headerName: 'Floor Types',
              width: 500,
              height: 520,
              renderCell: (params) => <pre>{params.value}</pre>,
            }
          );
        }
        
        columns.push(  
          {
            field: 'actions',
            headerName: 'Actions',
            width: isMobile ? '70vw' : 130,
            renderCell: (params) => (
            <>
              <Tooltip title="Add Floor Type">
                <IconButton
                  color="secondary"
                  /*onClick={() => handleReject(params.row.id)}*/
                  disabled={params.row.status === 'Cancelled'}
                  onClick={() => handleClickOpenAddFloorDialog(params.row.id, params.row.sportsName)}
                  >
                  {loadingRow === params.row.id ? (
                    <CircularProgress size={24} />
                  ) : (
                    <AddCircleIcon sx={{ color: 'green.main' }} />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete Sports Type">
                <IconButton
                  color="secondary"
                  /*onClick={() => handleReject(params.row.id)}*/
                  disabled={params.row.status === 'Cancelled'}
                  onClick={() => handleDelete(params.row.id)}
                >
                  {loadingRow === params.row.id ? (
                    <CircularProgress size={24} />
                  ) : (
                    <DeleteIcon sx={{ color: 'green.main' }} />
                  )}
                </IconButton>
              </Tooltip>
            </>

            ),
            disableColumnMenu: true 
          }
        );
        
        


        const handleAddFloorType = async (name, sportsTypeId) => {
          const ADD_FLOOR_URL = `/api/floor_types`;
        
          try {
            const response = await axiosPrivate.post(ADD_FLOOR_URL,
              JSON.stringify({
                floorName: name,
                sportsType: `/api/sports_types/${sportsTypeId}`
              }),
              {
                headers: {'Content-Type' : 'application/json'},
              }
            );
            setSnackbarOpen(true);   
            setErrMsg('');
            setSuccMsg('Floor Type Added Successfully!');
            setSuccess(true);
           
          } catch (err) {
  
            setIsPending(false);
            setErrMsg("Soory, An Error Occured");
            setSnackbarOpen(true); 
          }
          // Refresh data after rejecting
          getSportsType();
          setLoadingRow(null);
        };

        

        const handleDelete = async (id) => {
          setLoadingRow(id);
          const DELETE_SPORTS_TYPE = `/api/sports_types/${id}`;
        
          try {
            const response = await axiosPrivate.delete(DELETE_SPORTS_TYPE,
              {
                headers: {'Content-Type' : 'application/json'},
              }
            );
            setSnackbarOpen(true);   
            setErrMsg('');
            setSuccess(true);
            setSuccMsg('Sports Type Deleted Successfully!');

           
          } catch (err) {
            setIsPending(false);
            setErrMsg("Soory, An Error Occured");
            setSnackbarOpen(true); 
          }
          // Refresh data after rejecting
          getSportsType();
          setLoadingRow(null);
        };

        const handleAddSportsType = async (name) => {
          const ADD_SPORTS_TYPE_URL = `/api/sports_types`;
        
          try {
            const response = await axiosPrivate.post(ADD_SPORTS_TYPE_URL,
              JSON.stringify({
                SportsName: name,
              }),
              {
                headers: {'Content-Type' : 'application/json'},
              }
            );
            setSnackbarOpen(true);   
            setErrMsg('');
            setSuccMsg('Sports Type Added Succesfully!');
            setSuccess(true);
           
          } catch (err) {
  
            setIsPending(false);
            setErrMsg("Soory, An Error Occured");
            setSnackbarOpen(true); 
          }
          // Refresh data after rejecting
          getSportsType();
          setLoadingRow(null);
        };
       

        const [openAddSportsDialog, setOpenAddSportsDialog] = useState(false);
        const [sportsName, setSportsName] = useState('');
        
        const handleClickOpenAddSportsDialog = () => {
          setOpenAddSportsDialog(true);
        };
        
        const handleCloseAddSportsDialog = () => {
          setOpenAddSportsDialog(false);
        };
        

        const [openAddFloorDialog, setOpenAddFloorDialog] = useState(false);
        const [floorName, setFloorName] = useState('');
        const [selectedSportsType, setSelectedSportsType] = useState({ id: '', name: '' });

        const handleClickOpenAddFloorDialog = (id, name) => {
          setSelectedSportsType({ id, name });
          setOpenAddFloorDialog(true);
        };

        const handleCloseAddFloorDialog = () => {
          setOpenAddFloorDialog(false);
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
                        <Typography variant="h6" textAlign="left" sx={{ color: "green.main", marginBottom:'10px'}}> Sports Types</Typography>
                        <Tooltip title="Add Sports Type">
                        <StyledButton
                            onClick={handleClickOpenAddSportsDialog}
                          startIcon={<AddCircleIcon sx={{ color:  'white.main' }} />}
                          variant="contained"
                          sx={{color:'green.main', marginBottom:'10px'}}
                        >
                          {isPending ? (
                            <CircularProgress size={24} />
                          ) : (
                            <Typography sx={{ color:  'white.main' }}>Add Sports Type</Typography>
                          )}
                        </StyledButton>
                      </Tooltip>
                    </Box>
                        <div style={{ height: 500, width: '100%' }}>
                        {!isReservationsPending ? (
                            <DataGrid
                                sx={{ bgcolor: 'white.main'}}
                                rows={sportsTypes}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                    paginationModel: { page: 0, pageSize: 10 },
                                    },
                                }}
                                pageSizeOptions={[5, 10]}
                                rowHeight={100}
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

                        <Dialog open={openAddSportsDialog} onClose={handleCloseAddSportsDialog}>
                          <DialogTitle sx={{ backgroundColor: 'green.main', color: 'white.main' }}>Add Sports Type</DialogTitle>
                          <DialogContent sx={{ backgroundColor: 'white.main', marginTop:'10px' }}>
                            <DialogContentText>
                              Please enter the name of the sports type you want to add.
                            </DialogContentText>
                            <TextField
                              autoFocus
                              margin="dense"
                              label="Sports Name"
                              type="text"
                              fullWidth
                              variant="outlined"
                  
                              value={sportsName}
                              onChange={(e) => setSportsName(e.target.value)}
                            />
                          </DialogContent>
                          <DialogActions sx={{ backgroundColor: 'white.dark' }}>
                          <Button onClick={handleCloseAddSportsDialog} color="primary">
                            Cancel
                          </Button>
                          <Button onClick={() => {handleAddSportsType(sportsName); handleCloseAddSportsDialog();}} color="primary">
                            Add
                          </Button>       
                          </DialogActions>
                        </Dialog>


                        <Dialog open={openAddFloorDialog} onClose={handleCloseAddFloorDialog}>
                          <DialogTitle sx={{ backgroundColor: 'green.main', color: 'white.main' }}>Add Floor Type</DialogTitle>
                          <DialogContent sx={{ backgroundColor: 'white.main', marginTop:'10px' }}>
                            <DialogContentText>
                              Please enter the name of the floor type you want to add.
                            </DialogContentText>
                            <TextField
                              autoFocus
                              margin="dense"
                              label="Floor Name"
                              type="text"
                              fullWidth
                              variant="outlined"
                              value={floorName}
                              onChange={(e) => setFloorName(e.target.value)}
                            />
                            <Typography variant="body1">
                              Selected Sports Type: {selectedSportsType.name}
                            </Typography>
                          </DialogContent>
                          <DialogActions sx={{ backgroundColor: 'white.dark' }}>
                            <Button onClick={handleCloseAddFloorDialog} color="primary">
                              Cancel
                            </Button>
                            <Button onClick={() => {handleAddFloorType(floorName, selectedSportsType.id); handleCloseAddFloorDialog();}} color="primary">
                              Add
                            </Button>
                          </DialogActions>
                        </Dialog>
                </Box>
               
          </>


     );
}
 
export default SportsType;