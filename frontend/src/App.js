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
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import Unauthorized from './components/Unauthorized.js';
import Users from './components/Users';
import PersistLogin from './components/PersistLogin';
import AuthGuard from './components/AuthGuard ';


function App() {
  const loggedIn = window.localStorage.getItem("isLoggedIn");
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
                  <Route path="/" element={  <HomePage /> }></Route>
                  <Route path="/unauthorized" element={  <Unauthorized /> } />

                  <Route element= { <AuthGuard  /> }> { /*If we have a user logged in we redirect to '/'*/ }
                    <Route path="/login" element={  <LoginPage /> } />
                    <Route path="/signup" element={  <SignUpPage /> } />
                  </Route>   

                  { /* Protected Routes */}
                  <Route element={ <PersistLogin /> }>  { /* When a user refresh the page he remain authenticated */ } 
                    <Route element= { <RequireAuth  allowedRoles={[ROLES.Member, ROLES.Admin ]}/> }> { /* Only when we have a user we can show the comp's inside the Required Auth*/ }
                      <Route path="/pitches/add" element={<Test />}></Route>

                    </Route>

                    <Route element= { <RequireAuth  allowedRoles={[ROLES.Admin]}/> }> { /* Only when we have a user we can show the comp's inside the Required Auth*/ }
                      <Route path="/users" element={<Users />}></Route>
                    </Route>
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
