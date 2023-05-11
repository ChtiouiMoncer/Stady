import { Box, Stack, ThemeProvider } from '@mui/material';
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import {theme} from "./theme"
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './components/homePage/HomePage';
import NotFound from './components/NotFound';
import RequireAuth from './components/RequireAuth';
import Test from './components/Test';
import LoginModal from './components/auth/LoginModal';
import { Login } from '@mui/icons-material';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import Unauthorized from './components/Unauthorized.js';


function App() {
  const [mode, setMode] = useState(() => {
    // read mode value from local storage on initial render
    return localStorage.getItem("mode") || "light";
  });

  // define roles
  const ROLES = {
    'Member': 'ROLE_MEMBER',
    'Owner': 'ROLE_OWNER',
    'Admin': 'ROLE_ADMIN',
    'SUPER_ADMIN': 'ROLE_SUPER_ADMIN',
  }

  useEffect(() => {
    setMode("light");
    localStorage.setItem("mode", mode); // save mode to local storage
  }, [mode]);  
  return (
    <>
    <Router>
      <ThemeProvider theme={theme(mode)}>
          <AuthProvider>
            <Box bgcolor={"background.default"} color={"text.primary"}> 
              <Navbar />
              <Stack display='flex' flexDirection='column'>
                <Routes>
                  {/* Public Routes */}
                  <Route exact path="/" element={  <HomePage /> }></Route>
                  <Route exact path="/login" element={  <LoginPage /> } />
                  <Route exact path="/signup" element={  <SignUpPage /> } />
                  <Route exact path="/unauthorized" element={  <Unauthorized /> } />



                  { /* Protected Routes */}
                  <Route element= { <RequireAuth  allowedRoles={[ROLES.Member]}/> }> { /* only when we have a user we can show the comp's inside the Required Auth*/ }
                    <Route path="/pitches/add" element={<Test />}></Route>
                  </Route>

                  {/* catch All */}
                  <Route path="*" element={<NotFound />}></Route>

                </Routes>  
              </Stack>
            </Box>
          </AuthProvider>  
      </ThemeProvider>
    </Router>  
    </>
  );
} 

export default App;
