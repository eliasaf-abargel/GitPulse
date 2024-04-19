import React from 'react';
import { Admin, Resource } from 'react-admin';
import { Route } from 'react-router-dom';
import dataProvider from './providers/dataProvider';
import authProvider from './providers/authProvider';
import i18nProvider from './providers/i18nProvider';
import CustomLayout from './layout/Layout';
import { Dashboard } from './dashboard/Dashboard';
import Login from './login/Login';
import { lightTheme, darkTheme } from './themes';
import UsersResourceWithRoutes from './resources/UsersResourceWithRoutes';
import TeamsResourceWithRoutes from './resources/TeamsResourceWithRoutes';
import RepositoriesResource from './resources/RepositoriesResource';
import OrganizationsResource from './resources/OrganizationsResource';
import MainImage from './components/MainImage';

const UsersResourceWithRoutes = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    i18nProvider={i18nProvider}
    dashboard={Dashboard}
    loginPage={Login}
    layout={CustomLayout}
    theme={lightTheme}
    darkTheme={darkTheme}
    defaultTheme="light"
  >
    <MainImage />
    <Resource name="users" {...UsersResourceWithRoutes} />
    <Resource name="teams" {...TeamsResourceWithRoutes} />
    <Resource name="repositories" {...RepositoriesResource} />
    <Resource name="organizations" {...OrganizationsResource} />
  </Admin>
);

export default UsersResourceWithRoutes;
