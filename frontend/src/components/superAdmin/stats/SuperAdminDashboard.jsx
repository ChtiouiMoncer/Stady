import { Box, Stack } from "@mui/material";
import Navbar from "../../Navbar";
import { useState } from "react";
import Stats from "./Stats";
import AppFooter from "../../homePage/AppFooter";
import SidebarSuperAdmin from "../SidebarSuperAdmin";

const SuperAdminDashboard = () => {
  const [activeItem, setActiveItem] = useState('Overview');

    return (
      <>
      <Box 
      bgcolor={"background.default"} color={"text.primary"}> 
          <Navbar />
          <Stack direction="row"  > {/* comment above */} 
           <SidebarSuperAdmin activeItem={activeItem} />
           <Stats />
          </Stack> 
          <AppFooter />
      </Box>
      </>    
      );
}
 
export default SuperAdminDashboard;