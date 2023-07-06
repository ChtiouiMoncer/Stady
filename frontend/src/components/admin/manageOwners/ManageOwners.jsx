import { Box, Stack } from "@mui/material";
import { useState } from "react";
import Navbar from "../../Navbar";
import SidebarAdmin from "../SidebarAdmin";
import AppFooter from "../../homePage/AppFooter";
import OwnersMangement from "./OwnersMangement";

const ManageOwners = () => {
    const [activeItem, setActiveItem] = useState('Owners');

    return (
      <>
      <Box 
      bgcolor={"background.default"} color={"text.primary"}> 
          <Navbar />
          <Stack direction="row"  > {/* comment above */} 
           <SidebarAdmin activeItem={activeItem} />
           <OwnersMangement />
          </Stack> 
          <AppFooter />
      </Box>
      </>    
      );
}
 
export default ManageOwners;