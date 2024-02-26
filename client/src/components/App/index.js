import {React, useState, useEffect} from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SB from '../Sidebar';
import Topbar from '../Topbar';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import ExplorePage from '../Explore';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import PasswordForgetPage from '../PasswordForget';
import CreatePage from '../Create';
import NewCourse from '../NewCourse';
import * as constants from '../../constants/routes'
import Firebase from '../Firebase/firebase';
import ProfilePage from '../ProfilePage';
import CoursePage from "../CoursePage";
import CourseAdmin from "../CourseAdmin";

const App = () => {
  const firebase = new Firebase();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [theme, colorMode] = useMode();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const logout = () => {
    firebase.doSignOut();
    toast.success("Sign out Successful!");
    navigate('/');
  }

  // check session on render
  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  return(
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>

          <div className='app'>
            <ToastContainer/>

            <SB isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} user={user} logout={logout}/>
            <main className="content">
                <Topbar user={user}/>
                <Routes>
                  <Route path={constants.LANDING} element={<LandingPage />} />
                  <Route path={constants.SIGN_UP} element={<SignUpPage/>} />
                  <Route path={constants.SIGN_IN} element={<SignInPage/>} />
                  <Route path={constants.EXPLORE} element={<ExplorePage />} />
                  <Route path={constants.ACCOUNT} element={<AccountPage />} />
                  <Route path={constants.ADMIN} element={<AdminPage />} />
                  <Route path={constants.PASSWORD_FORGET} element={<PasswordForgetPage />} />
                  <Route path={constants.CREATE} element={<CreatePage />} />
                  <Route path={constants.NEWCOURSE} element={<NewCourse />} />
                  <Route path={constants.PROFILE_PAGE} element={<ProfilePage />} />
                  <Route path={constants.COURSE} element={<CoursePage />} />
                  <Route path= {constants.COURSE_ADMIN} element={<CourseAdmin />} />
                  {/* Default Route */}
                  <Route path="*" element={<LandingPage />} />
                </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
  )
};

export default App;