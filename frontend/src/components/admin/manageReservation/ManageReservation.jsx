import { Box, Stack } from "@mui/material";
import { useState } from "react";
import Reservations from "./Reservations";
import Navbar from "../../Navbar";
import SidebarAdmin from "../SidebarAdmin";
import AppFooter from "../../homePage/AppFooter";

const ManageReservation = () => {
    const [activeItem, setActiveItem] = useState('Reservations');

    return (
      <>
      <Box 
      bgcolor={"background.default"} color={"text.primary"}> 
          <Navbar />
          <Stack direction="row"  > {/* comment above */} 
           <SidebarAdmin activeItem={activeItem} />
           <Reservations />
          </Stack> 
          <AppFooter />
      </Box>
      </>    
      );
}
 
export default ManageReservation;