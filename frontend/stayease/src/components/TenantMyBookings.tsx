import { useState } from 'react';
import {
  Box, Typography, Card, CardContent, CardMedia, Grid, Button, Chip,
  CircularProgress, Alert, Paper, Stack, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions, Snackbar, IconButton,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CancelIcon from '@mui/icons-material/Cancel';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import CloseIcon from '@mui/icons-material/Close';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import useFetch from '../hooks/useFetch';
import axiosInstance from '../api/axiosInstance';

// ── Status styling ──
const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  PENDING:   { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
  APPROVED:  { bg: '#dcfce7', color: '#16a34a', label: 'Approved' },
  REJECTED:  { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
  CANCELLED: { bg: '#f3f4f6', color: '#6b7280', label: 'Cancelled' },
};

interface Booking {
  bookingId: number;
  propertyId: string;
  propertyName: string;
  propertyImageUrl?: string;
  propertyAddress?: string;
  propertyCity?: string;
  propertyState?: string;
  propertyType?: string;
  tenantId: number;
  tenantUsername: string;
  ownerId: number;
  ownerName: string;
  status: string;
  rentAmount: number;
  totalPrice?: number;
  checkInDate?: string;
  checkOutDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  numberOfRooms?: number;
  numberOfGuests?: number;
  requestDate: string;
  approvalDate?: string;
}

const TenantMyBookings = () => {
  const { data: bookings, loading, error } = useFetch('/bookings/tenant/my');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });
  const [contactDialog, setContactDialog] = useState<{ open: boolean; data: any }>({
    open: false, data: null,
  });
  const [cancelledIds, setCancelledIds] = useState<number[]>([]);

  // ── Cancel a PENDING booking ──
  const handleCancel = async (bookingId: number) => {
    setActionLoading(bookingId);
    try {
      await axiosInstance.delete(`/bookings/tenant/cancel/${bookingId}`);
      setCancelledIds(prev => [...prev, bookingId]);
      setSnackbar({ open: true, message: 'Booking cancelled successfully.', severity: 'success' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to cancel booking.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  // ── Get owner contact for APPROVED booking ──
  const handleContact = async (bookingId: number) => {
    setActionLoading(bookingId);
    try {
      const res = await axiosInstance.get(`/bookings/tenant/contact/${bookingId}`);
      setContactDialog({ open: true, data: res.data });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to get contact details.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  // 1. Loading → spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress sx={{ color: '#e53e3e' }} />
      </Box>
    );
  }

  // 2. Real server/network error → friendly message
  if (error) {
    return (
      <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '1.5px dashed #fecaca', bgcolor: '#fff5f5' }}>
        <Typography variant="h6" fontWeight={600} sx={{ color: '#991b1b', mb: 1 }}>
          We're currently having a technical issue.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please try again later.
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}
          sx={{ bgcolor: '#e53e3e', fontWeight: 600, borderRadius: '10px', px: 4, boxShadow: 'none', '&:hover': { bgcolor: '#c53030' } }}>
          Retry
        </Button>
      </Paper>
    );
  }

  // 3. data is null (404 / not-yet-hydrated) → no flash
  if (bookings === null) return null;

  // 4. Empty array → empty state
  if (Array.isArray(bookings) && bookings.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '1.5px dashed #e0e0e0', bgcolor: '#fafafa' }}>
        <HomeWorkIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 2 }} />
        <Typography variant="h6" fontWeight={600} color="text.secondary">No bookings yet</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Browse properties and make your first booking request!
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#111827' }}>
        📋 My Bookings ({bookings.length})
      </Typography>

      <Grid container spacing={3}>
        {bookings.map((booking: Booking) => {
          const effectiveStatus = cancelledIds.includes(booking.bookingId) ? 'CANCELLED' : booking.status;
          const status = statusConfig[effectiveStatus] || statusConfig.PENDING;

          return (
            <Grid size={12} key={booking.bookingId}>
              <Card sx={{
                display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                p: 2.5, borderRadius: 4, border: '1.5px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'all 0.25s ease',
                '&:hover': { borderColor: '#fecaca', boxShadow: '0 8px 24px rgba(229,62,62,0.12)', transform: 'translateY(-2px)' },
              }}>
                {/* Image */}
                <CardMedia
                  component="img"
                  image={booking.propertyImageUrl || 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=300&q=80'}
                  alt={booking.propertyName}
                  sx={{
                    width: { xs: '100%', sm: 200 }, height: { xs: 160, sm: 140 },
                    borderRadius: 3, objectFit: 'cover', mr: { sm: 3 }, mb: { xs: 2, sm: 0 },
                  }}
                />

                {/* Content */}
                <CardContent sx={{ flex: 1, p: 0, '&:last-child': { pb: 0 } }}>
                  {/* Title + Status */}
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#111827' }}>
                      {booking.propertyName}
                    </Typography>
                    {booking.propertyType && (
                      <Chip label={booking.propertyType} size="small"
                        sx={{ bgcolor: '#fff5f5', color: '#e53e3e', fontWeight: 600, fontSize: '0.7rem' }} />
                    )}
                    <Chip label={status.label} size="small"
                      sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: '0.7rem', ml: 'auto' }} />
                  </Box>

                  {/* Address */}
                  {(booking.propertyAddress || booking.propertyCity) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: '#e53e3e' }} />
                      <Typography variant="body2" color="text.secondary">
                        {booking.propertyAddress}{booking.propertyCity ? `, ${booking.propertyCity}` : ''}
                        {booking.propertyState ? `, ${booking.propertyState}` : ''}
                      </Typography>
                    </Box>
                  )}

                  {/* Stats row */}
                  <Stack direction="row" spacing={3} sx={{ mb: 1.5, flexWrap: 'wrap' }}>
                    {booking.checkInDate && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <EventIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="body2" fontWeight={500}>
                          {booking.checkInDate} → {booking.checkOutDate}
                        </Typography>
                      </Box>
                    )}
                    {booking.numberOfRooms && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MeetingRoomIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="body2" fontWeight={500}>{booking.numberOfRooms} room(s)</Typography>
                      </Box>
                    )}
                    {booking.numberOfGuests && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PeopleIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="body2" fontWeight={500}>{booking.numberOfGuests} guest(s)</Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Price row */}
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>Rent/month</Typography>
                      <Typography variant="body1" sx={{ color: '#e53e3e', fontWeight: 700 }}>
                        ₹{booking.rentAmount?.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                    {booking.totalPrice && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Total</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          ₹{booking.totalPrice.toLocaleString('en-IN')}
                        </Typography>
                      </Box>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto !important' }}>
                      {/* Owner: {booking.ownerName} */}
                      Owner: {booking.ownerName.length > 3 ? `${booking.ownerName.substring(0, 3)}****` : booking.ownerName}
                    </Typography>
                  </Stack>
                </CardContent>

                {/* Actions */}
                <Box sx={{
                  display: 'flex', flexDirection: { xs: 'row', sm: 'column' },
                  justifyContent: { xs: 'flex-end', sm: 'center' },
                  gap: 1.5, ml: { sm: 2 }, mt: { xs: 2, sm: 0 },
                }}>
                  {effectiveStatus === 'PENDING' && (
                    <Button
                      variant="outlined" size="small" startIcon={<CancelIcon />}
                      onClick={() => handleCancel(booking.bookingId)}
                      disabled={actionLoading === booking.bookingId}
                      sx={{
                        borderColor: '#d32f2f', color: '#d32f2f', fontWeight: 600,
                        borderRadius: '10px', px: 2,
                        '&:hover': { bgcolor: '#ffebee', borderColor: '#b71c1c' },
                      }}
                    >
                      {actionLoading === booking.bookingId ? <CircularProgress size={18} /> : 'Cancel'}
                    </Button>
                  )}
                  {effectiveStatus === 'APPROVED' && (
                    <Button
                      variant="contained" size="small" startIcon={<ContactPhoneIcon />}
                      onClick={() => handleContact(booking.bookingId)}
                      disabled={actionLoading === booking.bookingId}
                      sx={{
                        bgcolor: '#16a34a', fontWeight: 600, borderRadius: '10px', px: 2,
                        '&:hover': { bgcolor: '#15803d' },
                      }}
                    >
                      {actionLoading === booking.bookingId ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Contact'}
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* ── Contact Details Dialog ── */}
      <Dialog open={contactDialog.open} onClose={() => setContactDialog({ open: false, data: null })} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Owner Contact Details
          <IconButton onClick={() => setContactDialog({ open: false, data: null })}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {contactDialog.data && (
            <Box>
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                {contactDialog.data.message}
              </Alert>
              <Divider sx={{ my: 1.5 }} />
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Property</Typography>
                  <Typography variant="body2" fontWeight={600}>{contactDialog.data.propertyName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Owner</Typography>
                  <Typography variant="body2" fontWeight={600}>{contactDialog.data.ownerName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Rent</Typography>
                  <Typography variant="body2" fontWeight={600}>₹{contactDialog.data.rentAmount?.toLocaleString('en-IN')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Approved On</Typography>
                  <Typography variant="body2" fontWeight={600}>{contactDialog.data.approvalDate}</Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setContactDialog({ open: false, data: null })}
            sx={{ borderRadius: '10px', fontWeight: 600 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ── */}
      <Snackbar open={snackbar.open} autoHideDuration={5000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default TenantMyBookings;
