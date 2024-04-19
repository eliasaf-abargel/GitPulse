// src/providers/dataProvider.js
import { JsonServerProvider } from 'ra-data-json-server';

const dataProvider = JsonServerProvider(`${process.env.REACT_APP_API_URL}`);

export default dataProvider;