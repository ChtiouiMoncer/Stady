import { Box, Stack } from "@mui/material";
import Navbar from "../../../Navbar";
import SidebarAdmin from "../../SidebarAdmin";
import { useState } from "react";
import PitchRejection from "./PitchRejection";
import AppFooter from "../../../homePage/AppFooter";

const RejectedPitches = () => {
    const [activeItem, setActiveItem] = useState('Rejected Pitches');

    return (
      <>
      <Box 
      bgcolor={"background.default"} color={"text.primary"}> 
          <Navbar />
          <Stack direction="row"  > {/* comment above */} 
           <SidebarAdmin activeItem={activeItem} />
           <PitchRejection />
          </Stack> 
          <AppFooter />

      </Box>
      </>    
      );
}
 
export default RejectedPitches;