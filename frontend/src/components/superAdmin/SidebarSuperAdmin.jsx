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
  import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
  import SettingsIcon from '@mui/icons-material/Settings';

  const SidebarSuperAdmin = ({ activeItem }) => {
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
          marginTop: 3,
          
        }}
      >
        <Box position={"fixed"}>
          <List>

            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/superadmin/dashboard"
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
                to="/superadmin/manage/users/admins"
                selected={activeItem === "Admins"}
                sx={{
                  color: activeItem === "Admins" ? "green.main" : "grey.dark",
                }}
              >
                <ListItemIcon>
                  <AdminPanelSettingsIcon
                    sx={{
                      color: activeItem === "Admins" ? "green.main" : "grey.dark",
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1">Admins</Typography>
                  }
                  sx={{ marginLeft: "-20px" }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/superadmin/dashboard"
                selected={activeItem === "Account"}
                sx={{
                  color: activeItem === "Account" ? "green.main" : "grey.dark",
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon
                    sx={{
                      color: activeItem === "Account" ? "green.main" : "grey.dark",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary="Account" sx={{ marginLeft: "-20px" }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/superadmin/dashboard"
                selected={activeItem === "Settings"}
                sx={{
                  color: activeItem === "Settings" ? "green.main" : "grey.dark",
                }}
              >
                <ListItemIcon>
                  <SettingsIcon
                    sx={{
                      color: activeItem === "Settings" ? "green.main" : "grey.dark",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary="Settings" sx={{ marginLeft: "-20px" }} />
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
  
  export default SidebarSuperAdmin;
