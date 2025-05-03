import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'aos/dist/aos.css';
import './index.css';
import AOS from 'aos';

AOS.init();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);