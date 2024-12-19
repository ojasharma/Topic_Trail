import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter , Route, Routes } from 'react-router-dom'; // Importing Router
import App from './App';
import './index.css'; // Global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>
);
