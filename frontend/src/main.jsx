import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/common/ErrorBoundary';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CustomerProvider } from './context/CustomerContext';
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CustomerProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </CustomerProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);