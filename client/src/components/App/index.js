import {React, useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";

import SB from '../Sidebar';
import Topbar from '../Topbar';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import PasswordForgetPage from '../PasswordForget';
import * as constants from '../../constants/routes'

const App = () => {
  const [theme, colorMode] = useMode();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return(
    <Router>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>

          <div className='app'>

            <SB isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
            <main className="content">
                <Topbar/>
                <Routes>
                  <Route path={constants.LANDING} element={<LandingPage />} />
                  <Route path={constants.SIGN_UP} element={<SignUpPage />} />
                  <Route path={constants.SIGN_IN} element={<SignInPage />} />
                  <Route path={constants.HOME} element={<HomePage />} />
                  <Route path={constants.ACCOUNT} element={<AccountPage />} />
                  <Route path={constants.ADMIN} element={<AdminPage />} />
                  <Route path={constants.PASSWORD_FORGET} element={<PasswordForgetPage />} />

                  {/* Default Route */}
                  <Route path="*" element={<LandingPage />} />
                </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Router>
  )
};

export default App;