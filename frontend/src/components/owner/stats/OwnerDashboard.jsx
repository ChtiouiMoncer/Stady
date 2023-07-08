import { Box, Stack } from "@mui/material";
import Navbar from "../../Navbar";
import { useState } from "react";
import Stats from "./Stats";
import AppFooter from "../../homePage/AppFooter";
import SidebarOwner from "../SidebarOwner";

const OwnerDashboard = () => {
  const [activeItem, setActiveItem] = useState('Overview');

    return (
      <>
      <Box 
      bgcolor={"background.default"} color={"text.primary"}> 
          <Navbar />
          <Stack direction="row"  > {/* comment above */} 
           <SidebarOwner activeItem={activeItem} />
           <Stats />
          </Stack> 
          <AppFooter />
      </Box>
      </>    
      );
}
 
export default OwnerDashboard;