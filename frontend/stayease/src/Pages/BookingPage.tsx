import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, CircularProgress, Alert, Button, Typography,
  TextField, MenuItem, Paper, Divider, InputAdornment, Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PersonIcon from '@mui/icons-material/Person';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import useFetch from '../hooks/useFetch';
import axiosInstance from '../api/axiosInstance';

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

// ─── Property Type Helpers ─────────────────────────────────────────────────
function getRoomLabel(propertyType: string): string {
  if (propertyType === 'Hostel') return 'Number of Beds';
  if (propertyType === 'Apartment' || propertyType === 'Villa') return 'Number of Flats/Units';
  return 'Number of Rooms';
}

function getRentLabel(propertyType: string): string {
  if (propertyType === 'Hostel') return 'Monthly rent per bed/guest';
  if (propertyType === 'Apartment' || propertyType === 'Villa') return 'Monthly rent per flat/unit';
  return 'Monthly rent per guest';
}

function getPricingUnitLabel(propertyType: string): string {
  if (propertyType === 'Hostel') return 'Number of beds/guests';
  if (propertyType === 'Apartment' || propertyType === 'Villa') return 'Number of flats/units';
  return 'Number of guests';
}

function getRoomUnitWord(propertyType: string): string {
  if (propertyType === 'Hostel') return 'bed';
  if (propertyType === 'Apartment' || propertyType === 'Villa') return 'flat';
  return 'room';
}

// ─── Helper Functions ──────────────────────────────────────────────────────
function getTomorrowStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatRupee(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Validation Functions ──────────────────────────────────────────────────
interface ValidationState {
  isValid: boolean;
  message: string;
  severity: 'error' | 'success' | 'info';
}

function validateCheckInDate(value: string): ValidationState {
  if (!value) {
    return { isValid: false, message: 'Check-in date is required', severity: 'error' };
  }
  const tomorrow = getTomorrowStr();
  if (value < tomorrow) {
    return {
      isValid: false,
      message: 'Check-in must be tomorrow or later',
      severity: 'error',
    };
  }
  return { isValid: true, message: `Selected: ${formatDate(value)} ✓`, severity: 'success' };
}

function validateDuration(value: string, checkInDate: string): ValidationState {
  if (!checkInDate) {
    return { isValid: false, message: 'Select check-in date first', severity: 'info' };
  }
  if (!value) {
    return { isValid: false, message: 'Duration is required', severity: 'error' };
  }
  const months = parseInt(value);
  return {
    isValid: true,
    message: `${months} month${months > 1 ? 's' : ''} ✓`,
    severity: 'success',
  };
}

function validateRooms(value: string, availableRooms: number, checkInDate: string, duration: string): ValidationState {
  if (!checkInDate || !duration) {
    return { isValid: false, message: 'Select date & duration first', severity: 'info' };
  }
  if (!value) {
    return { isValid: false, message: 'Number of rooms is required', severity: 'error' };
  }
  const rooms = parseInt(value);
  if (isNaN(rooms) || rooms < 1) {
    return { isValid: false, message: 'Minimum 1 room required', severity: 'error' };
  }
  if (rooms > availableRooms) {
    return {
      isValid: false,
      message: `Only ${availableRooms} room${availableRooms > 1 ? 's' : ''} available`,
      severity: 'error',
    };
  }
  return { isValid: true, message: `${rooms} room${rooms > 1 ? 's' : ''} selected ✓`, severity: 'success' };
}

function validateGuests(value: string, rooms: string, propertyType: string): ValidationState {
  if (!rooms) {
    return { isValid: false, message: 'Select rooms first', severity: 'info' };
  }
  if (!value) {
    return { isValid: false, message: 'Number of guests is required', severity: 'error' };
  }
  const guests = parseInt(value);
  const roomsNum = parseInt(rooms);
  if (isNaN(guests) || guests < 1) {
    return { isValid: false, message: 'Minimum 1 guest required', severity: 'error' };
  }

  if (propertyType === 'Hostel') {
    if (guests < roomsNum) {
      return { isValid: false, message: `Min ${roomsNum} guest${roomsNum > 1 ? 's' : ''} for ${roomsNum} bed${roomsNum > 1 ? 's' : ''}`, severity: 'error' };
    }
    if (guests > roomsNum) {
      return { isValid: false, message: `Max ${roomsNum} guest${roomsNum > 1 ? 's' : ''} for ${roomsNum} bed${roomsNum > 1 ? 's' : ''} (1 bed = 1 guest)`, severity: 'error' };
    }
  } else if (propertyType === 'PG') {
    const minGuests = roomsNum;
    const maxGuests = roomsNum * 4;
    if (guests < minGuests) {
      return { isValid: false, message: `Min ${minGuests} guest${minGuests > 1 ? 's' : ''} for ${roomsNum} room${roomsNum > 1 ? 's' : ''} (1 guest per room minimum)`, severity: 'error' };
    }
    if (guests > maxGuests) {
      return { isValid: false, message: `Max ${maxGuests} guests for ${roomsNum} room${roomsNum > 1 ? 's' : ''} (max 4 per room)`, severity: 'error' };
    }
  }
  return { isValid: true, message: `${guests} guest${guests > 1 ? 's' : ''} ✓`, severity: 'success' };
}

// ─── Main Component ───────────────────────────────────────────────────────
const BookingPage = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();

  // ── FIX: destructure loading + error from BOTH fetches ──────────────────
  const { data: myBookings, loading: bookingsLoading, error: bookingsError } = useFetch('/bookings/tenant/my');
  const { data: property, loading: propertyLoading, error: propertyError }   = useFetch(`/properties/details/${propertyId}`);

  const loading = bookingsLoading || propertyLoading;
  const error   = bookingsError   || propertyError;
  // ────────────────────────────────────────────────────────────────────────

  const hasPendingBooking = !!(myBookings && Array.isArray(myBookings) && myBookings.some(
    (b: any) => b.propertyId === propertyId && b.status === 'PENDING'
  ));

  const [checkInDate, setCheckInDate] = useState('');
  const [duration, setDuration] = useState('');
  const [rooms, setRooms] = useState('');
  const [guests, setGuests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  // ── Derived Values ────────────────────────────────────────────────────────
  const propertyType: string = property?.propertyType ?? '';
  const isPG     = propertyType === 'PG';
  const isHostel = propertyType === 'Hostel';

  const rentPerMonth   = property?.rentPerMonth   ?? 0;
  const availableRooms = property?.availableRooms ?? 0;

  const checkOutDate = checkInDate && duration ? (() => {
    const d = new Date(checkInDate);
    d.setMonth(d.getMonth() + parseInt(duration));
    return d.toISOString().split('T')[0];
  })() : '';

  // ── Price Calculation ──────────────────────────────────────────────────────
  const durationNum = duration ? parseInt(duration) : 0;
  const roomsNum    = rooms    ? parseInt(rooms)    : 0;
  const guestsNum   = guests   ? parseInt(guests)   : 0;

  const pricingQty = (isPG || isHostel) ? guestsNum : roomsNum;
  const totalRent  = durationNum * pricingQty * rentPerMonth;

  // ── Validation States ──────────────────────────────────────────────────────
  const checkInValidation  = validateCheckInDate(checkInDate);
  const durationValidation = validateDuration(duration, checkInDate);
  const roomsValidation    = validateRooms(rooms, availableRooms, checkInDate, duration);
  const guestsValidation   = validateGuests(guests, rooms, propertyType);

  const isFormValid =
    checkInValidation.isValid &&
    durationValidation.isValid &&
    roomsValidation.isValid &&
    guestsValidation.isValid;

  const roomOptions = Array.from({ length: availableRooms }, (_, i) => i + 1);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCheckInChange  = (val: string) => setCheckInDate(val);
  const handleDurationChange = (val: string) => setDuration(val);
  const handleRoomsChange    = (val: string) => { setRooms(val); setGuests(''); };
  const handleGuestsChange   = (val: string) => setGuests(val);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setSnackbar({ open: true, message: 'Please fill all fields with valid data', severity: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        propertyId,
        checkInDate,
        checkOutDate,
        numberOfRooms:  roomsNum,
        numberOfGuests: guestsNum,
        totalPrice:     totalRent,
      };

      await axiosInstance.post('/bookings/tenant/request', payload);

      setBooked(true);
      let count = 4;
      const timer = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count === 0) {
          clearInterval(timer);
          navigate('/tenant/my-bookings');
        }
      }, 1000);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to submit booking request';
      setSnackbar({ open: true, message, severity: 'error' });
      setIsSubmitting(false);
    }
  };

  // ── Loading — waits for BOTH fetches ───────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#e53e3e' }} />
      </Box>
    );
  }

  // ── Property Missing Guard ───────────────────────────────
  if (!property) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          Property not found
        </Alert>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />}>Go Back</Button>
      </Container>
    );
  }

  // ── Success Screen ─────────────────────────────────────────────────────────
  if (booked) {
    return (
      <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
        <Box sx={{
          textAlign: 'center', maxWidth: 460,
          p: { xs: 4, sm: 6 }, borderRadius: 5,
          border: '1.5px solid #d1fae5', bgcolor: '#f0fdf4',
          boxShadow: '0 8px 32px rgba(34,197,94,0.10)',
          animation: 'fadeIn 0.4s ease',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(16px)' },
            to:   { opacity: 1, transform: 'translateY(0)' },
          },
        }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 72, color: '#16a34a', mb: 2 }} />
          <Typography variant="h5" fontWeight={800} color="#14532d" gutterBottom>
            Booking Request Sent!
          </Typography>
          <Typography variant="body1" color="#166534" sx={{ mb: 1 }}>
            Your request for{' '}
            <Box component="span" fontWeight={700}>{property.propertyName}</Box>{' '}
            has been submitted successfully.
          </Typography>
          <Typography variant="body2" color="#166534" sx={{ mb: 3 }}>
            The owner will review and confirm your booking shortly.
          </Typography>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            bgcolor: '#dcfce7', border: '1.5px solid #86efac',
            borderRadius: '50px', px: 3, py: 1,
          }}>
            <CircularProgress size={16} thickness={5} sx={{ color: '#16a34a' }} />
            <Typography variant="body2" fontWeight={600} color="#15803d">
              Redirecting in {countdown}s…
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/tenant/my-bookings')}
              sx={{ bgcolor: '#16a34a', borderRadius: '50px', fontWeight: 700, px: 4, '&:hover': { bgcolor: '#15803d' } }}
            >
              Go Now
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  // ── Pending Booking Guard ──────────────────────────────────────────────────
  if (hasPendingBooking) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: '#6b7280', fontWeight: 600, '&:hover': { bgcolor: '#f3f4f6' } }}
        >
          Back to property
        </Button>
        <Paper elevation={0} sx={{
          p: { xs: 4, sm: 6 }, borderRadius: 4,
          border: '1.5px solid #fcd34d', bgcolor: '#fffbeb',
          textAlign: 'center',
        }}>
          <Box sx={{ fontSize: 56, mb: 2 }}>⏳</Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#92400e', mb: 1 }}>
            Booking Request Already Sent
          </Typography>
          <Typography variant="body1" sx={{ color: '#b45309', mb: 1.5, maxWidth: 460, mx: 'auto' }}>
            You already have a <strong>pending booking request</strong> for this property. Please wait for the owner to respond before sending another request.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You can cancel your existing request from <strong>My Bookings</strong> if you'd like to submit a new one.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/tenant/my-bookings')}
              sx={{
                bgcolor: '#d97706', fontWeight: 700, borderRadius: '12px', px: 4,
                '&:hover': { bgcolor: '#b45309' },
              }}
            >
              View My Bookings
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ borderColor: '#d97706', color: '#d97706', fontWeight: 700, borderRadius: '12px', px: 4 }}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      bgcolor: '#fafafa',
      '&.Mui-focused fieldset': { borderColor: '#e53e3e' },
    },
  };

  const labelSx = { mb: 0.8, fontWeight: 600, color: '#374151', fontSize: '0.875rem' };

  // ── Main Booking Form ──────────────────────────────────────────────────────
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, color: '#6b7280', fontWeight: 600, '&:hover': { bgcolor: '#f3f4f6' } }}
      >
        Back to property
      </Button>

      <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, mb: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>

          {/* Header */}
          <Typography variant="h5" fontWeight={800} color="#111827" sx={{ mb: 0.5 }}>
            Book Your Stay
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {property?.propertyName} · {property?.city} {property?.state}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Form Fields Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>

            {/* Check-in Date */}
            <Box>
              <Typography sx={labelSx}>Check-in Date</Typography>
              <TextField
                type="date" fullWidth
                value={checkInDate}
                onChange={(e) => handleCheckInChange(e.target.value)}
                inputProps={{ min: getTomorrowStr() }}
                error={!checkInValidation.isValid && checkInDate !== ''}
                helperText={checkInDate ? checkInValidation.message : 'Check-in date is required'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon sx={{ fontSize: 18, color: checkInValidation.severity === 'success' ? '#16a34a' : '#9ca3af' }} />
                    </InputAdornment>
                  ),
                  endAdornment: checkInValidation.isValid && checkInDate
                    ? <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                    : null,
                }}
                sx={{
                  ...textFieldSx,
                  '& .MuiFormHelperText-root': {
                    color: checkInValidation.severity === 'success' ? '#16a34a'
                      : checkInValidation.severity === 'error' ? '#dc2626' : '#6b7280',
                    fontWeight: 500,
                  },
                }}
              />
            </Box>

            {/* Duration */}
            <Box>
              <Typography sx={labelSx}>Duration (Months)</Typography>
              <TextField
                select fullWidth
                value={duration}
                onChange={(e) => handleDurationChange(e.target.value)}
                disabled={!checkInDate}
                error={!durationValidation.isValid && duration !== ''}
                helperText={duration ? durationValidation.message : 'Duration is required'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon sx={{ fontSize: 18, color: durationValidation.severity === 'success' ? '#16a34a' : '#9ca3af' }} />
                    </InputAdornment>
                  ),
                  endAdornment: durationValidation.isValid && duration
                    ? <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                    : null,
                }}
                sx={{
                  ...textFieldSx,
                  '& .MuiFormHelperText-root': {
                    color: durationValidation.severity === 'success' ? '#16a34a'
                      : durationValidation.severity === 'error' ? '#dc2626' : '#6b7280',
                    fontWeight: 500,
                  },
                }}
              >
                {MONTH_OPTIONS.map((m) => (
                  <MenuItem key={m} value={String(m)}>
                    {m} {m === 1 ? 'Month' : 'Months'}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Number of Rooms / Beds / Units */}
            <Box>
              <Typography sx={labelSx}>{getRoomLabel(propertyType)}</Typography>
              <TextField
                select fullWidth
                value={rooms}
                onChange={(e) => handleRoomsChange(e.target.value)}
                disabled={!duration}
                error={!roomsValidation.isValid && rooms !== ''}
                helperText={rooms ? roomsValidation.message : `${getRoomLabel(propertyType)} is required`}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MeetingRoomIcon sx={{ fontSize: 18, color: roomsValidation.severity === 'success' ? '#16a34a' : '#9ca3af' }} />
                    </InputAdornment>
                  ),
                  endAdornment: roomsValidation.isValid && rooms
                    ? <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                    : null,
                }}
                sx={{
                  ...textFieldSx,
                  '& .MuiFormHelperText-root': {
                    color: roomsValidation.severity === 'success' ? '#16a34a'
                      : roomsValidation.severity === 'error' ? '#dc2626' : '#6b7280',
                    fontWeight: 500,
                  },
                }}
              >
                {roomOptions.length > 0 ? (
                  roomOptions.map((r) => (
                    <MenuItem key={r} value={String(r)}>
                      {r} {getRoomLabel(propertyType).replace('Number of ', '')}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No rooms available</MenuItem>
                )}
              </TextField>
            </Box>

            {/* Number of Guests */}
            <Box>
              <Typography sx={labelSx}>Number of Guests</Typography>
              <TextField
                type="number" fullWidth
                value={guests}
                onChange={(e) => handleGuestsChange(e.target.value)}
                disabled={!rooms}
                error={!guestsValidation.isValid && guests !== ''}
                helperText={guests ? guestsValidation.message : 'Number of guests is required'}
                inputProps={{
                  min: isPG ? parseInt(rooms || '1') : isHostel ? parseInt(rooms || '1') : 1,
                  max: isHostel ? parseInt(rooms || '1') : parseInt(rooms || '1') * 4,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ fontSize: 18, color: guestsValidation.severity === 'success' ? '#16a34a' : '#9ca3af' }} />
                    </InputAdornment>
                  ),
                  endAdornment: guestsValidation.isValid && guests
                    ? <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                    : null,
                }}
                sx={{
                  ...textFieldSx,
                  '& .MuiFormHelperText-root': {
                    color: guestsValidation.severity === 'success' ? '#16a34a'
                      : guestsValidation.severity === 'error' ? '#dc2626' : '#6b7280',
                    fontWeight: 500,
                  },
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* ── Rent Summary ── */}
          {checkInDate && duration && (
            <Paper sx={{
              bgcolor: '#fff7ed', border: '1.5px solid #fed7aa',
              borderRadius: 3, p: 2.5, mb: 3,
              animation: 'slideIn 0.3s ease',
              '@keyframes slideIn': {
                from: { opacity: 0, transform: 'translateY(-8px)' },
                to:   { opacity: 1, transform: 'translateY(0)' },
              },
            }}>
              <Typography variant="body2" fontWeight={700} color="#9a3412" sx={{ mb: 1.5 }}>
                💰 Rent Summary
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                <Typography variant="body2" color="#92400e">{getRentLabel(propertyType)}</Typography>
                <Typography variant="body2" fontWeight={600} color="#92400e">{formatRupee(rentPerMonth)}</Typography>
              </Box>

              {!isHostel && !isPG && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography variant="body2" color="#92400e">Number of {getRoomUnitWord(propertyType)}s</Typography>
                  <Typography variant="body2" fontWeight={600} color="#92400e">{roomsNum > 0 ? roomsNum : '—'}</Typography>
                </Box>
              )}

              {isPG && roomsNum > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography variant="body2" color="#92400e">Number of rooms</Typography>
                  <Typography variant="body2" fontWeight={600} color="#92400e">{roomsNum}</Typography>
                </Box>
              )}

              {(isPG || isHostel) && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography variant="body2" color="#92400e">{getPricingUnitLabel(propertyType)}</Typography>
                  <Typography variant="body2" fontWeight={600} color="#92400e">{guestsNum > 0 ? guestsNum : '—'}</Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                <Typography variant="body2" color="#92400e">Duration</Typography>
                <Typography variant="body2" fontWeight={600} color="#92400e">
                  {durationNum} month{durationNum !== 1 ? 's' : ''}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                <Typography variant="body2" color="#92400e">Check-out date</Typography>
                <Typography variant="body2" fontWeight={600} color="#92400e">{formatDate(checkOutDate)}</Typography>
              </Box>

              <Divider sx={{ my: 1.5, borderColor: '#fcd34d' }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" fontWeight={700} color="#7c2d12">Total Rent</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                  <CurrencyRupeeIcon sx={{ fontSize: 20, color: '#e53e3e' }} />
                  <Typography variant="h6" fontWeight={800} color="#e53e3e">{formatRupee(totalRent)}</Typography>
                </Box>
              </Box>

              <Typography variant="caption" color="#b45309" sx={{ mt: 1, display: 'block' }}>
                {(isPG || isHostel)
                  ? `${formatRupee(rentPerMonth)} × ${guestsNum} guest${guestsNum !== 1 ? 's' : ''} × ${durationNum} month${durationNum !== 1 ? 's' : ''} = ${formatRupee(totalRent)}`
                  : `${formatRupee(rentPerMonth)} × ${roomsNum} ${getRoomUnitWord(propertyType)}${roomsNum !== 1 ? 's' : ''} × ${durationNum} month${durationNum !== 1 ? 's' : ''} = ${formatRupee(totalRent)}`
                }
              </Typography>
            </Paper>
          )}

          {/* ── Form Validation State ── */}
          {isFormValid ? (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2, bgcolor: '#dcfce7', border: '1.5px solid #86efac', color: '#15803d' }}>
              ✓ All details valid! Ready to submit your booking request.
            </Alert>
          ) : (
            (checkInDate || duration || rooms || guests) ? (
              <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 3, borderRadius: 2, bgcolor: '#fee2e2', border: '1.5px solid #fecaca', color: '#991b1b' }}>
                Please fix all validation errors above to continue
              </Alert>
            ) : null
          )}

          {/* ── Action Buttons ── */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              sx={{ borderRadius: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'none', fontSize: '0.95rem', px: 3 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isFormValid || isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={18} sx={{ color: 'white' }} /> : null}
              sx={{
                bgcolor: '#e53e3e', fontWeight: 600, borderRadius: '12px',
                textTransform: 'none', fontSize: '0.95rem', px: 4,
                boxShadow: '0 4px 14px rgba(229,62,62,0.3)',
                '&:hover': { bgcolor: '#c53030', boxShadow: '0 6px 20px rgba(229,62,62,0.4)' },
                '&:disabled': { bgcolor: '#d1d5db', color: '#9ca3af' },
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
            </Button>
          </Box>

        </Box>
      </Paper>

      {/* ── Snackbar ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%', fontWeight: 500, '& .MuiAlert-icon': { fontSize: '20px' } }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookingPage;