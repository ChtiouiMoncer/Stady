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
            Link,
            MenuItem,
            Menu,
            Avatar
        } from "@mui/material";
import SignUpModal from "./auth/SignUpModal";
import LoginModal from "./auth/LoginModal";
import { Link as RouterLink, useNavigate} from "react-router-dom";
import useLogout from "../Hooks/useLogout";
import useAuth from "../Hooks/useAuth";
import { AccountCircle, AddCircle} from "@mui/icons-material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import FeedbackIcon from '@mui/icons-material/Feedback';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslation } from 'react-i18next';

    const drawerWidth = 200;

    const  Navbar = () => {
        const { t } = useTranslation();
        const [mobileOpen, setMobileOpen] = React.useState(false);
        const [showModal, setShowModal] = useState(false);
        const [showLoginModal, setShowLoginModal] = useState(false);

        //logout
        const { auth, setAuth } = useAuth();
        const logout = useLogout();
        const navigate = useNavigate();

        // define roles
        const ROLES = {
            'Member': 'ROLE_MEMBER',
            'Owner': 'ROLE_OWNER',
            'Admin': 'ROLE_ADMIN',
            'SUPER_ADMIN': 'ROLE_SUPER_ADMIN',
        }

        //user menu
        const [anchorEl, setAnchorEl] = React.useState(null);
        

        const handleMenu = (event) => {
          setAnchorEl(event.currentTarget);
        };
      
        const handleClose = () => {
          setAnchorEl(null);
        };

        const signOut = async () => {
            try {
            await logout();  
            //setAuth({});
            //localStorage.removeItem('refresh_token');
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
        const firstLetter = auth?.username ? auth.username.charAt(0).toUpperCase() : "";
        
        
        const drawer = (
            <div sx={{ bgcolor: "grey.light" }}>
                <Divider />
                <List>
                    {/* Only render the home and pitches links for a admin */}
                    {auth?.roles?.find(role => [ROLES.Admin].includes(role))  ? (
                    <ListItem disablePadding>
                        <ListItemButton
                        component={RouterLink}
                        to="/admin/dashboard"
                        >
                        <ListItemIcon>
                            <DashboardIcon sx={{ color: "green.main" }} />
                        </ListItemIcon>
                        <ListItemText
                            primary={<Typography variant="subtitle2" sx={{ color: "green.main" }}>{t('dashboard')}</Typography>}
                        />
                        </ListItemButton>
                    </ListItem>
                    ) : null}

                    {/* Only render the home link for a member or a guest */}
                    {(auth?.roles?.find(role => [ROLES.Member].includes(role)) || !auth?.access_token) && (
                        <>
                        <ListItem disablePadding>
                            <ListItemButton
                            component={RouterLink}
                            to="/"
                            >
                            <ListItemIcon>
                                <HomeIcon sx={{ color: "green.main" }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={<Typography variant="subtitle2" sx={{ color: "green.main" }}>{t('home')}</Typography>}
                            />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton
                            component={RouterLink}
                            to="/pitches/search"
                            >
                            <ListItemIcon>
                                <StadiumIcon sx={{ color: "grey.dark" }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={<Typography variant="subtitle2" sx={{ color: "grey.dark" }}>{t('pitches')}</Typography>}
                            />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton
                            component={RouterLink}
                            to="/stady/feedback"
                            >
                            <ListItemIcon>
                                <FeedbackIcon sx={{ color: "grey.dark" }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={<Typography variant="subtitle2" sx={{ color: "grey.dark" }}>{t('feedback')}</Typography>}
                            />
                            </ListItemButton>
                        </ListItem>
                        </>
                    )}
            
                    {/* Only render the home and pitches links for a member */}
                    {auth?.roles?.find(role => [ROLES.Member].includes(role))  ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton
                            component={RouterLink}
                            to="/member/reservations"
                            >
                            <ListItemIcon>
                                <BookOnlineIcon sx={{ color: "grey.dark" }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={<Typography variant="subtitle2" sx={{ color: "grey.dark" }}>{t('reservations')}</Typography>}
                            />
                            </ListItemButton>
                        </ListItem>
                    </>
                    ) : null}
            
                    {/* Only render the home and pitches links for an Owner */}
                    {auth?.roles?.find(role => [ROLES.Owner].includes(role))  ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton
                            component={RouterLink}
                            to="/owner/dashboard"
                            >
                            <ListItemIcon>
                                <DashboardIcon sx={{ color: "grey.dark" }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={<Typography variant="subtitle2" sx={{ color: "grey.dark" }}>{t('dashboard')}</Typography>}
                            />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton
                            component={RouterLink}
                            to="/owner/manage/pitches"
                            >
                            <ListItemIcon>
                                <StadiumIcon sx={{ color: "grey.dark" }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={<Typography variant="subtitle2" sx={{ color: "grey.dark" }}>{t('myPitches')}</Typography>}
                            />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton
                            component={RouterLink}
                            to="/owner/add/pitch"
                            >
                            <ListItemIcon>
                                <AddCircle sx={{ color: "grey.dark" }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={<Typography variant="subtitle2" sx={{ color: "grey.dark" }}>{t('addPitch')}</Typography>}
                            />
                            </ListItemButton>
                        </ListItem>
                    
                    </>
                    ) : null}
            
                    {/* Only render the users link for super admin */}
                    {auth?.roles?.find(role => [ROLES.SUPER_ADMIN].includes(role)) ? (
                    <>   
                        <ListItem disablePadding>
                            <ListItemButton
                            component={RouterLink}
                            to="/superadmin/dashboard"
                            >
                            <ListItemIcon>
                                <DashboardIcon sx={{ color: "grey.dark" }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={<Typography variant="subtitle2" sx={{ color: "grey.dark" }}>{t('dashboard')}</Typography>}
                            />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton
                            component={RouterLink}
                            to="/superadmin/manage/admins"
                            >
                            <ListItemIcon>
                                <ManageAccountsIcon sx={{ color: "grey.dark" }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={<Typography variant="subtitle2" sx={{ color: "grey.dark" }}>{t('manageAdmins')}</Typography>}
                            />
                            </ListItemButton>
                        </ListItem>
                    </> 
                    ) : null}       
                </List>

                <Divider />

                {/* Only render the Login link when auth is empty */}
                {auth?.access_token ? null : (

                    <ListItem disablePadding>
                        <ListItemButton
                        component={RouterLink}
                        to="/login"
                        onClick={handleDrawerToggle}
                        sx={{ backgroundColor: "green.main" }}
                        >
                        <ListItemIcon>
                            <LoginTwoToneIcon sx={{ color: "white.light" }} />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                            <Typography sx={{ color: "white.light" }} variant="subtitle2">
                                {t('login')}
                            </Typography>
                            }
                        />
                        </ListItemButton>
                    </ListItem>
                )}

                {/* Only render the Login link when auth is empty */}
                {auth?.roles?.find(role => [ROLES.Owner, ROLES.Member].includes(role)) ? (                        
                    <ListItem disablePadding>
                        <ListItemButton
                        component={RouterLink}
                        to={`/profile/user/${auth?.username}`}
                        onClick={handleDrawerToggle}
                        sx={{ backgroundColor: "green.main" }}
                        >
                        <ListItemIcon>
                            <AccountBoxIcon sx={{ color: "white.light" }} />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                            <Typography sx={{ color: "white.light" }} variant="subtitle2">
                                {t('profile')}
                            </Typography>
                            }
                        />
                        </ListItemButton>
                    </ListItem>
                ) : null}
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

                    {/* Only render the home page to a Member or a guest */}
                    {auth?.roles?.find(role => [ROLES.Member].includes(role)) || !auth?.access_token ? (
                    <>
                    <Link component={RouterLink} to="/">
                        <Box>
                            <img src={logo} alt="Logo" width="110px" height="40px" />
                        </Box>
                    </Link> 
                    </>
                    ) : null }

                    {/* Only render the admin dashboard page to an admin */}
                    {auth?.roles?.find(role => [ROLES.Admin].includes(role))  ? (
                    <>
                    <Link component={RouterLink} to="/admin/dashboard">
                        <Box>
                            <img src={logo} alt="Logo" width="110px" height="40px" />
                        </Box>
                    </Link> 
                    </>
                    ) : null }
                    
                    {/* Only render the owner dashboard page to an owner */}
                    {auth?.roles?.find(role => [ROLES.Owner].includes(role))  ? (
                    <>
                    <Link component={RouterLink} to="/owner/dashboard">
                        <Box>
                            <img src={logo} alt="Logo" width="110px" height="40px" />
                        </Box>
                    </Link> 
                    </>
                    ) : null }

                    {/* Only render the super admin dashboard page to a super admin */}
                    {auth?.roles?.find(role => [ROLES.SUPER_ADMIN].includes(role))  ? (
                    <>
                    <Link component={RouterLink} to="/superadmin/dashboard">
                        <Box>
                            <img src={logo} alt="Logo" width="110px" height="40px" />
                        </Box>
                    </Link> 
                    </>
                    ) : null }
                   

                    <Links>

                         {/* Only render the home and pitches links for a admin */}
                        {auth?.roles?.find(role => [ROLES.Admin].includes(role))  ? (
                        <>
                            <Button component={RouterLink} to="/admin/dashboard">
                                <Typography variant="subtitle2" className="greenSubtitle">Dashboard</Typography>
                            </Button>
                           
                        </>
                        ) : null}

                        {/* Only render the home and pitches links for a member or a guest */}
                        {auth?.roles?.find(role => [ROLES.Member].includes(role)) || !auth?.access_token ? (
                        <>
                            <Button component={RouterLink} to="/">
                                <Typography variant="subtitle2" className="greenSubtitle">{t('home')}</Typography>
                            </Button>
                            <Button component={RouterLink} to="/pitches/search">
                                <Typography variant="subtitle2" className="greySubtitle">{t('pitches')}</Typography>
                            </Button>
                            <Button component={RouterLink} to="/stady/feedback">
                                <Typography variant="subtitle2" className="greySubtitle">{t('feedback')}</Typography>
                            </Button>
                        </>
                        ) : null}

                         {/* Only render the home and pitches links for a member */}
                         {auth?.roles?.find(role => [ROLES.Member].includes(role))  ? (
                        <>
                            <Button component={RouterLink} to="/member/reservations">
                                <Typography variant="subtitle2" className="greySubtitle">{t('reservations')}</Typography>
                            </Button>
                        </>
                        ) : null}


                         {/* Only render the home and pitches links for an Owner */}
                         {auth?.roles?.find(role => [ROLES.Owner].includes(role))  ? (
                        <>
                            <Button component={RouterLink} to="/owner/dashboard">
                                <Typography variant="subtitle2" className="greenSubtitle">Dashboard</Typography>
                            </Button>
                            <Button component={RouterLink} to="/owner/manage/pitches">
                                <Typography variant="subtitle2" className="greySubtitle">{t('myPitches')}</Typography>
                            </Button>

                            <Button
                                component={RouterLink}
                                to="/owner/add/pitch"
                                variant="contained"
                                className="my-button"
                                startIcon={<AddCircle />}
                                size="small"
                                >
                                    <Typography variant="subtitle2">
                                    {t('addPitch')}
                                    </Typography>
                            </Button>
                        </>
                        ) : null}


                            
                        {/* Only render the users link for super admin */}
                        {auth?.roles?.find(role => [ ROLES.SUPER_ADMIN].includes(role)) ? (
                         <>   
                            <Button component={RouterLink} to="/superadmin/dashboard">
                                <Typography variant="subtitle2" className="greySubtitle">Dashboard</Typography>
                            </Button>
                            <Button component={RouterLink} to="/superadmin/manage/admins">
                                <Typography variant="subtitle2" className="greySubtitle">{t('manageAdmins')}</Typography>
                            </Button>
                        </> 
                        ) : null}

                        
                        {/* Only render log in and sign up buttons when no one is logged in */}
                        {auth?.access_token ? null : (
                            <>
                                <Button component={RouterLink} to="/login">
                                    <Typography variant="subtitle2" className="greySubtitle">
                                        {t('login')}                      
                                    </Typography>
                                </Button>
                                <Button
                                component={RouterLink}
                                to="/signup"
                                variant="contained"
                                className="my-button"
                                >
                                    <Typography variant="subtitle2">
                                        {t('signup')} 
                                    </Typography>
                                </Button>
                            </>
                        )}
                        {/* Only render log out button when someone is logged in */}
                        {auth?.access_token ? (
                        <> 
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                            // Adjust the size by modifying the fontSize value
                            >
                             {auth?.username ? (
                                <Avatar sx={{ bgcolor: 'green.main', fontSize: "18px", width: 35, height:35 }}>
                                {firstLetter}
                                </Avatar>
                            ) : (
                                <AccountCircle sx={{ fontSize: "33px", color: "green.light" }} />
                            )}
                        </IconButton>
                            <Menu 
                            id="menu-appbar"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            sx={{
                                mt: 6,
                                ml: -5,
                            }}
                            >
                                {auth?.roles?.find(role => [ROLES.Member, ROLES.Owner].includes(role)) ? (
                                <> 
                                <MenuItem sx={{ paddingRight: '30px' }}>
                                    <Link component={RouterLink}  to={`/profile/user/${auth?.username}`} underline="none">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ListItemIcon>
                                            <AccountCircle sx={{ color: 'black.main' }} />
                                        </ListItemIcon>
                                        <Typography variant="subtitle2" sx={{ color: 'black.main', ml: 1 }}>
                                            {t('profile')} 
                                        </Typography>
                                        </Box>
                                    </Link>
                                </MenuItem>
                                </> 
                                ) : null}
                                <MenuItem onClick={signOut} sx={{ paddingRight: '30px' }}>
                                    <ListItemIcon>
                                    <LogoutIcon />
                                    </ListItemIcon>
                                    <ListItemText primary= {t('logout')}  />
                                </MenuItem>
                            </Menu>
                        </> 
                        ) : null}
        
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

                        {/* Only render the home page to a Member or a guest */}
                        {auth?.roles?.find(role => [ROLES.Member].includes(role)) || !auth?.access_token ? (
                        <Link  component={RouterLink} to="/">
                                <img src={logo} alt="Logo" width="80px" height="30px" />
                        </Link>   
                        ) : null }

                        {/* Only render the admin dashboard page to an admin */}
                        {auth?.roles?.find(role => [ROLES.Admin].includes(role))  ? (
                        <>
                        <Link component={RouterLink} to="/admin/dashboard">
                                <img src={logo} alt="Logo" width="110px" height="40px" />
                        </Link> 
                        </>
                        ) : null }

                        {/* Only render the owner dashboard page to an owner */}
                        {auth?.roles?.find(role => [ROLES.Owner].includes(role))  ? (
                        <>
                        <Link component={RouterLink} to="/owner/dashboard">
                                <img src={logo} alt="Logo" width="110px" height="40px" />
                        </Link> 
                        </>
                        ) : null }

                        {/* Only render the super admin dashboard page to a super admin */}
                        {auth?.roles?.find(role => [ROLES.SUPER_ADMIN].includes(role))  ? (
                            <>
                            <Link component={RouterLink} to="/superadmin/dashboard">
                                <img src={logo} alt="Logo" width="110px" height="40px" />
                            </Link> 
                            </>
                            ) : null }
                    </Box>
                    {auth?.access_token ? null : (
                    <Button  component={RouterLink} to="/signup"  variant="contained" className="my-button"  >{t('signup')}</Button>
                    )}

                    {auth?.access_token ? (
                    <Button  component={RouterLink} onClick={signOut} variant="contained" className="my-button" >{t('logout')}</Button>
                    ) : null }
                        
                    
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