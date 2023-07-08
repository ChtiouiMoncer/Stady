import { Box, Stack } from "@mui/material";
import Navbar from "../../../Navbar";
import { useState } from "react";
import PitchRejection from "./PitchRejection";
import AppFooter from "../../../homePage/AppFooter";
import SidebarOwner from "../../SidebarOwner";

const RejectedPitches = () => {
    const [activeItem, setActiveItem] = useState('Rejected Pitches');

    return (
      <>
      <Box 
      bgcolor={"background.default"} color={"text.primary"}> 
          <Navbar />
          <Stack direction="row"  > {/* comment above */} 
           <SidebarOwner activeItem={activeItem} />
           <PitchRejection />
          </Stack> 
          <AppFooter />

      </Box>
      </>    
      );
}
 
export default RejectedPitches;