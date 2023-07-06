import { Box, Stack } from "@mui/material";
import { useState } from "react";
import Navbar from "../../Navbar";
import AppFooter from "../../homePage/AppFooter";
import SidebarSuperAdmin from "../SidebarSuperAdmin";
import AdminsMangement from "./AdminsMangement";

const ManageAdmins = () => {
    const [activeItem, setActiveItem] = useState('Admins');

    return (
      <>
      <Box 
      bgcolor={"background.default"} color={"text.primary"}> 
          <Navbar />
          <Stack direction="row"  > {/* comment above */} 
           <SidebarSuperAdmin activeItem={activeItem} />
           <AdminsMangement />
          </Stack> 
          <AppFooter />
      </Box>
      </>    
      );
}
 
export default ManageAdmins;