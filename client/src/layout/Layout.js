import React from 'react';
import { Layout as RaLayout, AppBar, Sidebar, Menu, MenuItemLink } from 'react-admin';
import { SvgIconCustom } from './SvgIconCustom';

const CustomMenu = () => (
  <Menu>
    <MenuItemLink to="/users" primaryText="Users" leftIcon={<SvgIconCustom path="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />} />
    <MenuItemLink to="/teams" primaryText="Teams" leftIcon={<SvgIconCustom path="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />} />
    <MenuItemLink to="/repositories" primaryText="Repositories" leftIcon={<SvgIconCustom path="M20 8V6c0-1.11-.89-2-2-2h-3v2h3v2h-4v3h4v2H9.5c-.28 0-.5.22-.5.5v3c0 .28.22.5.5.5H11v-2H9V8h11zM8 8V6c0-1.11-.89-2-2-2H3c-1.11 0-2 .89-2 2v2h3v2H1v3h3c0 1.66 1.34 3 3 3h3v-2H7c-.56 0-1-.44-1-1v-3h3V8H8z" />} />
    <MenuItemLink to="/organizations" primaryText="Organizations" leftIcon={<SvgIconCustom path="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />} />
  </Menu>
);

const MyAppBar = () => <AppBar />;
const MySidebar = () => <Sidebar />;

export const CustomLayout = (props) => (
  <RaLayout
    {...props}
    appBar={MyAppBar}
    sidebar={MySidebar}
    menu={CustomMenu}
  />
);

export default CustomLayout;