import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, differenceInMonths } from 'date-fns';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Typography,
  Divider,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------
interface PropertySummary {
  propertyId: string;
  propertyName: string;
  rentPerMonth: number;
  availableRooms: number;
  maxGuestsPerRoom?: number;
  city?: string;
  state?: string;
  // ... other fields as needed
}

interface BookingRequestDto {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfRooms: number;
  numberOfGuests: number;
  totalPrice: number;
}

// ----------------------------------------------------------------------
// Validation schema
// ----------------------------------------------------------------------
const bookingFormSchema = z.object({
  checkInDate: z.date({ required_error: 'Check‑in date is required' }),
  checkOutDate: z.date({ required_error: 'Check‑out date is required' }),
  numberOfRooms: z.number().int().min(1, 'At least one room required').max(99),
  numberOfGuests: z.number().int().min(1, 'At least one guest required').max(100),
}).refine(data => data.checkOutDate > data.checkInDate, {
  message: 'Check‑out must be after check‑in',
  path: ['checkOutDate'],
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------
export function TenantBookingRequest({ property, onSuccess, onCancel }: {
  property: PropertySummary;
  onSuccess?: (booking: any) => void;
  onCancel?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      numberOfRooms: 1,
      numberOfGuests: 1,
      checkInDate: undefined,
      checkOutDate: undefined,
    },
  });

  const checkIn = watch('checkInDate');
  const checkOut = watch('checkOutDate');
  const rooms = watch('numberOfRooms');
  const guests = watch('numberOfGuests');

  // Recalculate total price
  useEffect(() => {
    if (checkIn && checkOut && rooms > 0 && property.rentPerMonth > 0) {
      const months = differenceInMonths(checkOut, checkIn) || 1; // at least one month
      setTotalPrice(months * property.rentPerMonth * rooms);
    } else {
      setTotalPrice(null);
    }
  }, [checkIn, checkOut, rooms, property.rentPerMonth]);

  // Enforce guest limit per room
  const maxGuests = property.maxGuestsPerRoom ? rooms * property.maxGuestsPerRoom : 100;
  useEffect(() => {
    if (guests > maxGuests) setValue('numberOfGuests', maxGuests);
  }, [guests, rooms, maxGuests, setValue]);

  const onSubmit = async (values: BookingFormValues) => {
    if (!totalPrice) {
      setSnackbar({ open: true, message: 'Could not calculate total price', severity: 'error' });
      return;
    }

    setIsSubmitting(true);
    const dto: BookingRequestDto = {
      propertyId: property.propertyId,
      checkInDate: format(values.checkInDate, 'yyyy-MM-dd'),
      checkOutDate: format(values.checkOutDate, 'yyyy-MM-dd'),
      numberOfRooms: values.numberOfRooms,
      numberOfGuests: values.numberOfGuests,
      totalPrice,
    };

    try {
      // Replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSnackbar({ open: true, message: 'Booking request sent!', severity: 'success' });
      onSuccess?.(dto);
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Request failed', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card sx={{ maxWidth: 700, mx: 'auto', mt: 4, boxShadow: 3 }}>
        <CardHeader
          title="Request Booking"
          subheader={`${property.propertyName} · ${property.city ?? ''} ${property.state ?? ''}`.trim()}
        />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              {/* Check-in */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="checkInDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Check‑in date"
                      value={field.value || null}
                      onChange={field.onChange}
                      disablePast
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.checkInDate,
                          helperText: errors.checkInDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Check-out */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="checkOutDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Check‑out date"
                      value={field.value || null}
                      onChange={field.onChange}
                      disablePast
                      minDate={checkIn || new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.checkOutDate,
                          helperText: errors.checkOutDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Rooms */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="numberOfRooms"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Number of rooms"
                      type="number"
                      fullWidth
                      inputProps={{ min: 1, max: property.availableRooms }}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      error={!!errors.numberOfRooms}
                      helperText={errors.numberOfRooms?.message || `Available: ${property.availableRooms}`}
                    />
                  )}
                />
              </Grid>

              {/* Guests */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="numberOfGuests"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Number of guests"
                      type="number"
                      fullWidth
                      inputProps={{ min: 1, max: maxGuests }}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      error={!!errors.numberOfGuests}
                      helperText={
                        errors.numberOfGuests?.message ||
                        (property.maxGuestsPerRoom ? `Max ${maxGuests} (${property.maxGuestsPerRoom} per room)` : '')
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Price summary */}
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mt: 3 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Monthly rent per room:</Typography>
                <Typography variant="body2">${property.rentPerMonth.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={0.5}>
                <Typography variant="body2">Rooms:</Typography>
                <Typography variant="body2">{rooms}</Typography>
              </Box>
              {checkIn && checkOut && (
                <Box display="flex" justifyContent="space-between" mt={0.5}>
                  <Typography variant="body2">Stay duration:</Typography>
                  <Typography variant="body2">
                    {differenceInMonths(checkOut, checkIn) || 1} month(s)
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 1.5 }} />
              <Box display="flex" justifyContent="space-between" fontWeight="bold">
                <Typography variant="body1" fontWeight="bold">Total estimated price:</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {totalPrice ? `$${totalPrice.toFixed(2)}` : '—'}
                </Typography>
              </Box>
            </Box>

            <CardActions sx={{ justifyContent: 'flex-end', px: 0, mt: 2 }}>
              <Button onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting && <CircularProgress size={20} />}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </CardActions>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
}