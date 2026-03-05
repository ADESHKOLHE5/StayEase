import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Accommodations from './pages/Accommodations';
import PropertyDetail from './pages/PropertyDetail';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerListings from './pages/OwnerListings';
import OwnerBookings from './pages/OwnerBookings';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Owner Protected Route
const OwnerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'OWNER') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes - Tenant */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        <Route path="/accommodations" element={
          <ProtectedRoute>
            <Accommodations />
          </ProtectedRoute>
        } />
        
        <Route path="/property/:id" element={
          <ProtectedRoute>
            <PropertyDetail />
          </ProtectedRoute>
        } />
        
        {/* Protected Routes - Owner */}
        <Route path="/owner/dashboard" element={
          <OwnerRoute>
            <OwnerDashboard />
          </OwnerRoute>
        } />
        
        <Route path="/owner/listings" element={
          <OwnerRoute>
            <OwnerListings />
          </OwnerRoute>
        } />
        
        <Route path="/owner/bookings" element={
          <OwnerRoute>
            <OwnerBookings />
          </OwnerRoute>
        } />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
