import {
    Link,
    Box,
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Switch,
    Typography,
    styled,
  } from "@mui/material";
  import HomeIcon from "@mui/icons-material/Home";
  import StadiumIcon from "@mui/icons-material/Stadium";
  import GroupsIcon from "@mui/icons-material/Groups";
  import StoreIcon from "@mui/icons-material/Store";
  import AccountCircleIcon from "@mui/icons-material/AccountCircle";
  import SettingsIcon from "@mui/icons-material/Settings";
  import DarkModeIcon from "@mui/icons-material/DarkMode";
  import React, { useEffect, useState } from "react";
  import { theme } from "../../theme";
  import {
    BookOnline,
    CheckBox,
    Close,
    ExpandLess,
    ExpandMore,
    HourglassBottom,
    StarBorder,
    SupervisedUserCircle,
    SupervisedUserCircleTwoTone,
  } from "@mui/icons-material";
  import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
  import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
  import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
  
  const SidebarOwner = ({ activeItem }) => {
    const [open, setOpen] = React.useState(true);
  
    const handleClick = () => {
      setOpen(!open);
    };
  
    return (
      <Box
        sx={{
          flex: 1,
          p: 1,
          display: { xs: "none", sm: "block" },
          marginTop: 2,
          
        }}
      >
        <Box position={"fixed"}>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/owner/dashboard"
                selected={activeItem === "Overview"}
                sx={{
                  color: activeItem === "Overview" ? "green.main" : "grey.dark",
                }}
              >
                <ListItemIcon>
                  <HomeIcon
                    sx={{
                      color: activeItem === "Overview" ? "green.main" : "grey.dark",
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1">Overview</Typography>
                  }
                  sx={{ marginLeft: "-20px" }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/owner/dashboard"
                selected={activeItem === "Pitches"}
                sx={{
                  color: activeItem === "Pitches" ? "green.main" : "grey.dark",
                }}
                onClick={handleClick}
              >
                <ListItemIcon>
                  <StadiumIcon
                    sx={{
                      color: activeItem === "Pitches" ? "green.main" : "grey.dark",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary="Pitches" sx={{ marginLeft: "-20px" }} />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/owner/pitches/pending"
                  selected={activeItem === "Pending Pitches"}
                  sx={{
                    color:
                      activeItem === "Pending Pitches" ? "green.main" : "grey.dark",
                    pl: 4,
                  }}
                >
                  <ListItemIcon>
                    <HourglassBottom
                      sx={{
                        color:
                          activeItem === "Pending Pitches"
                            ? "green.main"
                            : "grey.dark",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Pending" sx={{ marginLeft: "-20px" }} />
                </ListItemButton>
  
                <ListItemButton
                  component={RouterLink}
                  to="/owner/pitches/approved"
                  selected={activeItem === "Approved Pitches"}
                  sx={{
                    color:
                      activeItem === "Approved Pitches"
                        ? "green.main"
                        : "grey.dark",
                    pl: 4,
                  }}
                >
                  <ListItemIcon>
                    <CheckBox
                      sx={{
                        color:
                          activeItem === "Approved Pitches"
                            ? "green.main"
                            : "grey.dark",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Approved" sx={{ marginLeft: "-20px" }} />
                </ListItemButton>
  
                <ListItemButton
                  component={RouterLink}
                  to="/owner/pitches/rejected"
                  selected={activeItem === "Rejected Pitches"}
                  sx={{
                    color:
                      activeItem === "Rejected Pitches"
                        ? "green.main"
                        : "grey.dark",
                    pl: 4,
                  }}
                >
                  <ListItemIcon>
                    <Close
                      sx={{
                        color:
                          activeItem === "Rejected Pitches"
                            ? "green.main"
                            : "grey.dark",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Rejected" sx={{ marginLeft: "-20px" }} />
                </ListItemButton>
              </List>
            </Collapse>
           

           

            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/owner/manage/pitches"
                selected={activeItem === "Facilities"}
                sx={{
                  color: activeItem === "Account" ? "green.main" : "grey.dark",
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon
                    sx={{
                      color: activeItem === "Facilities" ? "green.main" : "grey.dark",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary="Facilities" sx={{ marginLeft: "-20px" }} />
              </ListItemButton>
            </ListItem>


            <ListItem disablePadding>
              <ListItemButton component="a">
                <ListItemIcon>
                  <DarkModeIcon sx={{ color: "green.main" }} />
                </ListItemIcon>
                <Switch sx={{ marginLeft: "-20px" }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    );
  };
  
  export default SidebarOwner;
  