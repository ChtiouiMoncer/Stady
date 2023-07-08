import { Box, Stack } from "@mui/material";
import Navbar from "../../../Navbar";
import { useState } from "react";
import UnresolvedPitches from "./UnresolvedPitches";
import AppFooter from "../../../homePage/AppFooter";
import SidebarOwner from "../../SidebarOwner";

const PendingPitches = () => {
    const [activeItem, setActiveItem] = useState('Pending Pitches');

    return (
      <>
      <Box 
      bgcolor={"background.default"} color={"text.primary"}> 
          <Navbar />
          <Stack direction="row"  > {/* comment above */} 
           <SidebarOwner activeItem={activeItem} />
           <UnresolvedPitches />
          </Stack> 
          <AppFooter />

      </Box>
      </>    
      );
}
 
export default PendingPitches;