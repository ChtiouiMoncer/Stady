import { Box, Stack } from "@mui/material";
import { useState } from "react";
import Navbar from "../../Navbar";
import SidebarAdmin from "../SidebarAdmin";
import AppFooter from "../../homePage/AppFooter";
import MemberMangement from "./MemberMangement";

const ManageMembers = () => {
    const [activeItem, setActiveItem] = useState('Members');

    return (
      <>
      <Box 
      bgcolor={"background.default"} color={"text.primary"}> 
          <Navbar />
          <Stack direction="row"  > {/* comment above */} 
           <SidebarAdmin activeItem={activeItem} />
           <MemberMangement />
          </Stack> 
          <AppFooter />
      </Box>
      </>    
      );
}
 
export default ManageMembers;