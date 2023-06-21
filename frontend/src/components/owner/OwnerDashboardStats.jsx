import { Box, Stack, ThemeProvider } from "@mui/material";
import Navbar from "../Navbar";
import { useEffect, useState } from "react";
import {theme} from "../../theme"
import SidebarOwner from "./SidebarOwner";
import Overview from "./Overview";
import Feed from "./Feed";

const OwnerDashboardStats = () => {

    const [activeItem, setActiveItem] = useState('Overview');

    return ( 
        <>
        <Box 
        bgcolor={"background.default"} color={"text.primary"}> 
            <Navbar />
            <Stack direction="row"  > {/* comment above */} 
             <SidebarOwner activeItem={activeItem} />
             <Feed />
            </Stack> 
        </Box>
        </>    
     );
}
 
export default OwnerDashboardStats;