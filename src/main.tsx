import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/firebase';
import { PortfolioDataProvider } from './context/PortfolioDataContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortfolioDataProvider>
      <App />
    </PortfolioDataProvider>
  </StrictMode>,
);
