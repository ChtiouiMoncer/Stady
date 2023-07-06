import { Box, Stack, ThemeProvider } from '@mui/material';
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
import AdminDashboard from './components/admin/stats/AdminDashboard';
import Addpitch from './components/owner/Addpitch';
import OwnerPitches from './components/owner/OwnerPitches';
import Reservations from './components/member/Reservations';
import OwnerDashboardStats from './components/owner/OwnerDashboardStats';
import PendingPitches from './components/admin/managePitches/pendingPitches/PendingPitches';
import ApprovedPitches from './components/admin/managePitches/approvedPitches/ApprovedPitches';
import RejectedPitches from './components/admin/managePitches/rejectedPitches/RejectedPitches';
import PitchCards from './components/pitches/PitchCards';
import TimeslotSelection from './components/pitches/TimeslotsSelection';
import UserFeedback from './components/member/UserFeedback';
import SearchAllPitches from './components/pitches/SearchAllPitches';
import About from './components/homePage/About';
import HowItWorks from './components/homePage/HowItWorks';
import AppContact from './components/homePage/AppContact';
import AppTerms from './components/homePage/AppTerms';
import UserProfile from './components/auth/UserProfile';
import './i18n';
import ManageReservation from './components/admin/manageReservation/ManageReservation';
import MemberMangement from './components/admin/manageMembers/MemberMangement';
import ManageMembers from './components/admin/manageMembers/ManageMembers';
import ManageOwners from './components/admin/manageOwners/ManageOwners';
import ManageSportsType from './components/admin/manageSportsType/ManageSportsType';
import SuperAdminDashboard from './components/superAdmin/stats/SuperAdminDashboard';
import ManageAdmins from './components/superAdmin/manageAdmins/ManageAdmins';
import AdminSignUpPage from './components/superAdmin/manageAdmins/AdminSignUpPage';





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
                      
                      <Route path="/" element={  <HomePage /> }></Route>
                      <Route path="/unauthorized" element={  <Unauthorized /> } />
                      <Route path="/stady/feedback" element={<UserFeedback/>}></Route>
                      <Route path="/about" element={<About/>}></Route>
                      <Route path="/process" element={<HowItWorks/>}></Route>
                      <Route path="/process" element={<HowItWorks/>}></Route>
                      <Route path="/contact" element={<AppContact/>}></Route>
                      <Route path="/terms" element={<AppTerms/>}></Route>


                      <Route path="/pitches" element={  <PitchCards /> }></Route>
                      <Route path="/pitches/search" element={  <SearchAllPitches /> }></Route>
                      <Route path="/timeslots/:pitchName" element={<TimeslotSelection />} />



                    <Route element= { <AuthGuard  /> }> { /*If we have a user logged in we redirect to '/'*/ }
                      <Route path="/login" element={  <LoginPage /> } />
                      <Route path="/signup" element={  <SignUpPage /> } />
                    </Route>  
 

                    { /* Protected Routes */}

                      { /* Admin Protected Routes */}
                      <Route element= { <RequireAuth  allowedRoles={[ ROLES.SUPER_ADMIN ]}/> }> { /* Only when we have a user we can show the comp's inside the Required Auth*/ }

                        { /* Dashboared Overview */}
                        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard/>}></Route>
                        { /* Manage Pitches */}
                        <Route path="/superadmin/manage/users/admins" element={<ManageAdmins  />}></Route>
                        <Route path="/superadmin/manage/users/admins/add" element={<AdminSignUpPage  />}></Route>

                      
                      </Route>

                      { /* Admin Protected Routes */}
                      <Route element= { <RequireAuth  allowedRoles={[ ROLES.Admin ]}/> }> { /* Only when we have a user we can show the comp's inside the Required Auth*/ }

                        { /* Dashboared Overview */}
                        <Route path="/admin/dashboard" element={<AdminDashboard/>}></Route>

                        { /* Manage Pitches */}
                        <Route path="/admin/manage/pitches/pending" element={<PendingPitches />}></Route>
                        <Route path="/admin/manage/pitches/approved" element={<ApprovedPitches />}></Route>
                        <Route path="/admin/manage/pitches/rejected" element={<RejectedPitches />}></Route>


                        <Route path="/admin/manage/reservations" element={<ManageReservation  />}></Route>
                        <Route path="/admin/manage/users/members" element={<ManageMembers  />}></Route>
                        <Route path="/admin/manage/users/owners" element={<ManageOwners  />}></Route>
                        <Route path="/admin/manage/sportsType" element={<ManageSportsType  />}></Route>

                      
                      </Route>

                       { /* Owner Protected Routes */}
                      <Route element= { <RequireAuth  allowedRoles={[ ROLES.Owner ]}/> }> { /* Only when we have a user we can show the comp's inside the Required Auth*/ }
                        <Route path="/owner/dashboard" element={<OwnerDashboardStats/>}></Route>
                        <Route path="/owner/pitches" element={<OwnerPitches />}></Route>.
                        <Route path="/owner/add/pitch" element={<Addpitch />}></Route>
                      </Route>   

                      { /* Member Protected Routes */}
                      <Route element= { <RequireAuth  allowedRoles={[ ROLES.Member ]}/> }> { /* Only when we have a user we can show the comp's inside the Required Auth*/ }
                        <Route path="/member/reservations" element={<Reservations/>}></Route>
                      </Route>   

                      { /* Member & Owner Shared Routes */}
                      <Route element= { <RequireAuth  allowedRoles={[ ROLES.Member, ROLES.Owner ]}/> }> { /* Only when we have a user we can show the comp's inside the Required Auth*/ }
                        <Route path="/profile/user/:userName" element={<UserProfile/>}></Route>
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
