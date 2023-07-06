import { Box, Stack } from "@mui/material";
import { useState } from "react";
import Navbar from "../../Navbar";
import SidebarAdmin from "../SidebarAdmin";
import AppFooter from "../../homePage/AppFooter";
import SportsType from "./SportsType";

const ManageSportsType = () => {
    const [activeItem, setActiveItem] = useState('Sports Type');

    return (
      <>
      <Box 
      bgcolor={"background.default"} color={"text.primary"}> 
          <Navbar />
          <Stack direction="row"  > {/* comment above */} 
           <SidebarAdmin activeItem={activeItem} />
           <SportsType />
          </Stack> 
          <AppFooter />
      </Box>
      </>    
      );
}
 
export default ManageSportsType;