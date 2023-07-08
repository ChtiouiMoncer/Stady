import { Box, Stack } from "@mui/material";
import { useState } from "react";
import Reservations from "./Reservations";
import Navbar from "../../Navbar";
import AppFooter from "../../homePage/AppFooter";
import SidebarOwner from "../SidebarOwner";

const ManageReservation = () => {
    const [activeItem, setActiveItem] = useState('Reservations');

    return (
      <>
      <Box 
      bgcolor={"background.default"} color={"text.primary"}> 
          <Navbar />
          <Stack direction="row"  > {/* comment above */} 
           <SidebarOwner activeItem={activeItem} />
           <Reservations />
          </Stack> 
          <AppFooter />
      </Box>
      </>    
      );
}
 
export default ManageReservation;