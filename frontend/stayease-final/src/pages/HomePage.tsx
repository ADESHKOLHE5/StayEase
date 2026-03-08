import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { Search as SearchIcon, Shield as ShieldIcon, Bolt as BoltIcon } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import { useStore } from '../store';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { properties, isAuthenticated, currentUser } = useStore();
  const handpickedProperties = properties.slice(0, 4);

  const handleStartSearching = () => navigate('/accommodations');

  const handleListProperty = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (currentUser?.role === 'OWNER') {
      navigate('/owner/dashboard');
    } else {
      alert('Only property owners can list properties. Please signup as an owner.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      {/* Hero Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'inline-block', px: 2, py: 0.5, bgcolor: '#fee', color: '#e53e3e', borderRadius: 20, fontSize: '0.875rem', fontWeight: 600, mb: 3 }}>
                #1 Student Accommodation Platform
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>
                Find your <span style={{ color: '#e53e3e' }}>home</span><br />away from home.
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
                Connect directly with verified property owners. No brokers, no hidden fees. Just safe, affordable, and comfortable stays.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <Button variant="contained" size="large" startIcon={<SearchIcon />} onClick={handleStartSearching} sx={{ bgcolor: '#e53e3e', px: 4, py: 1.5, fontWeight: 600, '&:hover': { bgcolor: '#c53030' } }}>
                  Start Searching
                </Button>
                <Button variant="outlined" size="large" onClick={handleListProperty} sx={{ borderColor: '#2d3748', color: '#2d3748', px: 4, py: 1.5, fontWeight: 600, borderWidth: 2, '&:hover': { borderWidth: 2, bgcolor: '#2d3748', color: 'white' } }}>
                  List Your Property
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShieldIcon sx={{ color: '#e53e3e' }} />
                  <Typography variant="body2" color="text.secondary">Verified Owners</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BoltIcon sx={{ color: '#e53e3e' }} />
                  <Typography variant="body2" color="text.secondary">Zero Brokerage</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box component="img" src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80" alt="Modern living room" sx={{ width: '100%', borderRadius: 4, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Handpicked Accommodations */}
      {handpickedProperties.length > 0 && (
        <Box sx={{ py: 8, bgcolor: '#f7fafc' }}>
          <Container maxWidth="xl">
            <Box sx={{ mb: 4 }}>
              <Typography variant="overline" color="primary" fontWeight={600}>CURATED SELECTION</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Handpicked <span style={{ color: '#e53e3e' }}>Accommodations</span>
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {handpickedProperties.map((property, index) => (
                <Grid item xs={12} sm={6} md={3} key={property.propertyId}>
                  <PropertyCard property={property} featured={index === 0} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* How It Works */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>How It Works</Typography>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: '#f7fafc' }}>
                <Box sx={{ width: 80, height: 80, bgcolor: '#fee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                  <SearchIcon sx={{ fontSize: 40, color: '#e53e3e' }} />
                </Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>1. Search</Typography>
                <Typography color="text.secondary">Browse verified listings and filter by location, price, and amenities</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: '#f7fafc' }}>
                <Box sx={{ width: 80, height: 80, bgcolor: '#fee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                  <ShieldIcon sx={{ fontSize: 40, color: '#e53e3e' }} />
                </Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>2. Connect</Typography>
                <Typography color="text.secondary">Send booking requests directly to property owners</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: '#f7fafc' }}>
                <Box sx={{ width: 80, height: 80, bgcolor: '#fee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                  <BoltIcon sx={{ fontSize: 40, color: '#e53e3e' }} />
                </Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>3. Move In</Typography>
                <Typography color="text.secondary">Get instant approval and move in hassle-free</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, bgcolor: '#e53e3e', backgroundImage: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 3 }}>Ready to find your perfect space?</Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="contained" size="large" onClick={handleStartSearching} sx={{ bgcolor: 'white', color: '#e53e3e', px: 4, py: 1.5, fontWeight: 600, '&:hover': { bgcolor: '#f7fafc' } }}>
                Start Exploring
              </Button>
              <Button variant="outlined" size="large" onClick={handleListProperty} sx={{ borderColor: 'white', color: 'white', px: 4, py: 1.5, fontWeight: 600, borderWidth: 2, '&:hover': { borderWidth: 2, bgcolor: 'rgba(255,255,255,0.1)' } }}>
                Become a Partner
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default HomePage;
