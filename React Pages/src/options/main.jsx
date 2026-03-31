import React from 'react';
import ReactDOM from 'react-dom/client';
import Options from './Options';
import '../index.css';

// Theme init — runs before React render to prevent flash
const t = localStorage.getItem('autofiller-theme');
if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.setAttribute('data-theme', 'dark');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
