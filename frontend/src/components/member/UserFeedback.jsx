import { Alert, Avatar, Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Rating, Snackbar, TextField, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../Navbar";
import loginbg from '../../assets/herobg.png'
import { styled } from "@mui/material";
import useAuth from "../../Hooks/useAuth";
import React, { useEffect, useState } from "react";
import axios, { axiosPrivate } from "../../api/axios";
import { useNavigate } from "react-router-dom/dist";
import CancelIcon from '@mui/icons-material/Cancel';
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import FeedbackIcon from '@mui/icons-material/Feedback';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Footer from "../homePage/Footer";


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

const UserFeedback = () => {
    const theme = useTheme(); //using the the Material-UI theme object, which is provided by the useTheme hook from Material-UI.
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // checking if device is mobile

    const [ isPending, setIsPending ] = useState(false);

    //for the ERRORS AND SUCCESS
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();


    const { auth, setAuth } = useAuth();
    const user_id = auth.userId;


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
        feedbackText: reviewFormData.reviewText,
        feedbackStar: reviewStar,
        owner: `/api/users/${auth.userId}`,
      };
  
      // Make the POST request to create the review
      const response = await axiosPrivate.post('/api/feedback', review, {
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
     
      setFeedbackOpen(true);    
      handleFetchReviews();
    } catch (error) {
        setIsPending(false);
      setReviewOpen(false);
      setReviewFormData({
        reviewText: '',
        reviewStar: 0
      });
    
      setFeedbackOpen(true);
    }
  };

  const handleFetchReviews = async () => {
    try {
      setIsPendingReview(true);  
      const response = await axios.get(`/api/feedback`);
      setReviews(response.data['hydra:member']);  
      setIsPendingReview(false);  
      setOpenReviewsModal(true);
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
            <Navbar />
            <StyledModal>
                {!isPendingReview ? (
                <Box 
                sx={{
                overflow: 'auto', // Make box scrollable
                position: "relative",  
                bgcolor: "background.default",
                color: "text.primary",
                padding: 3,
                borderRadius: 2,
                border: `1px solid ${theme.palette.green.main}`, // Add border property
                //'& > *': { marginBottom:'10px' },
                width: isMobile ? '80vw' : '80vw', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
                height: isMobile ? '80vh' : 'auto', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
                }}
                >   
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            justifyContent: 'space-between',
                            alignItems: isMobile ? 'center' : 'flex-start',
                            marginBottom: '2px',
                        }}
                    >
                        <Typography variant="h6" textAlign="left" sx={{ color: "green.main", marginBottom:'2px' }}>
                            Clients Feedbacks
                        </Typography>
                        {auth.username && (
                            <Button
                                sx={{ color: 'green.main', marginTop: isMobile ? '10px' : '0px' }}
                                variant="outlined"
                                onClick={handleReviewOpen}
                                startIcon={<FeedbackIcon />}
                            >
                               Share Your Experience
                            </Button>
                        )}
                    </Box>
                    <Typography variant="h5" textAlign="left" sx={{ color: "grey.main", marginBottom:'10px', textAlign:'center'}}>They Trust Us!</Typography>


                    <Grid container spacing={3}>
                        {reviews.map((review) => (
                        <Grid item xs={12} sm={6} md={3} key={review.id}>
                            <Card sx={{ minWidth: 275, border: '1px solid #ccc', borderRadius: '8px', marginBottom:'10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', marginRight: '10px' }}>
                                        {review.owner.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography variant="subtitle1">{review.owner.username}</Typography>
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

                     <Dialog 
                    open={reviewOpen} 
                    onClose={handleReviewClose}
                    >
                        <DialogTitle>
                            <Typography variant="h5" sx={{ color: 'green.main' }}>
                            Feel Free To share Your Experience With Us!
                            </Typography>
                        </DialogTitle>
                        <DialogContent sx={{ width: isMobile ? '280px' : '500px' }}>
                            <Typography variant="subtitle1" color="text.secondary" sx={{ marginBottom: '10px' }}>
                            Opinion:
                            </Typography>
                            <TextField
                            required
                            sx={{ width: isMobile ? '280px' : '500px' }}
                            label="Opinion Text"
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
                                Rating:
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
                                "Submit"
                            )}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={feedbackOpen} onClose={handleFeedbackClose}>
                    <DialogTitle>
                        <Typography variant="h5" sx={{ color: 'green.main' }}>Thank You!</Typography>
                    </DialogTitle>
                    <DialogContent sx={{ width: isMobile ? '280px' : '500px' }}>
                    <Typography variant='body2'>We will always try to improve you experience here! </Typography> 
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleFeedbackClose} autoFocus>
                        Close
                        </Button>
                    </DialogActions>
                    </Dialog>


                </Box>
                ) : (
                    <CircularProgress sx={{ color:"green.main" }} />
                )}
            </StyledModal>
            <Footer />
        </>
     );
}
 
export default UserFeedback;