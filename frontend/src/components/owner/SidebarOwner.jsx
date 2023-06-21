import { Box,  Collapse,  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch, Typography, styled } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import StadiumIcon from '@mui/icons-material/Stadium';
import GroupsIcon from '@mui/icons-material/Groups';
import StoreIcon from '@mui/icons-material/Store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import React, { useEffect, useState } from "react";
import { theme } from "../../theme";
import { BookOnline, CheckBox, Close, ExpandLess, ExpandMore, HourglassBottom, StarBorder, SupervisedUserCircle } from "@mui/icons-material";



const SidebarOwner = ({ activeItem }) => {

    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
      setOpen(!open);
    };
   
    
   
    return (
        <Box 
            //bgcolor="pink" 
            sx={{ 
                
                flex: 1, 
                p: 1, 
                display: { xs: "none", sm: "block" },
                marginTop: 2
            }}
        >
            <Box position={"fixed"}>
                <List> 
                    <ListItem disablePadding> 
                        <ListItemButton
                            component="a"
                            href="#home"
                            selected={activeItem === 'Overview'}
                            sx={{ color: activeItem === 'Overview' ? 'green.main' : 'grey.dark',}}
                        > 
                            <ListItemIcon>
                                <HomeIcon sx={{ color: activeItem === 'Overview' ? 'green.main' : 'grey.dark',}} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={
                                <Typography variant="body1">
                                  Overview
                                </Typography>
                              }
                              sx={{ marginLeft: '-20px' }} 
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={handleClick}
                            component="a"
                            href="#home"
                            selected={activeItem === 'My Pitches'}
                            sx={{ color: activeItem === 'My Pitches' ? 'green.main' : 'grey.dark'}}
                        >
                            <ListItemIcon>
                                <StadiumIcon sx={{ color: activeItem === 'My Pitches' ? 'green.main' : 'grey.dark'}} />
                            </ListItemIcon>
                            <ListItemText 
                              primary="My Pitches" 
                              sx={{ marginLeft: '-20px' }} 
                            />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                    <HourglassBottom />
                                    </ListItemIcon>
                                    <ListItemText primary="Pending" sx={{ marginLeft: '-20px' }}  />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                    <CheckBox />
                                    </ListItemIcon>
                                    <ListItemText primary="Approved" sx={{ marginLeft: '-20px' }}  />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                    <Close />
                                    </ListItemIcon>
                                    <ListItemText primary="Rejected" sx={{ marginLeft: '-20px' }}  />
                                </ListItemButton>
                            </List> 
                        </Collapse>          
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="#home"
                            selected={activeItem === 'Reservations'}
                            sx={{ color: activeItem === 'Reservations' ? 'green.main' : 'grey.dark',}}
                        >
                            <ListItemIcon>
                                <BookOnline sx={{ color: activeItem === 'Reservations' ? 'green.main' : 'grey.dark'}} />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Reservations" 
                              sx={{ marginLeft: '-20px' }} 
                              
                            />
                        </ListItemButton>
                    </ListItem>
                   
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="#home"
                            selected={activeItem === 'Settings'}
                            sx={{ color: activeItem === 'Settings' ? 'green.main' : 'grey.dark',}}
                        >
                            <ListItemIcon>
                                <SettingsIcon sx={{ color: activeItem === 'Settings' ? 'green.main' : 'grey.dark',}}/>
                            </ListItemIcon>
                            <ListItemText 
                              primary="Settings" 
                              sx={{ marginLeft: '-20px' }} 
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="#home"
                            selected={activeItem === 'Account'}
                            sx={{ color: activeItem === 'Account' ? 'green.main' : 'grey.dark',}}
                        >
                            <ListItemIcon>
                                <AccountCircleIcon sx={{ color: activeItem === 'Account' ? 'green.main' : 'grey.dark',}} />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Account" 
                              sx={{ marginLeft: '-20px' }} 
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component="a" href="#home">
                            <ListItemIcon>
                                <DarkModeIcon sx={{ color: 'green.main'}} />
                            </ListItemIcon>
                            <Switch 
                              sx={{ 
                                marginLeft: '-20px',
                            }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
}
 
export default SidebarOwner;