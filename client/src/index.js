// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.module.css';
import App from './App'; // ✅ This matches App.jsx

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
