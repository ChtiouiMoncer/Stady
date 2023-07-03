import { Alert, Avatar, Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Rating, Snackbar, TextField, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../Navbar";
import loginbg from '../../assets/herobg.png'
import { styled } from "@mui/material";
import useAuth from "../../Hooks/useAuth";
import React, { useEffect, useState } from "react";
import axios, { axiosPrivate } from "../../api/axios";
import { Link as RouterLink, useNavigate} from "react-router-dom";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import EastIcon from '@mui/icons-material/East';

const StyledModal = styled(Box) (({ theme }) => ({

    //backgroundColor: theme.palette.green.main,
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',
  }));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: '8px',
    marginBottom: '8px',
    padding:'10px',
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


const MiniUserFeedback = () => {
    const theme = useTheme(); //using the the Material-UI theme object, which is provided by the useTheme hook from Material-UI.
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // checking if device is mobile
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { auth, setAuth } = useAuth();

    //REVIEW 
    const [reviews, setReviews] = useState([]);
    const [isPendingReview, setIsPendingReview] = useState(false);


  const handleFetchReviews = async () => {
    try {
      setIsPendingReview(true);  
      const response = await axios.get(`/api/feedback`);
      setReviews(response.data['hydra:member']);  
      setIsPendingReview(false);  
    } catch (error) {
      // Handle error (e.g., show an error message)
    }
  };

   //Load FeedBacks Data  
   useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    setTimeout(() => {
        handleFetchReviews();
    }, 1000);
    return () => {
        isMounted = false; 
        controller.abort();
    }
}, [])
  
        

    
    return ( 
        <>
            <StyledModal>
                {!isPendingReview ? (
                <Box 
                sx={{
                bgcolor: "background.default",
                color: "text.primary",
                padding: 3,
                width: isMobile ? '80vw' : '80vw', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
                height: isMobile ? 'auto' : 'auto', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
                }}
                >   
                    <Box
                    sx={{
                        display:'flex',
                        alignItems: 'center',
                        justifyContent:'center',
                        marginBottom: '10px',
                    }}
                    >
                        <Typography variant="h5" sx={{ color: "grey.main", marginBottom:'10px' }}>
                            What  
                            <Typography variant="h5" component="span" sx={{color:'green.main'}}>
                            {" "}Stady{" "}
                            </Typography>
                            users are saying
                        </Typography>
                    </Box>



                    <Grid container justifyContent="center" spacing={2}>
                        {reviews.slice(0, 3).map((review) => (
                            <Grid item xs={12} sm={6} md={4} key={review.id}>
                                <Card sx={{ minWidth: 275,  marginBottom:'10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                            <Avatar sx={{ bgcolor: 'primary.main', marginRight: '10px', marginBottom:'4px' }}>
                                                {review.owner.username.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Typography variant="subtitle1" sx={{color:'grey.main'}}>{review.owner.username}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                            <Typography variant="body1" sx={{ margin:'10px 10px', textAlign: 'center' }}>{review.feedbackText}</Typography>
                                            <Rating name="read-only" sx={{ margin:'5px'}} value={review.feedbackStar} readOnly />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box
                    sx={{
                        display:'flex',
                        alignItems: 'center',
                        justifyContent:'center',
                        marginBottom: '10px',
                        marginTop:'10px'
                    }}
                    >
                        <StyledButton
                        component={RouterLink}
                        to="/stady/feedback"
                        color="primary"
                        endIcon={<EastIcon />}
                        >                     
                        Sell All
            
                        </StyledButton>
                    </Box>
                </Box>
                ) : (
                    <CircularProgress sx={{ color:"green.main" }} />
                )}
            </StyledModal>
        </>
     );
}
 
export default MiniUserFeedback;