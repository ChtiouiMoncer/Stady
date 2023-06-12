import { Box, Stack, ThemeProvider } from '@mui/material';
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import {theme} from "./theme"
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './components/homePage/HomePage';
import NotFound from './components/NotFound';
import RequireAuth from './components/RequireAuth';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import Unauthorized from './components/Unauthorized.js';
import PersistLogin from './components/PersistLogin';
import AuthGuard from './components/AuthGuard ';
import PitchesList from './components/pitches/PitchesList';
import PitchInfo from './components/pitches/pitchCards/PitchInfo';
import PitchCard from './components/pitches/pitchCards/PitchCards';
import AdminDashboard from './components/admin/AdminDashboard';
import PitchesManagement from './components/admin/PitchesManagement';
import AllReservations from './components/admin/AllReservations';
import Users from './components/admin/Users';
import Addpitch from './components/owner/Addpitch';
import OwnerDashboard from './components/owner/OwnerDashboard';
import OwnerPitches from './components/owner/OwnerPitches';
import Reservations from './components/member/Reservations';
import MakeReservation from './components/member/MakeReservation';
import HorizontalLinearStepper from './components/chat';



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
              <Stack display='flex' flexDirection='column'>
                <Routes>
                  {/* Public Routes */}
                  <Route element={ <PersistLogin /> }>  { /* When a user refresh the page he remain authenticated */ }
                      
                  <Route path="/test" element={  <HorizontalLinearStepper />}></Route>

                      <Route path="/" element={  <HomePage /> }></Route>
                      <Route path="/pitches" element={  <PitchesList /> }></Route>
                      <Route path="/pitche/info" element={  <PitchInfo /> }></Route>
                      <Route path="/unauthorized" element={  <Unauthorized /> } />


                    <Route element= { <AuthGuard  /> }> { /*If we have a user logged in we redirect to '/'*/ }
                      <Route path="/login" element={  <LoginPage /> } />
                      <Route path="/signup" element={  <SignUpPage /> } />
                    </Route>  
 

                    { /* Protected Routes */}

                      { /* Admin Protected Routes */}
                      <Route element= { <RequireAuth  allowedRoles={[ ROLES.Admin ]}/> }> { /* Only when we have a user we can show the comp's inside the Required Auth*/ }
                        <Route path="/admin/dashboard" element={<AdminDashboard/>}></Route>
                        <Route path="/admin/manage/users" element={<Users />}></Route>.
                        <Route path="/admin/manage/reservations" element={<AllReservations />}></Route>
                        <Route path="/admin/manage/pitches" element={<PitchesManagement />}></Route>
                      </Route>

                       { /* Owner Protected Routes */}
                      <Route element= { <RequireAuth  allowedRoles={[ ROLES.Owner ]}/> }> { /* Only when we have a user we can show the comp's inside the Required Auth*/ }
                        <Route path="/owner/dashboard" element={<OwnerDashboard/>}></Route>
                        <Route path="/owner/pitches" element={<OwnerPitches />}></Route>.
                        <Route path="/owner/add/pitch" element={<Addpitch />}></Route>
                      </Route>   

                      { /* Member Protected Routes */}
                      <Route element= { <RequireAuth  allowedRoles={[ ROLES.Member ]}/> }> { /* Only when we have a user we can show the comp's inside the Required Auth*/ }
                        <Route path="/member/reservations" element={<Reservations/>}></Route>
                        <Route path="/member/reservation" element={<MakeReservation/>}></Route>
                      </Route>   

                    {/* catch All */}
                    <Route path="*" element={<NotFound />}></Route>
                  </Route>
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
