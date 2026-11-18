import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';
import { Add as AddIcon, Assignment as AssignmentIcon } from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import OwnerMyListing from '../components/OwnerMyListing';

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ color: '#111827' }}>
          StayEase <span style={{ color: '#e53e3e' }}>Manager</span>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Welcome back, {user?.sub || 'Owner'}. Manage your properties below.
        </Typography>
      </Box>

      {/* Add Property Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<AssignmentIcon />}
          onClick={() => navigate('/owner/bookings')}
          sx={{
            borderColor: '#e53e3e',
            color: '#e53e3e',
            px: 4,
            py: 1.5,
            fontWeight: 700,
            borderRadius: '50px',
            '&:hover': { bgcolor: '#fff5f5', borderColor: '#c53030' },
          }}
        >
          Manage Bookings
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/owner/addProperty')}
          sx={{
            bgcolor: '#e53e3e',
            px: 4,
            py: 1.5,
            fontWeight: 700,
            borderRadius: '50px',
            boxShadow: '0 4px 14px rgba(229,62,62,0.4)',
            '&:hover': { bgcolor: '#c53030', boxShadow: '0 6px 20px rgba(229,62,62,0.5)' },
          }}
        >
          Add Property
        </Button>
      </Box>

      {/* My Listings */}
      <OwnerMyListing />

    </Container>
  );
};

export default OwnerDashboard;