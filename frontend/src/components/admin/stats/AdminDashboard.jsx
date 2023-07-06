import { Box, Stack } from "@mui/material";
import Navbar from "../../Navbar";
import SidebarAdmin from "../SidebarAdmin";
import { useState } from "react";
import Stats from "./Stats";
import AppFooter from "../../homePage/AppFooter";

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState('Overview');

    return (
      <>
      <Box 
      bgcolor={"background.default"} color={"text.primary"}> 
          <Navbar />
          <Stack direction="row"  > {/* comment above */} 
           <SidebarAdmin activeItem={activeItem} />
           <Stats />
          </Stack> 
          <AppFooter />
      </Box>
      </>    
      );
}
 
export default AdminDashboard;