import React, { useState } from "react";
import logo from '../assets/logo.png'
import StadiumIcon from '@mui/icons-material/Stadium';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';
import Drawer from '@mui/material/Drawer';
import { AppBar,
         Box,
         Button,
         Divider,
         IconButton,
         List,
         ListItem,
         ListItemButton,
         ListItemText,
         ListItemIcon,
         styled,
         Toolbar,
         Typography,
         Link
       } from "@mui/material";
import SignUpModal from "./auth/SignUpModal";
import LoginModal from "./auth/LoginModal";
import { Link as RouterLink, useNavigate} from "react-router-dom";
import useLogout from "../Hooks/useLogout";
import useAuth from "../Hooks/useAuth";


const drawerWidth = 200;

const  Navbar = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    //logout
    const { auth, setAuth } = useAuth();
    const logout = useLogout();
    const navigate = useNavigate();


    const signOut = async () => {
        try {
          await logout();  
          setAuth({});
          localStorage.removeItem('refresh_token');
          navigate('/');
        } catch (error) {
          // Handle the error here (e.g., display an error message)
          console.error('Logout failed:', error);
          // Optionally, you can return the error or throw it again
          // return error;
          // throw error;
        }
      }
      

    // toggle refers to the act of switching the state of a boolean value from true to false or from false to true.
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
      };

    const handleSignInModalOpen = () => {
        setShowModal(true);
    }; 
    
    const handleLogInModalOpen = () => {
        setShowLoginModal(true);
    }; 

    
    const drawer = (
        <div sx = {{ bgcolor: "grey.light" }}>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/" onClick={() => { handleDrawerToggle(); }}>

                        <ListItemIcon>
                            <HomeIcon sx = {{ color: "green.main" }} /> 
                        </ListItemIcon  >
                    
                        <ListItemText primary={<Typography variant="subtitle2" sx = {{ color: "green.main" }}>Home</Typography>} />

                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton >
                    <ListItemIcon>
                        <StadiumIcon /> 
                    </ListItemIcon >
                    <ListItemText primary={<Typography variant="subtitle2" sx = {{}}>Pitches</Typography>} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton  component={RouterLink} to="/login" onClick={() => { handleDrawerToggle(); }} sx={{ backgroundColor: 'green.main'}} >
                    <ListItemIcon>
                        <LoginTwoToneIcon sx = {{color: 'white.light'}}/> 
                    </ListItemIcon >
                    <ListItemText primary={<Typography sx = {{color: 'white.light'}} variant="subtitle2" >Login</Typography>} />
                    </ListItemButton>
                </ListItem>


            </List>

            <Divider />

            
        </div>
      ); 
 
  
    //Styled Toolbar compoenent (every appbar requires a toolbar)
    const StyledToolbar = styled(Toolbar)(({ theme }) => ({
        display:"flex", // This means that the container element will use the flexbox layout mode
        justifyContent: "space-between", // Set the justification of the child elements along the main axis of the flex container
        padding:"3px",
        [theme.breakpoints.down("sm")]:{ //if it's equal or sup to sm it will disply none
            display: "none"
        },
    }));

    //Styled Mobile Toolbar compoenent (every appbar requires a toolbar)
    const StyledMobileToolbar = styled(Toolbar)(({ theme }) => ({
        display:"flex", // This means that the container element will use the flexbox layout mode
        justifyContent: "space-between", // Set the justification of the child elements along the main axis of the flex container
        padding:"5px",
        [theme.breakpoints.up("sm")]:{ //if it's equal or sup to sm it will disply none
            display: "none"
        },
        ".my-button": {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.green.main,
            textTransform: "none",
          }
    }));


    //Links componenet with styled Box
    const Links = styled(Box)(({ theme }) => ({
        gap:"10px",
        alignItems:"center",
        ".greySubtitle": {color: theme.palette.grey.main, textTransform: "none",
            "&:hover": {
                color: theme.palette.green.light,
            },
        },
        ".greenSubtitle": {color: theme.palette.green.main, textTransform: "none",
        },
        ".my-button": {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.green.main,
            textTransform: "none",
            "&:hover": {
                backgroundColor: theme.palette.green.light,
              },
          }
    }));  //flex = H, space with gap,and align them in the center

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        justifyContent: 'flex-end',
      }));

    return (
        <>
        <AppBar
        position="sticky"
        sx={{
            bgcolor: 'white.main',
            //height: '70px'
        }}
        > 
            <StyledToolbar>
                <Link  component={RouterLink} to="/">
                    <Box>
                        <img src={logo} alt="Logo" width="110px" height="40px" />
                    </Box>
                </Link> 

                <Links>
                    <Button  component={RouterLink} to="/"   > 
                        <Typography variant="subtitle2" className="greenSubtitle">Home</Typography>
                    </Button>
                    <Button component={RouterLink} to="/">
                        <Typography variant="subtitle2" className="greySubtitle">Pitches</Typography>
                    </Button>
                    <Button component={RouterLink} to="/users">
                        <Typography variant="subtitle2" className="greySubtitle">Users</Typography>
                    </Button>
                    <Button onClick={signOut}>
                        <Typography variant="subtitle2" className="greySubtitle">Logout</Typography>
                    </Button>

                    {/*
                        <Button  onClick={handleLogInModalOpen}>
                            <Typography variant="subtitle2" className="greySubtitle">Log In</Typography>
                        </Button>
                        <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
                        

                        <Button variant="contained" className="my-button" onClick={handleSignInModalOpen}>
                            <Typography variant="subtitle2" >
                                Sign Up
                            </Typography>
                        </Button>
                        <SignUpModal open={showModal} onClose={() => setShowModal(false)} /> 
                    */}

                      <Button  component={RouterLink} to="/login"   >
                            <Typography variant="subtitle2" className="greySubtitle" >
                                        {"Log In"}                        
                            </Typography>
                        </Button>    

                        <Button  component={RouterLink} to="/signup"  variant="contained" className="my-button"    >
                            <Typography variant="subtitle2"  >
                                        {"Sign Up"}                        
                            </Typography>
                        </Button>  
                      
                </Links>
            </StyledToolbar>

            <StyledMobileToolbar>         
                <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                >
                    <MenuIcon
                    sx={{  padding:'3px', bgcolor: 'green.main', color: 'white.main', borderRadius: '5px' }}
                    />
                </IconButton>
                <Box>
                    <Link  component={RouterLink} to="/">
                            <img src={logo} alt="Logo" width="80px" height="30px" />
                    </Link>        
                </Box>
                <Button  component={RouterLink} to="/signup"  variant="contained" className="my-button"  >Sign Up</Button>
            </StyledMobileToolbar>
        </AppBar>

        <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
        >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { sm: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronRightIcon sx = {{ color: "green.main" }} />
          </IconButton>
        </DrawerHeader>    
          {drawer}
        </Drawer>
      </Box>
      </>
      );
}
export default Navbar;