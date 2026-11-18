import { useState } from 'react';
import {
  Box, Typography, Card, CardContent, CardMedia, Grid, Button, Chip,
  CircularProgress, Alert, Paper, Stack, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions, Snackbar, IconButton, ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import CloseIcon from '@mui/icons-material/Close';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import useFetch from '../hooks/useFetch';
import axiosInstance from '../api/axiosInstance';

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

const OwnerBookingDashboard = () => {
  const { data: bookings, loading, error } = useFetch('/bookings/owner/dashboard');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });
  const [contactDialog, setContactDialog] = useState<{ open: boolean; data: any }>({
    open: false, data: null,
  });
  // Track status overrides from approve/reject actions
  const [statusOverrides, setStatusOverrides] = useState<Record<number, string>>({});

  // ── Approve ──
  const handleApprove = async (bookingId: number) => {
    setActionLoading(bookingId);
    try {
      const res = await axiosInstance.put(`/bookings/owner/approve/${bookingId}`);
      setStatusOverrides(prev => ({ ...prev, [bookingId]: 'APPROVED' }));
      setSnackbar({ open: true, message: res.data.message || 'Booking approved!', severity: 'success' });
      // Auto-show contact info
      setContactDialog({
        open: true,
        data: {
          message: res.data.message,
          tenantUsername: res.data.tenantUsername,
          rentAmount: res.data.rentAmount,
          approvalDate: res.data.approvalDate,
        },
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to approve booking.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  // ── Reject ──
  const handleReject = async (bookingId: number) => {
    setActionLoading(bookingId);
    try {
      await axiosInstance.put(`/bookings/owner/reject/${bookingId}`);
      setStatusOverrides(prev => ({ ...prev, [bookingId]: 'REJECTED' }));
      setSnackbar({ open: true, message: 'Booking rejected.', severity: 'success' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to reject booking.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  // ── Owner contact for approved booking ──
  const handleContact = async (bookingId: number) => {
    setActionLoading(bookingId);
    try {
      const res = await axiosInstance.get(`/bookings/owner/contact/${bookingId}`);
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
        <Typography variant="h6" fontWeight={600} color="text.secondary">No booking requests yet</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          When tenants request bookings for your properties, they'll appear here.
        </Typography>
      </Paper>
    );
  }

  // Apply status overrides and filter
  const filteredBookings = bookings
    .map((b: Booking) => ({
      ...b,
      status: statusOverrides[b.bookingId] || b.status,
    }))
    .filter((b: Booking) => statusFilter === 'ALL' || b.status === statusFilter);

  const counts = {
    ALL: bookings.length,
    PENDING: bookings.filter((b: Booking) => (statusOverrides[b.bookingId] || b.status) === 'PENDING').length,
    APPROVED: bookings.filter((b: Booking) => (statusOverrides[b.bookingId] || b.status) === 'APPROVED').length,
    REJECTED: bookings.filter((b: Booking) => (statusOverrides[b.bookingId] || b.status) === 'REJECTED').length,
    CANCELLED: bookings.filter((b: Booking) => (statusOverrides[b.bookingId] || b.status) === 'CANCELLED').length,
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#111827' }}>
        📬 Booking Requests
      </Typography>

      {/* Filter Tabs */}
      <ToggleButtonGroup
        value={statusFilter}
        exclusive
        onChange={(_, val) => val && setStatusFilter(val)}
        sx={{ mb: 3, flexWrap: 'wrap' }}
      >
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'] as const).map(key => (
          <ToggleButton key={key} value={key} sx={{
            px: 2.5, py: 0.8, fontWeight: 600, fontSize: '0.8rem', borderRadius: '10px !important',
            textTransform: 'none', mr: 1, mb: 1,
            border: '1.5px solid #e5e7eb !important',
            '&.Mui-selected': {
              bgcolor: key === 'ALL' ? '#111827' : (statusConfig[key]?.bg || '#f3f4f6'),
              color: key === 'ALL' ? '#fff' : (statusConfig[key]?.color || '#374151'),
              borderColor: key === 'ALL' ? '#111827 !important' : `${statusConfig[key]?.color} !important`,
            },
          }}>
            {key === 'ALL' ? 'All' : statusConfig[key].label} ({counts[key]})
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {filteredBookings.length === 0 && (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px dashed #e0e0e0' }}>
          <Typography variant="body1" color="text.secondary">No bookings with this status.</Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {filteredBookings.map((booking: Booking) => {
          const effectiveStatus = booking.status;
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
                    <Chip label={status.label} size="small"
                      sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: '0.7rem', ml: 'auto' }} />
                  </Box>

                  {/* Tenant info */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    👤 <strong>Tenant:</strong> 
                    {/* {booking.tenantUsername} */}
                    {booking.tenantUsername.length > 3 ? `${booking.tenantUsername.substring(0, 3)}****` : booking.tenantUsername}
                  </Typography>

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

                  {/* Stats */}
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

                  {/* Price */}
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
                  </Stack>
                </CardContent>

                {/* Actions */}
                <Box sx={{
                  display: 'flex', flexDirection: { xs: 'row', sm: 'column' },
                  justifyContent: { xs: 'flex-end', sm: 'center' },
                  gap: 1.5, ml: { sm: 2 }, mt: { xs: 2, sm: 0 },
                }}>
                  {effectiveStatus === 'PENDING' && (
                    <>
                      <Button
                        variant="contained" size="small" startIcon={<CheckCircleIcon />}
                        onClick={() => handleApprove(booking.bookingId)}
                        disabled={actionLoading === booking.bookingId}
                        sx={{
                          bgcolor: '#16a34a', fontWeight: 600, borderRadius: '10px', px: 2,
                          boxShadow: 'none',
                          '&:hover': { bgcolor: '#15803d', boxShadow: 'none' },
                        }}
                      >
                        {actionLoading === booking.bookingId ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Approve'}
                      </Button>
                      <Button
                        variant="outlined" size="small" startIcon={<CancelIcon />}
                        onClick={() => handleReject(booking.bookingId)}
                        disabled={actionLoading === booking.bookingId}
                        sx={{
                          borderColor: '#d32f2f', color: '#d32f2f', fontWeight: 600,
                          borderRadius: '10px', px: 2,
                          '&:hover': { bgcolor: '#ffebee', borderColor: '#b71c1c' },
                        }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {effectiveStatus === 'APPROVED' && (
                    <Button
                      variant="contained" size="small" startIcon={<ContactPhoneIcon />}
                      onClick={() => handleContact(booking.bookingId)}
                      disabled={actionLoading === booking.bookingId}
                      sx={{
                        bgcolor: '#e53e3e', fontWeight: 600, borderRadius: '10px', px: 2,
                        '&:hover': { bgcolor: '#c53030' },
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

      {/* ── Contact Dialog ── */}
      <Dialog open={contactDialog.open} onClose={() => setContactDialog({ open: false, data: null })} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Tenant Contact Details
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
                {contactDialog.data.propertyName && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Property</Typography>
                    <Typography variant="body2" fontWeight={600}>{contactDialog.data.propertyName}</Typography>
                  </Box>
                )}
                {contactDialog.data.tenantUsername && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Tenant</Typography>
                    <Typography variant="body2" fontWeight={600}>{contactDialog.data.tenantUsername}</Typography>
                  </Box>
                )}
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

export default OwnerBookingDashboard;
