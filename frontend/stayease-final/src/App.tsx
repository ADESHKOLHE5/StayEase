import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useStore } from './store';

import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EditProfile from './pages/EditProfile';
import Accommodations from './pages/Accommodations';
import PropertyDetail from './pages/PropertyDetail';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerListings from './pages/OwnerListings';
import OwnerBookings from './pages/OwnerBookings';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e53e3e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const OwnerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, currentUser } = useStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (currentUser?.role !== 'OWNER') return <Navigate to="/" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes - Tenant */}
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/accommodations" element={<ProtectedRoute><Accommodations /></ProtectedRoute>} />
          <Route path="/property/:id" element={<ProtectedRoute><PropertyDetail /></ProtectedRoute>} />
          
          {/* Protected Routes - Owner */}
          <Route path="/owner/dashboard" element={<OwnerRoute><OwnerDashboard /></OwnerRoute>} />
          <Route path="/owner/listings" element={<OwnerRoute><OwnerListings /></OwnerRoute>} />
          <Route path="/owner/bookings" element={<OwnerRoute><OwnerBookings /></OwnerRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
