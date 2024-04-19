// src/login/Login.js
import React from 'react';
import { Login as RALogin, LoginForm } from 'react-admin';

const CustomLogin = (props) => (
  <RALogin {...props}>
    <LoginForm />
  </RALogin>
);

export default CustomLogin;