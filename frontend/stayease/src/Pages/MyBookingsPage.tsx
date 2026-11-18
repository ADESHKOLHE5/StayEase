import { Container, Typography, Box } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TenantMyBookings from '../components/TenantMyBookings';

const MyBookingsPage = () => {
  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '80vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Page header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{
              width: 44, height: 44, bgcolor: '#fff5f5', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <EventNoteIcon sx={{ color: '#e53e3e', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827' }}>
                My Bookings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track and manage all your booking requests
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Booking list */}
        <TenantMyBookings />
      </Container>
    </Box>
  );
};

export default MyBookingsPage;
