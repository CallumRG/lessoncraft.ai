import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import PasswordForgetPage from '../PasswordForget';
import * as constants from '../../constants/routes'

const App = () => (
  <Router>
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
  </Router>
);

export default App;