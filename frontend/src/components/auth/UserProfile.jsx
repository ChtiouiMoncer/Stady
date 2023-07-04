import { Alert, Box, Button, CircularProgress, Grid, IconButton, Snackbar, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../Navbar";
import loginbg from "../../assets/herobg.png";
import { styled } from "@mui/material";
import useAuth from "../../Hooks/useAuth";
import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import Footer from "../homePage/Footer";
import SecurityUpdateIcon from '@mui/icons-material/SecurityUpdate';
import CloseIcon from '@mui/icons-material/Close';
import useLogout from "../../Hooks/useLogout";
import { InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";


const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: "20px",
  marginBottom: "8px",
  color: theme.palette.white.main,
  backgroundColor: theme.palette.green.main,
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.palette.green.light,
  },
  "&.MuiButton-focusVisible": {
    boxShadow: "none !important",
  },
}));

const StyledButtonDelete = styled(Button)(({ theme }) => ({
  marginTop: "20px",
  marginBottom: "8px",
  color: theme.palette.white.main,
  backgroundColor: theme.palette.green.main,
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.palette.error.main,
  },
  "&.MuiButton-focusVisible": {
    boxShadow: "none !important",
  },
}));

const StyledModal = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${loginbg})`,
  height: "95vh",
  backgroundSize: "cover",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
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
      boxShadow: "none !important",
    },
  },
  ".social-login": {
    borderColor: theme.palette.green.main,
    color: theme.palette.green.main,
    backgroundColor: theme.palette.white.main,
    textTransform: "none",
    "&:hover": {
      backgroundColor: theme.palette.green.light,
      color: theme.palette.white.main,
    },
    "& .MuiButton-startIcon": {
      position: "absolute",
      left: "20px",
    },
  },
}));

const UserProfile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const logout = useLogout();

  const [isUserPending, setIsUserPending] = useState(false);

  const [user, setUser] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { userName } = useParams();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const [isPending, setIsPending] = useState(false);
  const [isMethodPending, setIsMethodPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [succMsg, setSuccMsg] = useState('');


  const [emailValue, setEmailValue] = useState(user.email);
  const [usernameValue, setUsernameVlaue] = useState(user.username);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  const [isFormChanged, setIsFormChanged] = useState(false);
  const [oldPasswordValue, setOldPasswordValue] = useState('');

    const handleOldPasswordChange = (event) => {
    const value = event.target.value;
    setOldPasswordValue(value);
    };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmailValue(value);
    setIsFormChanged(true);
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPasswordValue(value);
    setIsFormChanged(true);
  };

  const handleUsernameChange = (event) => {
    const value = event.target.value;
    setUsernameVlaue(value);
    setIsFormChanged(true);
  };

  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const { auth, setAuth } = useAuth();
  const user_id = auth?.userId;

  const USER_URL = `/api/users/${user_id}`;

  const getUserInfo = async () => {
    let isMounted = true;
    const controller = new AbortController();
    setIsUserPending(true);
    try {
      const response = await axiosPrivate.get(USER_URL, {
        signal: controller.signal,
        headers: { accept: "application/json" },
      });

      if (isMounted) {
        console.log(response?.data);
        setUser(response?.data);
      }
      setIsUserPending(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    setTimeout(() => {
      getUserInfo();
    }, 1000);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  
  const handleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;
    setConfirmPasswordValue(value);
    setIsFormChanged(true);
    setConfirmPasswordValue(value);
    if (passwordValue !== value) {
      // Passwords don't match
      // Handle the error or show a message to the user
    }
  };

  const handleUpdate = async () => {
    const UPDATE_USER_URL = `/api/users/${user_id}`;
    setIsMethodPending(true);
    try {
      const response = await axiosPrivate.patch(
        UPDATE_USER_URL,
        JSON.stringify({
          email: emailValue,
          plainPassword: passwordValue,
          username: usernameValue
        }),
        {
          headers: { 'Content-Type': 'application/merge-patch+json' }
        }
      );
  
      // Check if the response status is successful
      if (response.status === 200) {
        setSuccess(true);
        setSuccMsg('Account Updated Successfully!');
        setSnackbarOpen(true);
        setErrMsg('');
        await logout();
      } else {
        setSuccess(false);
        setSuccMsg('');
        setSnackbarOpen(true);
      }
    } catch (err) {
      setIsMethodPending(false);
      setSuccess(false);
      setSuccMsg('');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteAccount = async () => {
    const DELETE_USER_URL = `/api/users/${user_id}`;
    setIsMethodPending(true);
    try {
      const response = await axiosPrivate.delete(DELETE_USER_URL, {
        headers: { 'Content-Type': 'application/json' },
      });
      setSuccess(true);
      setSuccMsg('Account Deleted Successfully!');
      setSnackbarOpen(true);
      setErrMsg('');
      await logout();  
    
    } catch (err) {
      setIsMethodPending(false);
      setSuccess(false);
      setSuccMsg('');
      if (
        err.response &&
        err.response.data &&
        err.response.data['hydra:description'] === "Cannot delete Pitch. There are active reservations associated with it."
      ) {
        setErrMsg("We can't delete an Account that has pitches with active reservations!");
      } else if (
        err.response &&
        err.response.data &&
        err.response.data['hydra:title'] === 'An error occurred' &&
        err.response.data['hydra:description'] &&
        err.response.data['hydra:description'].includes('Foreign key violation') &&
        err.response.data['hydra:description'].includes('reservation')
      ) {
        setErrMsg("You can't delete an account with ongoing reservations!");
      } else {
        setErrMsg('An error occurred. Please try again.');
      }
      setSnackbarOpen(true);
    }
  };

  const handleDownloadAccountData = () => {
    setIsMethodPending(true);
    const currentDate = new Date().toLocaleDateString();
  
    const content = `
      Date: ${currentDate}
      Username: ${user.username}
      Email: ${user.email}
      Roles: ${user.roles && user.roles.includes("ROLE_OWNER") ? "Role Owner" : "Role Member"}
      Reservations: ${user.reservations && user.reservations.length}
      Reviews: ${user.reviews && user.reviews.length}
      Feedback: ${user.feedback && user.feedback.length}
    `;
  
    const blob = new Blob([content], { type: "text/plain" });
  
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = "account_data.txt";
  
    link.click();
  
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setIsMethodPending(false);
    }, 2000);
    
    setSuccess(true);
    setSuccMsg(' You successfully downloaded your Account Data! ')
    getUserInfo();
    setSnackbarOpen(true);
  };

  return (
    <>
      <Navbar />
      <StyledModal>
        {!isUserPending ? (
          <Box
            sx={{
              position: "relative",
              bgcolor: "background.default",
              color: "text.primary",
              padding: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.green.main}`,
              maxHeight: "90vh",
              width: isMobile ? "80vw" : "80vw",
              height: isMobile ? "85vh" : "auto",
              overflow:'auto',

            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Typography variant="h6" textAlign="left" sx={{ color: "green.main" }}>
                User Profile
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  navigate(-1);
                }}
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
            </Box>
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
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
         <TextField
              id="username"
              label="Username"
              defaultValue={user.username}
              variant="outlined"
              fullWidth
              onChange={handleUsernameChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="email"
              label="Email"
              defaultValue={user.email}
              variant="outlined"
              fullWidth
              onChange={handleEmailChange}
              />
          </Grid>
          <Grid item xs={12} md={4}>
                <TextField
                    id="confirmOldPassword"
                    label="Actual Password"
                    variant="outlined"
                    fullWidth
                    type={showOldPassword ? "text" : "password"}
                    onChange={handleOldPasswordChange}
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleShowOldPassword}>
                              {showOldPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                />
           </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              id="newPassword"
              label="New Password"
              variant="outlined"
              onChange={handlePasswordChange}
              fullWidth
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              id="confirmPassword"
              label="Confirm New Password"
              variant="outlined"
              fullWidth
              type={showPassword ? "text" : "password"}
              onChange={handleConfirmPasswordChange}
            />
          </Grid>
        
              <Grid item xs={12} md={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h5" sx={{ color: "grey.main", marginRight: "8px" }}>
                    Roles:
                  </Typography>
                  <Typography variant="h5" sx={{ color: "green.main" }}>
                    {user.roles && user.roles.includes("ROLE_OWNER") ? "Role Owner" : "Role Member"}
                  </Typography>
                </Box>
              </Grid>
              {user.roles && user.roles.includes("ROLE_OWNER") ? (
                <>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="h5" sx={{ color: "grey.main", marginRight: "8px" }}>
                        Pitches:
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: "green.main",
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white.main",
                          fontWeight: "bold",
                        }}
                      >
                        <Typography>{user.pitches && user.pitches.length}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="h5" sx={{ color: "grey.main", marginRight: "8px" }}>
                        Reservations:
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: "green.main",
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white.main",
                          fontWeight: "bold",
                        }}
                      >
                        <Typography>{user.reservations && user.reservations.length}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="h5" sx={{ color: "grey.main", marginRight: "8px" }}>
                        Reviews:
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: "green.main",
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white.main",
                          fontWeight: "bold",
                        }}
                      >
                        <Typography>{user.reviews && user.reviews.length}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="h5" sx={{ color: "grey.main", marginRight: "8px" }}>
                        Feedback:
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: "green.main",
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white.main",
                          fontWeight: "bold",
                        }}
                      >
                        <Typography>{user.feedback && user.feedback.length}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: isMobile ? "center" : "space-between", alignItems: isMobile ? "center" : "space-between", margin: "3px" }}>
                  <Box sx={{ marginBottom: "3px" }}>
                    <StyledButton  disabled={!isFormChanged || isMethodPending} startIcon={<SecurityUpdateIcon />} variant="contained" size="large" onClick={handleUpdate}>
                      {isMethodPending ? (
                        <CircularProgress color="white" size={24} />
                      ) : (
                        "Update Account"
                      )}
                    </StyledButton>
                  </Box>

                  <Box sx={{ marginBottom: "3px", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: isMobile ? "center" : "space-between", alignItems: isMobile ? "center" : "space-between", margin: "1px", gap: isMobile ? '1px' :'20px' }}>
                    <StyledButtonDelete disabled={isMethodPending} variant="contained" size="large" startIcon={<DeleteIcon />} onClick={handleDeleteAccount} sx={{ bgcolor: "error.dark", marginBottom: "3px" }}>
                      {isMethodPending ? (
                        <CircularProgress color="white" size={24} />
                      ) : (
                        "Delete Account"
                      )}
                    </StyledButtonDelete>
                    <StyledButton disabled={isMethodPending} variant="contained" size="large" startIcon={<CloudDownloadIcon />} onClick={handleDownloadAccountData} sx={{ bgcolor: "green.main", marginBottom: "3px" }}>
                      {isMethodPending ? (
                        <CircularProgress color="white" size={24} />
                      ) : (
                        "Account Data"
                      )}
                    </StyledButton>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <CircularProgress sx={{ color: "green.main" }} />
        )}
      </StyledModal>
      <Footer />
    </>
  );
};

export default UserProfile;
