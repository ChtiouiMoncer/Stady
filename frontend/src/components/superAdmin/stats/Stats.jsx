import { Alert, Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Grow, IconButton, Snackbar, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
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
import Chart from 'chart.js/auto'; 
import { Bar, Doughnut } from 'react-chartjs-2'; 


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

const Stats = () => {
    const { t } = useTranslation();

    const theme = useTheme(); //using the the Material-UI theme object, which is provided by the useTheme hook from Material-UI.
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // checking if device is mobile


    //for the ERRORS AND SUCCESS
    const [errMsg, setErrMsg] = useState('');
    const [succMsg, setSuccMsg] = useState('');
    const [ isPending, setIsPending ] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();


    const { auth, setAuth } = useAuth();
    const user_id = auth.userId;

  
  

    //Stats data state
    const [sportsTypeCount, setSportsTypeCount] = useState(0);
    const [floorTypeCount, setFloorTypeCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);
    const [pitchesCount, setPitchesCount] = useState(0);
    const [feedbakcsCount, setFeedbakcsCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [approvedCount, setApprovedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
    const [pitchesData, setPitchesData] = useState([]);
    const [totalReservations, setTotalReservations] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [cancelledReservations, setCancelledReservations] = useState(0);
    const [totalTimeSlots, setTotalTimeSlots] = useState(0);

      // Initialize the counts
      let footballCount = 0;
      let tennisCount = 0;
      let basketballCount = 0;
      let handballCount = 0;
  
      // Iterate over the pitches data
      pitchesData.forEach(pitch => {
        // Increment the count for the sport type of the current pitch
        switch(pitch.sportsType.SportsName) {
          case 'Football':
            footballCount++;
            break;
          case 'Tennis':
            tennisCount++;
            break;
          case 'Basketball':
            basketballCount++;
            break;
          case 'Handball':
            handballCount++;
            break;
          default:
            break;
        }
      });
  
      let activePitchesCount = 0;
      let inactivePitchesCount = 0;
      
      for(let i = 0; i < pitchesData.length; i++) {
          if(pitchesData[i].isPaused) {
              inactivePitchesCount += 1;
          } else {
              activePitchesCount += 1;
          }
      }

    //sportsType ENDPOINT
    const SPORTS_TYPES_URL = '/api/sports_types'
    const STATES_URL = '/api/floor_types'

    const getSportsType = async () => {
            let isMounted = true;
            const controller = new AbortController();
            setIsPending(true);
            try {
                  const response = await axios.get(SPORTS_TYPES_URL, {
                          signal: controller.signal, //cancel the request if we need to    
                          headers: {'accept': 'application/json'} // include the accept header
                      },    
                  );    
                  if (isMounted) {
                    setSportsTypeCount(response.data.length)
                    
                }
                setIsPending(false);               
              } catch (err) {
                console.log(err)
              }
    }


    const getStates = async () => {
            let isMounted = true;
            const controller = new AbortController();
            setIsPending(true);
            try {
                const response = await axios.get(STATES_URL, {
                        signal: controller.signal, //cancel the request if we need to    
                        headers: {'accept': 'application/json'} // include the accept header
                    },    
                );    
                if (isMounted) {
                  setFloorTypeCount(response.data.length);
                }
                setIsPending(false);               
            } catch (err) {
              console.log(err)
            }
    }

    const getPitches = async () => {
            let isMounted = true;
            const controller = new AbortController();
            setIsPending(true);
            try {
                const response = await axios.get('/api/grounds', {
                        signal: controller.signal, //cancel the request if we need to    
                        headers: {'accept': 'application/json'} // include the accept header
                    },    
                );    
                if (isMounted) {
                  setPitchesCount(response.data.length);
                  setPitchesData(response.data); 

                }
                setIsPending(false);               
            } catch (err) {
              console.log(err)
            }
    }

    const getFeedBacks = async () => {
      let isMounted = true;
      const controller = new AbortController();
      setIsPending(true);
      try {
          const response = await axios.get('/api/feedback', {
                  signal: controller.signal, //cancel the request if we need to    
                  headers: {'accept': 'application/json'} // include the accept header
              },    
          );    
          if (isMounted) {
            setFeedbakcsCount(response.data.length);
          }
          setIsPending(false);               
      } catch (err) {
        console.log(err)
      }
    }

    const getUsers = async () => {
      let isMounted = true;
      const controller = new AbortController();
      setIsPending(true);
      try {
          const response = await axiosPrivate.get('/api/users', {
                  signal: controller.signal, //cancel the request if we need to    
                  headers: {'accept': 'application/json'} // include the accept header
              },    
          );    
          if (isMounted) {
            setUsersCount(response.data.length);
          }
          setIsPending(false);               
      } catch (err) {
        console.log(err)
      }
    }

    const getPitchesStatus = async () => {
      let isMounted = true;
      const controller = new AbortController();
      setIsPending(true);
      try {
          const response = await axios.get('/api/grounds', {
                  signal: controller.signal, //cancel the request if we need to    
                  headers: {'accept': 'application/json'} // include the accept header
              },    
          );    
          if (isMounted) {
            // assume response.data is an array of grounds
            const grounds = response.data;
            // Count the number of each status
            const pending = grounds.filter(ground => ground.isPending).length;
            const approved = grounds.filter(ground => ground.isApproved).length;
            const rejected = grounds.filter(ground => ground.isRejected).length;
    
            // Update state
            setPendingCount(pending);
            setApprovedCount(approved);
            setRejectedCount(rejected);
          }
          setIsPending(false);               
      } catch (err) {
        console.log(err)
      }
    }

    const getReservations = async () => {
      let isMounted = true;
      const controller = new AbortController();
      setIsPending(true);
      try {
          const response = await axiosPrivate.get('/api/reservations', {
                  signal: controller.signal, //cancel the request if we need to    
                  headers: {'accept': 'application/json'} // include the accept header
              },    
          );    
          if (isMounted) {
            // assume response.data is an array of reservations
            const reservations = response.data;
    
            // Calculate the total reservations
            setTotalReservations(reservations.length);
    
            // Calculate the total revenue
            let revenue = 0;
            reservations.forEach(reservation => {
              revenue += reservation.totalPrice;
            });
            setTotalRevenue(revenue);
    
            // Count the number of cancelled reservations
            const cancelled = reservations.filter(reservation => reservation.isCancelled).length;
            setCancelledReservations(cancelled);
    
            // Count the total timeslots
            let timeslots = 0;
            reservations.forEach(reservation => {
              timeslots += reservation.timeSlots.length;
            });
            setTotalTimeSlots(timeslots);
          }
          setIsPending(false);               
      } catch (err) {
        console.log(err)
      }
    }
    


    useEffect(() => {

              let isMounted = true;
              const controller = new AbortController(); //cancel the request when the comp unmounts
              getSportsType();
              getStates();
              getUsers();
              getPitches();
              getFeedBacks();
              getPitchesStatus();
              getReservations();
              return () => {
                  isMounted = false; 
                  controller.abort(); 
              }
    }, [])


    const data = {
      labels: ['Pending', 'Approved', 'Rejected'],
      datasets: [
        {
          data: [pendingCount, approvedCount, rejectedCount],
          backgroundColor: ['#FFA726', '#66BB6A', '#EF5350'],
          hoverBackgroundColor: ['#FFB74D', '#81C784', '#E57373']
        }
      ]
    };    
    
    const sportsTypeData = {
      labels: ['Football', 'Tennis', 'Basketball', 'Handball'],
      datasets: [
        {
          label: 'Pitches Sports Type',
          data: [footballCount, tennisCount, basketballCount, handballCount],
          backgroundColor: [
            'rgba(219, 68, 55, 0.2)',  // Red for Football
            'rgba(15, 157, 88, 0.2)',  // Green for Tennis
            'rgba(255, 193, 7, 0.2)',  // Yellow for Basketball
            'rgba(96, 125, 139, 0.2)'   // Blue Grey for Handball
          ],
          borderColor: [
            'rgba(219, 68, 55, 1)',    // Red for Football
            'rgba(15, 157, 88, 1)',    // Green for Tennis
            'rgba(255, 193, 7, 1)',    // Yellow for Basketball
            'rgba(96, 125, 139, 1)'     // Blue Grey for Handball
          ],
          borderWidth: 1,
        },
      ],
    };

    const pauseStatusData = {
      labels: ['Active', 'Inactive'],
      datasets: [
          {
              label: 'TimeSlots Generation Status',
              data: [activePitchesCount, inactivePitchesCount],
              backgroundColor: [
                  'rgba(76, 175, 80, 0.2)',  // Green for Active
                  'rgba(233, 30, 99, 0.2)'   // Pink for Inactive
              ],
              borderColor: [
                  'rgba(76, 175, 80, 1)',    // Green for Active
                  'rgba(233, 30, 99, 1)'     // Pink for Inactive
              ],
              borderWidth: 1,
          }
      ],
  };
    return ( 
      <>
      <Box
        flex={8}
        sx={{
          m: 4,
          marginTop: 4,
          border: `1px solid ${theme.palette.grey.light}`, // Add border property
          bgcolor: "white.light",
          padding: 3,
          borderRadius: 2,
          maxHeight: '90vh',
          width: isMobile ? '80vw' : '80vw', // use 90vw (90% of the width of the viewport) width for mobile devices, otherwise use 400px width
          overflow:'scroll',
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" textAlign="left" sx={{ color: "green.light", marginBottom: '10px' }}> Application Analytics & Stats</Typography>
        </Box>
        <Typography variant="h5" textAlign="center" sx={{ color: "grey.black", marginBottom: '10px' }}> Application Overview</Typography>

        <Box sx={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
          <Grid container spacing={2}>
            {[{
              title: "Total App Users",
              count: usersCount
            }, {
              title: "Total Pitches",
              count: pitchesCount
            }, {
              title: "Total FeedBacks",
              count: feedbakcsCount
            }, {
              title: "Sports Types",
              count: sportsTypeCount
            }].map((item, index) => (
              <Grid key={index} item xs={12} sm={3}>
                <Grow in={true} style={{ transformOrigin: '0 0 0' }} {...(true ? { timeout: 1000 } : {})}>
                  <Card sx={{ maxWidth: 345, minWidth: 250, margin: 2 }}>
                    <CardContent>
                      <Typography sx={{ color: 'grey.black' }} variant="h5" component="div">
                        {item.title}
                      </Typography>
                      <Typography sx={{ color: 'green.main' }} variant="h3" component="div">
                        {item.count}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Typography variant="h5" textAlign="center" sx={{ color: "grey.black", marginBottom: '10px' }}> Pitch Status Distribution </Typography>

    
        <Box sx={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
          <Grid container spacing={2}>
            
            <Grid item xs={12} sm={6} sx={{ margin: '5px' }}>
              <Doughnut
                data={data}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  aspectRatio: 1,
                  maintainAspectRatio: false, // this will allow custom size
                  aspectRatio: 1, // for a square chart
                  layout: {
                    padding: 0,
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'right',
                    },
                    title: {
                      display: true,
                      text: 'Pitches Status',
                    },
                  },
                }}
                style={{ maxHeight: '70vh', maxWidth: '70vw' }} // increase these values to make the chart bigger
                />
            </Grid>

            <Grid item xs={12} sm={5} sx={{ margin:'5px'}}>
              <Doughnut 
                data={sportsTypeData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // this allows you to define custom dimension properties
                  aspectRatio: 1, // you can adjust this to get your desired size,
                  layout: {
                    padding: 0,
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'right',
                    },
                    title: {
                      display: true,
                      text: 'Pitch Sports Category Breakdown',
                    },
                  },
                }}
                style={{ maxHeight: '50vh', maxWidth: '50vh' }} // you can adjust these values to your liking
              />
            </Grid>
            </Grid>

            <Grid container spacing={2}>
            <Grid item xs={12} sm={12} sx={{ margin:'15px'}}>
            <Bar 
              data={pauseStatusData} 
              options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                      legend: {
                          display: true,
                          position: 'right',
                      },
                      title: {
                          display: true,
                          text: 'TimeSlots Generation Status',
                      },
                  },
              }}
             
            />
            </Grid>

          </Grid>
        </Box>

        <Typography variant="h5" textAlign="center" sx={{ color: "grey.black", marginBottom: '10px' }}> Reservations Overview</Typography>

        <Box sx={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        <Grid container spacing={2}>
          {[
            {
              title: "Total Reservations",
              count: totalReservations
            },
            {
              title: "Total Revenue",
              count: `${totalRevenue} DT`
            },
            {
              title: "Cancelled Reservations",
              count: cancelledReservations
            },
            {
              title: "Total TimeSlots",
              count: totalTimeSlots
            }
          ].map((item, index) => (
            <Grid key={index} item xs={12} sm={3}>
              <Grow in={true} style={{ transformOrigin: '0 0 0' }} {...(true ? { timeout: 1000 } : {})}>
                <Card sx={{ maxWidth: 345, minWidth: 250, margin: 2 }}>
                  <CardContent>
                    <Typography sx={{ color: 'grey.black' }} variant="h5" component="div">
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: 'green.main' }} variant="h3" component="div">
                      {item.count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Box> 
        
    
      </Box>
      
    </>
     );
}
 
export default Stats;