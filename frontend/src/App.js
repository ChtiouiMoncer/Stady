
import { Box, Stack, ThemeProvider } from '@mui/material';
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import {theme} from "./theme"
import Hero from './components/Hero';

function App() {
  const [mode, setMode] = useState(() => {
    // read mode value from local storage on initial render
    return localStorage.getItem("mode") || "light";
  });

  useEffect(() => {
    setMode("light");
    localStorage.setItem("mode", mode); // save mode to local storage
  }, [mode]);  
  return (
    <>
    <ThemeProvider theme={theme(mode)}>
      <Box bgcolor={"background.default"} color={"text.primary"}> 
        <Navbar />
        <Stack display='flex' flexDirection='column'  > {/* comment above */} 
          <Hero />
        </Stack>
      </Box>
    </ThemeProvider>
    </>
  );
} 

export default App;
