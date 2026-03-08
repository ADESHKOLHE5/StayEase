import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Paper, Chip, Rating } from '@mui/material';
import { LocationOn as LocationIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useStore } from '../store';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { properties, currentUser, isAuthenticated, createBooking, users } = useStore();
  
  const property = properties.find(p => p.propertyId === id);
  const owner = users.find(u => u.userId === property?.ownerId);
  const autoBook = location.state?.autoBook;

  React.useEffect(() => {
    if (autoBook && property) {
      handleBookNow();
    }
  }, [autoBook]);

  if (!property) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container sx={{ flex: 1, py: 8, textAlign: 'center' }}>
          <Typography variant="h5">Property not found</Typography>
          <Button onClick={() => navigate('/accommodations')} sx={{ mt: 2 }}>Back to listings</Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!currentUser || !owner) return;

    if (currentUser.role === 'OWNER') {
      alert('Owners cannot book properties. Please use a tenant account.');
      return;
    }

    createBooking(property.propertyId, currentUser.userId, property.ownerId, property.rentPerMonth);
    alert('Booking request sent successfully! The owner will review your application.');
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Back
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <img src={property.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'} alt={property.propertyName} style={{ width: '100%', borderRadius: 16, maxHeight: 400, objectFit: 'cover' }} />
            </Box>

            <Paper elevation={0} sx={{ p: 3, mb: 3, border: 1, borderColor: 'grey.200' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                <Box>
                  <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>{property.propertyName}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body1">{property.location}</Typography>
                  </Box>
                </Box>
                {property.rating && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={property.rating} readOnly precision={0.1} />
                    <Typography variant="h6" fontWeight={600}>{property.rating.toFixed(1)}</Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Chip label={property.propertyType} />
                <Chip label={property.genderSpecific} />
                <Chip label={property.furnishing} />
              </Box>

              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>About</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{property.description}</Typography>

              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Amenities</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {property.facilities.map((facility, index) => (
                  <Chip key={index} label={facility} variant="outlined" />
                ))}
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'grey.200' }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Availability</Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Total Rooms</Typography>
                  <Typography variant="h5" fontWeight={700}>{property.totalRooms}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Available Now</Typography>
                  <Typography variant="h5" fontWeight={700} color={property.availableRooms > 0 ? 'primary' : 'error'}>
                    {property.availableRooms}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={700} color="primary" sx={{ mb: 0.5 }}>
                  ₹{property.rentPerMonth.toLocaleString('en-IN')}
                </Typography>
                <Typography variant="body2" color="text.secondary">/month</Typography>
                {property.rentPerDay > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    or ₹{property.rentPerDay.toLocaleString('en-IN')}/day
                  </Typography>
                )}
              </Box>

              {property.availableRooms > 0 ? (
                <Button fullWidth variant="contained" size="large" onClick={handleBookNow} sx={{ bgcolor: '#e53e3e', py: 2, fontWeight: 600, '&:hover': { bgcolor: '#c53030' } }}>
                  Book Now
                </Button>
              ) : (
                <Button fullWidth variant="contained" size="large" disabled sx={{ py: 2 }}>
                  Sold Out
                </Button>
              )}

              <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Property Owner</Typography>
                <Typography variant="body2">{owner?.firstName} {owner?.lastName}</Typography>
                <Typography variant="body2" color="text.secondary">{owner?.email}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default PropertyDetail;
