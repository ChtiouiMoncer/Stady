import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, ImageList, ImageListItem, ImageListItemBar, List, ListItem, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPrivate from "../../../../Hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { Google } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import StopIcon from '@mui/icons-material/Stop';

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




const PitchesApproval = () => {

    //Images
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleOpenImageDialog = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenImageDialog(true);
    };

    const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    };


    const handleOpenInfo = async (id) => {
        const response = await axiosPrivate.get(`/api/grounds/${id}`);
        setSelectedPitch(response.data);
      }

    const theme = useTheme(); 

    //users data state
    const [pitches, setPitches] = useState([]);

    //auth context  
    const { auth, setAuth } = useAuth();
  
    // axios private (with Token Bearer)
    const axiosPrivate = useAxiosPrivate();
  
    //react dom
    const navigate = useNavigate();

    //REFRESH TOKEN ENDPOINT
    const [page, setPage] = useState(1);
    const PITCHES_URL = `/api/grounds?page=${page}&isApproved=true`;


    //for LOADING from the server
    const [ isPitchesPending, setPitchesPending ] = useState(false);
    const [loadingRow, setLoadingRow] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [operationType, setOperationType] = useState(null); // 'delete' or 'pause'

    const [ isPending, setIsPending ] = useState(false);

    //for the ERRORS AND SUCCESS
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [selectedPitch, setSelectedPitch] = useState(null);

    const handlePause = async (id) => {
        setOperationType('pause');
        setLoadingRow(id);
        const PATCH_PITCH_URL = `/api/grounds/${id}`;
      
        try {
          const response = await axiosPrivate.patch(PATCH_PITCH_URL,
            JSON.stringify({
                isPaused: true,
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
        }
        // Refresh data after rejecting
        getPitches();
        setLoadingRow(null);
      };

   const handleDelete = async (id) => {
    setOperationType('delete');
    setLoadingRow(id);
    const DELETE_PITCH_URL = `/api/grounds/${id}`;

    try {
        const response = await axiosPrivate.delete(DELETE_PITCH_URL,
        {
            headers: {'Content-Type' : 'application/json'},
        }
        );
        setSnackbarOpen(true); 
        setErrMsg('');
        setSuccess(true);
    } catch (err) {
        setSnackbarOpen(true); 
        setIsPending(false);
        setSuccess(false);     
        if (err?.response?.data['hydra:description'] === "Cannot delete Pitch. There are active reservations associated with it.") {
            setErrMsg("Cannot delete a pitch that has a reservation");
        } else {
        setErrMsg("An error occurred while deleting the pitch.");
        }
    }
    // Refresh data after accepting
    getPitches();
    setLoadingRow(null);
};
      
      

    const getPitches = async (page = 1) => {
        let isMounted = true;
        const controller = new AbortController();
        setPitchesPending(true);
        try {
            const response = await axiosPrivate.get(PITCHES_URL, {
                    signal: controller.signal,
                    headers: {'accept': 'application/json'}      
                }
            );
            
            if (isMounted) {
                console.log(response?.data);
                setPitches(
                    response.data.map(pitch => ({
                        id: pitch.id,
                        pitchName: pitch.name,
                        sportsType: pitch.sportsType.SportsName,
                        floorType: pitch.floorType.floorName,
                        state: pitch.state.name,
                        createdAt: pitch.createdAt,
                        owner: pitch.owner.username,
                        size: pitch.size,
                        phone: pitch.phoneNumber,
                        capacity: pitch.capacity,
                        generation: pitch.isPaused,
                        info: "Info",
                        actions: "Actions" 
                    }))
                );
                
            }
            setPitchesPending(false);

        } catch (err) {
            if (err?.response?.status === 401 && err?.response?.data?.message === "Invalid JWT Refresh Token") {
                navigate('/login', {replace: true} );
            }              
        }
    }


    //Load Pitches Data  
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        setTimeout(() => {
            getPitches();
        }, 1000);
        return () => {
            isMounted = false; 
            controller.abort();
            }
    }, [page])


    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'pitchName', headerName: 'Pitch name', width: 140 },
        { field: 'sportsType', headerName: 'Sports Type', width: 100 },
        { field: 'floorType', headerName: 'Floor Type', width: 130 },
        { field: 'state', headerName: 'State', width: 90 },
        { field: 'size', headerName: 'Size ', width: 100 },
        { field: 'capacity', headerName: 'Capacity ', width: 80 },
        { field: 'owner', headerName: 'Owner ', width: 100 },
        { field: 'phone', headerName: 'Phone ', width: 120 },
        { field: 'generation', headerName: 'Timeslots', width: 120 },

        {
            field: 'actions',
            headerName: 'Actions',
            width: 130,
            renderCell: (params) => (
              <>
                <Tooltip title="Delete">
                    <IconButton color="primary" onClick={() => handleDelete(params.row.id)}>
                    {loadingRow === params.row.id ? <CircularProgress size={24} /> : <DeleteIcon sx={{ color: 'grey.main'}} />}
                    </IconButton>
                </Tooltip> 
                <Tooltip title="Stop TimeSlots Generation">
                    <IconButton color="secondary" onClick={() => handlePause(params.row.id)}>
                    {loadingRow === params.row.id ? <CircularProgress size={24} /> : <StopIcon sx={{color:'grey.main'}} />}
                    </IconButton>
                </Tooltip> 

              </>
              
            ),
        },
        { field: 'info', headerName: 'Informations', width: 120, renderCell: (params) => (
            <StyledButton onClick={() => handleOpenInfo(params.row.id)}>INFO</StyledButton>
        )},
    ];
  

    return ( 
        <Box flex={8}
        sx={{   
            m: 4, 
            marginTop: 4,
            border: `2px solid ${theme.palette.green.main}`, // Add border property    
            bgcolor: "white.light",
            padding: 3,
            borderRadius: 2,
        }}
           
        >
        <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => {
            setSnackbarOpen(false);
            setOperationType(null); // reset operation type when Snackbar is closed
        }}
        >
            <Alert
                onClose={() => {
                setSnackbarOpen(false);
                setOperationType(null); // reset operation type when Snackbar is closed
                }}
                severity={success ? "success" : "error"}
            >
                {success ? (
                operationType === 'delete' ? 'Pitch deleted successfully!' : 'Pitch paused successfully!'
                ) : errMsg}
            </Alert>
        </Snackbar>

            <Box sx={{ display: "flex",  justifyContent: "space-between", marginBottom:'10px'}}>
                <Typography variant="h6" textAlign="left" sx={{ color: "green.main" }}>
                    Approved Pitches
                </Typography>
               
            </Box>

            <div style={{ height: 500, width: '100%' }}>

            {!isPitchesPending ? (
                        <DataGrid
                            sx={{ bgcolor: 'white.main'}}
                            rows={pitches}
                            columns={columns}
                            initialState={{
                                pagination: {
                                  paginationModel: { page: 0, pageSize: 5 },
                                },
                              }}
                            pageSizeOptions={[5, 10]}
                            //checkboxSelection
                        />
                        ) : (
                        
                            <CircularProgress sx={{ color:"green.main" }} />
                )}
            </div>

            <Dialog
                open={selectedPitch !== null}
                onClose={() => setSelectedPitch(null)}
                fullWidth={true} // Make the dialog take up the full width of the screen
                maxWidth="md" // Set the maximum width of the dialog. You can use "xs", "sm", "md", "lg", or "xl"
            >
                <DialogTitle><Typography sx={{ fontSize: "15px", color: "grey.main", fontWeight: 600 }} >Pitch Details</Typography></DialogTitle>
                <DialogContent>
                    {selectedPitch && (
                        <>
                            <Typography variant="h6" textAlign="left" sx={{ color: "green.main" }}>{selectedPitch.name}</Typography>
                            <Grid
                            container
                            direction="row"
                            spacing={4}
                            sx={{ margin:1 }}
                            >
                                
                                <Grid item xs>
                                    <Typography sx={{ fontSize: "15px", color: "grey.main", fontWeight: 600 }} >Basic Details:</Typography>
                                    {/* Pitch Basic Info */}
                                    <Typography variant="h5" textAlign="left" sx={{ color: "grey.dark", fontWeight: 500  }}>-Sports Type : {selectedPitch.sportsType.SportsName}</Typography>
                                    <Typography variant="h5" textAlign="left" sx={{ color: "grey.dark", fontWeight: 500  }}>-Floor Type : {selectedPitch.floorType.floorName}</Typography>
                                    <Typography variant="h5" textAlign="left" sx={{ color: "grey.dark", fontWeight: 500  }}>-Capacity : {selectedPitch.capacity}</Typography>
                                    <Typography variant="h5" textAlign="left" sx={{ color: "grey.dark", fontWeight: 500  }}>-Size : {selectedPitch.size}</Typography>
                                    <Typography variant="h5" textAlign="left" sx={{ color: "grey.dark", fontWeight: 500  }}>-State : {selectedPitch.state.name}</Typography>
                                    <Typography variant="h5" textAlign="left" sx={{ color: "grey.dark", fontWeight: 500  }}>-Created At : {selectedPitch.createdAt}</Typography>
                                    <Typography variant="h5" textAlign="left" sx={{ color: "grey.dark", fontWeight: 500  }}>-Phone : {selectedPitch.phoneNumber}</Typography>
                                    <Typography variant="h5" textAlign="left" sx={{ color: "grey.dark", fontWeight: 500  }}>-Owner : {selectedPitch.owner.username}</Typography>
                                    <Typography variant="h5" textAlign="left" sx={{ color: "grey.dark", fontWeight: 500  }}>-Description : {selectedPitch.description}</Typography>
                                </Grid>

                                <Divider orientation="vertical" flexItem sx={{ margin: '15px' }} />

                                <Grid item xs>
                                {/* Amenities */}
                                    <Typography sx={{ fontSize: "15px", color: "grey.main", fontWeight: 600 }} >Amenities:</Typography>
                                    <List>
                                        <ListItem>
                                            <Typography variant="h5" textAlign="left" sx={{ color: "grey.dark", fontWeight: 500  }}>
                                                Shower: {selectedPitch.amenties.hasShower ? <CheckCircleIcon sx={{marginBottom:'-5px'}} style={{ color: 'green' }} /> : <CancelIcon sx={{marginBottom:'-5px'}} style={{ color: 'red' }} />}
                                            </Typography>
                                        </ListItem>

                                        <ListItem>
                                            <Typography variant="h5" textAlign="left" sx={{ color: "grey.dark", fontWeight: 500  }}>
                                                Secure Storage: {selectedPitch.amenties.hasSecureStorage ? <CheckCircleIcon sx={{marginBottom:'-5px'}} style={{ color: 'green' }} /> : <CancelIcon sx={{marginBottom:'-5px'}} style={{ color: 'red' }} />}
                                            </Typography>

                                        </ListItem>

                                        <ListItem>
                                            <Typography variant="h5" textAlign="left" sx={{ color: "grey.dark", fontWeight: 500  }}>
                                                Changing Room: {selectedPitch.amenties.hasChangingRoom ? <CheckCircleIcon sx={{marginBottom:'-5px'}} style={{ color: 'green' }} /> : <CancelIcon sx={{marginBottom:'-5px'}} style={{ color: 'red' }} />}
                                            </Typography>
                                        </ListItem>

                                        <ListItem>
                                            <Typography variant="h5" textAlign="left" sx={{ color: "grey.dark", fontWeight: 500  }}>
                                                Restaurant: {selectedPitch.amenties.hasRestaurent ? <CheckCircleIcon sx={{marginBottom:'-5px'}} style={{ color: 'green' }} /> : <CancelIcon sx={{marginBottom:'-5px'}} style={{ color: 'red' }} />}
                                            </Typography>

                                        </ListItem>

                                        <ListItem>
                                            <Typography variant="h5" textAlign="left" sx={{ color: "grey.dark", fontWeight: 500  }}>
                                                Parking: {selectedPitch.amenties.hasParking ? <CheckCircleIcon sx={{marginBottom:'-5px'}} style={{ color: 'green' }} /> : <CancelIcon sx={{marginBottom:'-5px'}} style={{ color: 'red' }} />}
                                            </Typography>
                                        </ListItem>
                                    </List>                            
                                </Grid>


                                <Grid item xs={10}>
                                    <Typography sx={{ fontSize: "15px", color: "grey.main", fontWeight: 600, paddingBottom:'-10px' }} >Location:</Typography>
                                    {selectedPitch?.address && (
                                         <Button 
                                         variant="outlined" 
                                         startIcon={<Google />}
                                         href={`https://www.google.com/maps/?q=${selectedPitch.address.latitude},${selectedPitch.address.longitude}`}
                                         target="_blank" 
                                         rel="noopener noreferrer"
                                       >
                                         View on Google Maps
                                       </Button>
                                    )}
                                </Grid>
                            </Grid>

                            <Grid
                            container
                            direction="row"
                            spacing={4}
                            sx={{ margin:1 }}
                            >                                
                                <Grid item xs={11}>
                                <Typography sx={{ fontSize: "15px", color: "grey.main", fontWeight: 600, paddingBottom:'-10px' }} >Opening Times:</Typography>
                                {/* Opening Times */}
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                        <TableCell>Day</TableCell>
                                        <TableCell align="right">Closed</TableCell>
                                        <TableCell align="right">Open Time</TableCell>
                                        <TableCell align="right">Close Time</TableCell>
                                        <TableCell align="right">Interval</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedPitch?.openingTimes.map((time) => (
                                        <TableRow key={time.day}>
                                            <TableCell component="th" scope="row">
                                            {time.day}
                                            </TableCell>
                                            <TableCell align="right">
                                            {time.isClosed ? <CancelIcon /> : <CheckCircleIcon />}
                                            </TableCell>
                                            <TableCell align="right">{time.isClosed ? '-' : time.openTime}</TableCell>
                                            <TableCell align="right">{time.isClosed ? '-' : time.closeTime}</TableCell>
                                            <TableCell align="right">{time.interval} MIN</TableCell>
                                            <TableCell align="right">{time.price} DT</TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                    </Table>
                                </TableContainer>
                                </Grid>        
                            </Grid>

                            <Grid
                            container
                            direction="row"
                            spacing={4}
                            sx={{ margin:1 }}
                            >
                            
                                <Grid item xs={10}>
                                    <Typography sx={{ fontSize: "15px", color: "grey.main", fontWeight: 600, paddingBottom:'-10px' }} >Images:</Typography>
                                    {/* Images */}
                                    {selectedPitch?.images && (
                                        <ImageList sx={{ width: 500, height: 450 }} cols={3} gap={15}>
                                            {selectedPitch.images.map((image) => (
                                                <ImageListItem key={image.contentUrl}>
                                                <img
                                                    src={`http://127.0.0.1:8000${image.contentUrl}`}
                                                    alt={image.contentUrl}
                                                    loading="lazy"
                                                />
                                                <ImageListItemBar
                                                    actionIcon={
                                                    <IconButton
                                                        edge="end"
                                                        color="inherit"
                                                        onClick={() => handleOpenImageDialog(`http://127.0.0.1:8000${image.contentUrl}`)}
                                                    >
                                                        <ZoomInIcon sx={{ color: 'white.main'}} />
                                                    </IconButton>
                                                    }
                                                    title={image.contentUrl.split("/").pop()}
                                                />
                                                </ImageListItem>
                                            ))}
                                        </ImageList>
                                    )}
                                </Grid>
                                {/* Image Dialog */}
                                <Dialog open={openImageDialog} onClose={handleCloseImageDialog}>
                                <img src={selectedImage} alt={selectedImage} style={{ width: '100%', height: 'auto' }} />
                                </Dialog>
                            </Grid> 

                                                             
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedPitch(null)} color="primary">
                    Close
                    </Button>
                </DialogActions>
                </Dialog>

        </Box>
                            
     );
}
 
export default PitchesApproval;