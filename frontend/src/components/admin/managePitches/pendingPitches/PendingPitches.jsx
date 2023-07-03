import { Box, Stack } from "@mui/material";
import Navbar from "../../../Navbar";
import SidebarAdmin from "../../SidebarAdmin";
import { useState } from "react";
import UnresolvedPitches from "./UnresolvedPitches";
import AppFooter from "../../../homePage/AppFooter";

const PendingPitches = () => {
    const [activeItem, setActiveItem] = useState('Pending Pitches');

    return (
      <>
      <Box 
      bgcolor={"background.default"} color={"text.primary"}> 
          <Navbar />
          <Stack direction="row"  > {/* comment above */} 
           <SidebarAdmin activeItem={activeItem} />
           <UnresolvedPitches />
          </Stack> 
          <AppFooter />

      </Box>
      </>    
      );
}
 
export default PendingPitches;