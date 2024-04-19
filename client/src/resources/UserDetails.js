import React from 'react';
import { Show, SimpleShowLayout, TextField, EmailField } from 'react-admin';

export const UserDetails = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="username" />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="avatarUrl" />
      <TextField source="company" />
      <TextField source="location" />
    </SimpleShowLayout>
  </Show>
);