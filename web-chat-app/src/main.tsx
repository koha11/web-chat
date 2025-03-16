import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { StrictMode } from 'react';
// import { StrictMode } from 'react';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  //   <BrowserRouter>
  //     <App />
  //   </BrowserRouter>
  // </StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
