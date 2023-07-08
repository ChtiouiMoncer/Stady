import { Box, Stack } from "@mui/material";
import Navbar from "../../../Navbar";
import { useState } from "react";
import PitchesApproval from "./PitchesApproval";
import AppFooter from "../../../homePage/AppFooter";
import SidebarOwner from "../../SidebarOwner";

const ApprovedPitches = () => {
    const [activeItem, setActiveItem] = useState('Approved Pitches');

    return (
      <>
      <Box 
      bgcolor={"background.default"} color={"text.primary"}> 
          <Navbar />
          <Stack direction="row"  > {/* comment above */} 
           <SidebarOwner activeItem={activeItem} />
           <PitchesApproval />
          </Stack> 
          <AppFooter />
      </Box>
      </>    
      );
}
 
export default ApprovedPitches;