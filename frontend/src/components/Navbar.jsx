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
         Typography
       } from "@mui/material";
import SignUpModal from "./auth/SignUpModal";
import LoginModal from "./auth/LoginModal";


const drawerWidth = 200;

const  Navbar = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);


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
                    <ListItemButton >
                    <ListItemIcon>
                        <HomeIcon sx = {{ color: "green.main" }} /> 
                    </ListItemIcon >
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
                    <ListItemButton onClick={() => { handleLogInModalOpen(); handleDrawerToggle(); }} sx={{ backgroundColor: 'green.main'}} >
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
                <Box  >
                    <img src={logo} alt="Logo" width="110px" height="40px" />
                </Box>
                <Links>
                    <Button href="">
                        <Typography variant="subtitle2" className="greenSubtitle">Home</Typography>
                    </Button>
                    <Button href="">
                        <Typography variant="subtitle2" className="greySubtitle">Pitches</Typography>
                    </Button>
                    <Button href="" onClick={handleLogInModalOpen}>
                        <Typography variant="subtitle2" className="greySubtitle">Login</Typography>
                    </Button>
                    <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />

                    <Button variant="contained" className="my-button" onClick={handleSignInModalOpen} >Sign Up</Button>
                    <SignUpModal open={showModal} onClose={() => setShowModal(false)} />
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
                        <img src={logo} alt="Logo" width="80px" height="30px" />
                </Box>
                <Button variant="contained" className="my-button" onClick={handleSignInModalOpen} >Sign Up</Button>
                <SignUpModal  open={showModal} onClose={() => setShowModal(false)} />
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