import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import './i18n'
import App from './App.jsx';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.MODE === 'production'
  ? 'https://amrutapapad.vercel.app'
  : (import.meta.env.VITE_API_URL || '');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
