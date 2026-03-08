import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper, Chip } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useStore } from '../store';

const OwnerBookings: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, bookings, properties, users, updateBookingStatus } = useStore();

  const ownerBookings = useMemo(() => 
    bookings.filter(b => b.ownerId === currentUser?.userId),
    [bookings, currentUser]
  );

  const pendingBookings = ownerBookings.filter(b => b.status === 'PENDING');
  const processedBookings = ownerBookings.filter(b => b.status !== 'PENDING');

  const handleApprove = (bookingId: string) => {
    updateBookingStatus(bookingId, 'APPROVED');
  };

  const handleDecline = (bookingId: string) => {
    updateBookingStatus(bookingId, 'REJECTED');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>Booking Requests</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Manage your incoming applications</Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Button sx={{ mr: 2, pb: 1, borderBottom: 2, borderColor: '#e53e3e', color: '#e53e3e', fontWeight: 600 }}>
            Booking Requests
          </Button>
          <Button onClick={() => navigate('/owner/listings')} sx={{ pb: 1, color: 'text.secondary' }}>
            My Listings
          </Button>
        </Box>

        {pendingBookings.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Pending Requests</Typography>
            <Paper elevation={0} sx={{ border: 1, borderColor: 'grey.200' }}>
              {pendingBookings.map(booking => {
                const property = properties.find(p => p.propertyId === booking.propertyId);
                const tenant = users.find(u => u.userId === booking.tenantId);
                return (
                  <Box key={booking.bookingId} sx={{ p: 3, borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                        <Box sx={{ width: 48, height: 48, bgcolor: '#e53e3e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Typography variant="h6" color="white" fontWeight={600}>
                            {tenant?.firstName.charAt(0)}{tenant?.lastName.charAt(0)}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="h6" fontWeight={600}>{tenant?.firstName} {tenant?.lastName}</Typography>
                            <Chip label="PENDING" size="small" sx={{ bgcolor: '#fef3c7', color: '#d97706', fontWeight: 600 }} />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Application for <strong>{property?.propertyName}</strong>
                          </Typography>
                          
                          {/* All Tenant Details */}
                          <Box sx={{ mt: 1, p: 2, bgcolor: '#f7fafc', borderRadius: 1 }}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary">TENANT DETAILS:</Typography>
                            <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                              <Typography variant="body2"><strong>Email:</strong> {tenant?.email}</Typography>
                              <Typography variant="body2"><strong>Phone:</strong> {tenant?.phone}</Typography>
                              {tenant?.gender && (
                                <Typography variant="body2"><strong>Gender:</strong> {tenant.gender}</Typography>
                              )}
                              <Typography variant="body2"><strong>Role:</strong> {tenant?.role}</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                              Requested on {new Date(booking.requestDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CloseIcon />}
                          onClick={() => handleDecline(booking.bookingId)}
                          sx={{ color: 'error.main', borderColor: 'error.main' }}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CheckIcon />}
                          onClick={() => handleApprove(booking.bookingId)}
                          sx={{ bgcolor: '#e53e3e', '&:hover': { bgcolor: '#c53030' } }}
                        >
                          Approve
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Paper>
          </Box>
        )}

        {processedBookings.length > 0 && (
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Recent Activity</Typography>
            <Paper elevation={0} sx={{ border: 1, borderColor: 'grey.200' }}>
              {processedBookings.map(booking => {
                const property = properties.find(p => p.propertyId === booking.propertyId);
                const tenant = users.find(u => u.userId === booking.tenantId);
                return (
                  <Box key={booking.bookingId} sx={{ p: 3, borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                        <Box sx={{ 
                          width: 48, 
                          height: 48, 
                          bgcolor: booking.status === 'APPROVED' ? '#d1fae5' : '#fee2e2', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          flexShrink: 0 
                        }}>
                          <Typography variant="h6" color={booking.status === 'APPROVED' ? '#065f46' : '#991b1b'} fontWeight={600}>
                            {tenant?.firstName.charAt(0)}{tenant?.lastName.charAt(0)}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="h6" fontWeight={600}>{tenant?.firstName} {tenant?.lastName}</Typography>
                            {booking.status === 'APPROVED' && (
                              <Chip label="CONFIRMED" size="small" sx={{ bgcolor: '#d1fae5', color: '#065f46', fontWeight: 600 }} />
                            )}
                            {booking.status === 'REJECTED' && (
                              <Chip label="DECLINED" size="small" sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 600 }} />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Application for <strong>{property?.propertyName}</strong>
                          </Typography>

                          {/* All Tenant Details in Recent Activity */}
                          <Box sx={{ mt: 1, p: 2, bgcolor: '#f7fafc', borderRadius: 1 }}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary">TENANT DETAILS:</Typography>
                            <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                              <Typography variant="body2"><strong>Email:</strong> {tenant?.email}</Typography>
                              <Typography variant="body2"><strong>Phone:</strong> {tenant?.phone}</Typography>
                              <Typography variant="body2"><strong>First Name:</strong> {tenant?.firstName}</Typography>
                              <Typography variant="body2"><strong>Last Name:</strong> {tenant?.lastName}</Typography>
                              {tenant?.gender && (
                                <Typography variant="body2"><strong>Gender:</strong> {tenant.gender}</Typography>
                              )}
                              <Typography variant="body2"><strong>Role:</strong> {tenant?.role}</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                              {booking.status === 'APPROVED' ? 'Approved' : 'Declined'} on {booking.approvalDate ? new Date(booking.approvalDate).toLocaleDateString() : 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      {/* Re-confirmation buttons - can change status */}
                      <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                        {booking.status === 'APPROVED' ? (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CloseIcon />}
                            onClick={() => handleDecline(booking.bookingId)}
                            sx={{ color: 'error.main', borderColor: 'error.main' }}
                          >
                            Decline
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<CheckIcon />}
                            onClick={() => handleApprove(booking.bookingId)}
                            sx={{ bgcolor: '#e53e3e', '&:hover': { bgcolor: '#c53030' } }}
                          >
                            Re-Confirm
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Paper>
          </Box>
        )}

        {ownerBookings.length === 0 && (
          <Paper elevation={0} sx={{ p: 8, textAlign: 'center', border: 1, borderColor: 'grey.200' }}>
            <Typography variant="h6" color="text.secondary">No booking requests yet</Typography>
            <Typography variant="body2" color="text.secondary">Applications from tenants will appear here</Typography>
          </Paper>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default OwnerBookings;
