// src/providers/i18nProvider.js
import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from '../i18n/en'; // Assuming you moved the file to src/i18n/en.js

const i18nProvider = polyglotI18nProvider(() => Promise.resolve(en), 'en');

export default i18nProvider;