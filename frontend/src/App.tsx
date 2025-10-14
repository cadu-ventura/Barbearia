import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import './styles/globals.css'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;