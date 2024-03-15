import {React, useState, useEffect} from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import {API_URL} from '../../config';

import SB from '../Sidebar';
import Topbar from '../Topbar';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import ExplorePage from '../Explore';
import SearchPage from '../SearchPage';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import PasswordForgetPage from '../PasswordForget';
import CreatePage from '../Create';
import NewCourse from '../NewCourse';
import Firebase from '../Firebase/firebase';
import ProfilePage from '../ProfilePage';
import CoursePage from "../CoursePage";
import CourseAdmin from "../CourseAdmin";
import NewLesson from '../NewLesson';
import LessonPage from '../LessonPage';
import LessonDash from '../LessonDash';
import Loading from '../Loading';

import * as constants from '../../constants/routes'

const App = () => {
  const firebase = new Firebase();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, colorMode] = useMode();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const logout = () => {
    firebase.doSignOut();
    toast.success("Sign out Successful!");
    navigate('/');
  }

  const makeUserFetchRequest = (firebaseId) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API_URL}/getUserDetails`,
        headers: { 
            'Content-Type': 'application/json'
        },
        params : {
            firebase_uid: firebaseId
        }
    };
    return config;
  };

  const fetchUserDetails = async (authUser) => {
    const userRequest = makeUserFetchRequest(authUser.uid);

    axios.request(userRequest)
    .then((response) => {
        const currUser = { id:response.data.id, 
          firstName: response.data.first_name, 
          lastName: response.data.last_name, 
          email:authUser.email, 
          uid: authUser.uid, 
          created_at: response.data.created_at,
          updated_at: response.data.updated_at
        };
        console.log('curruser:', currUser);
        setUser(currUser);
        setLoading(false);
    })
    .catch((error) => {
        console.log(error);
        setLoading(false);
    });
  };

  // check session on render
  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        fetchUserDetails(authUser);
      } else {
        setUser(null);
        setLoading(false);
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
            <main className="content" style={{marginLeft: isCollapsed ? "80px" : "250px", transition: "margin-left 0.3s ease",}}>
                <Topbar user={user} isCollapsed={isCollapsed}/>
                <div style={{marginTop: 80}}>
                {loading ? 
                  (
                    <Loading/>
                  ) 
                  : 
                  (
                      <Routes>
                        <Route path={constants.LANDING} element={<LandingPage />} />
                        <Route path={constants.SIGN_UP} element={<SignUpPage/>} />
                        <Route path={constants.SIGN_IN} element={<SignInPage/>} />
                        <Route path={constants.EXPLORE} element={<ExplorePage />} />
                        <Route path={constants.SEARCH} element={<SearchPage />} />
                        <Route path={constants.CREATE} element={<CreatePage />} />
                        <Route path={constants.NEWCOURSE} element={<NewCourse />} />
                        <Route path={constants.NEWLESSON} element={<NewLesson user={user}/>} />
                        <Route path={constants.LESSON} element={<LessonPage user={user} isCollapsed={isCollapsed}/>} />
                        <Route path={constants.LESSONSBYME} element={<LessonDash user={user}/>} />
                        <Route path={constants.LIKEDLESSONS} element={<LessonDash user={user}/>} />
                        <Route path={constants.PROFILE_PAGE} element={<ProfilePage user={user}/>} />
                        <Route path={constants.COURSE} element={<CoursePage />} />
                        <Route path={constants.COURSE_ADMIN} element={<CourseAdmin />} />
                        <Route path={constants.PASSWORD_FORGET} element={<PasswordForgetPage />} />
                        {/* Default Route */}
                        <Route path="*" element={<LandingPage />} />
                      </Routes>
                  )
                }
                </div>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
  )
};

export default App;