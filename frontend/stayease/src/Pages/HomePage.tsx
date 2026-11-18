import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Paper, Chip, Skeleton } from '@mui/material';
import { Search as SearchIcon, Shield as ShieldIcon, Bolt as BoltIcon, ArrowForward, Apartment, Hotel, HomeWork, WifiOff } from '@mui/icons-material';

import PropertyCard from '../components/PropertyCard';
import PageLoader from '../components/PageLoader';
import useAuth from '../hooks/useAuth';
import useFetch from '../hooks/useFetch';

// Skeleton placeholder for a property card while loading
const PropertyCardSkeleton: React.FC = () => (
  <Box sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0f0f0', bgcolor: 'white' }}>
    <Skeleton variant="rectangular" height={200} animation="wave" />
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" width="70%" height={24} animation="wave" sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width="50%" height={18} animation="wave" sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" height={20} animation="wave" />
    </Box>
  </Box>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const currentUser = user;
  const { data: properties, loading: propertiesLoading, error: propertiesError } = useFetch('/properties/browseAll');
  const handpickedProperties = (properties || []).slice(0, 4);

  const handleStartSearching = () => {
    navigate('/accommodations');
  };

  const handleListProperty = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (currentUser?.role === 'OWNER') {
      navigate('/owner/dashboard');
    } else {
      alert('Only property owners can list properties. Please signup as an owner.');
    }
  };

  const handleExploreMore = () => {
    navigate('/accommodations');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>


      {/* ── Hero Section ── */}
      <Box sx={{
        bgcolor: 'white',
        py: { xs: 4, md: 6 },
        borderBottom: '1px solid #f0f0f0',
      }}>
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label="🏠 #1 Student Accommodation Platform"
                sx={{ bgcolor: '#fff5f5', color: '#e53e3e', fontWeight: 700, mb: 3, fontSize: '0.82rem', borderRadius: '20px', border: '1px solid #fecaca' }}
              />
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.2, color: '#111827' }}>
                Find your <span style={{ color: '#e53e3e' }}>home</span><br />away from home.
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400, lineHeight: 1.7, fontSize: '1rem' }}>
                Connect directly with verified property owners.No brokers,
                no hidden fees.<br />
                Just safe, affordable, and comfortable stays.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SearchIcon />}
                  onClick={handleStartSearching}
                  sx={{
                    bgcolor: '#e53e3e', px: 4, py: 1.5, fontWeight: 700,
                    borderRadius: '10px', boxShadow: '0 4px 14px rgba(229,62,62,0.4)',
                    '&:hover': { bgcolor: '#c53030', boxShadow: '0 6px 20px rgba(229,62,62,0.5)' }
                  }}
                >
                  Start Searching
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleListProperty}
                  sx={{
                    borderColor: '#2d3748', color: '#2d3748', px: 4, py: 1.5,
                    fontWeight: 700, borderRadius: '10px', borderWidth: 2,
                    '&:hover': { borderWidth: 2, bgcolor: '#2d3748', color: 'white' }
                  }}
                >
                  List Your Property
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShieldIcon sx={{ color: '#e53e3e', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>Verified Owners</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BoltIcon sx={{ color: '#e53e3e', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>Zero Brokerage</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
                  alt="Modern living room"
                  sx={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', display: 'block' }}
                />
                {/* Floating stats card */}
                <Paper elevation={3} sx={{
                  position: 'absolute', bottom: -20, left: -20,
                  px: 2.5, py: 1.5, borderRadius: '14px',
                  display: { xs: 'none', md: 'flex' }, gap: 2.5,
                }}>
                  {[{ value: '50L+', label: 'Happy Users' }, { value: '2L+', label: 'Listings' }, { value: '₹0', label: 'Brokerage' }].map((stat) => (
                    <Box key={stat.label} sx={{ textAlign: 'center' }}>
                      <Typography sx={{ fontWeight: 800, color: '#e53e3e', fontSize: '1.1rem', lineHeight: 1 }}>{stat.value}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{stat.label}</Typography>
                    </Box>
                  ))}
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Property Type Categories ── */}
      <Box sx={{ py: 5, bgcolor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
        <Container maxWidth="xl">
          <Grid container spacing={2} justifyContent="center">
            {[
              { icon: <Apartment sx={{ fontSize: 32, color: '#1d4ed8' }} />, label: 'Apartments', bg: '#eff6ff', color: '#1d4ed8', desc: 'Private & spacious' },
              { icon: <Hotel sx={{ fontSize: 32, color: '#15803d' }} />, label: 'Hostels', bg: '#f0fdf4', color: '#15803d', desc: 'Budget-friendly stays' },
              { icon: <HomeWork sx={{ fontSize: 32, color: '#7e22ce' }} />, label: 'PGs', bg: '#fdf4ff', color: '#7e22ce', desc: 'All-inclusive rooms' },
            ].map((cat) => (
              <Grid item xs={12} sm={4} md={3} key={cat.label}>
                <Paper
                  elevation={0}
                  onClick={handleStartSearching}
                  sx={{
                    p: 3, textAlign: 'center', borderRadius: '16px',
                    border: '1.5px solid #e5e7eb', cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: cat.color, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' },
                  }}
                >
                  <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                    {cat.icon}
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>{cat.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{cat.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Handpicked Accommodations ── */}
      <Box sx={{ py: 8, bgcolor: '#fafafa' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#e53e3e', fontWeight: 700, letterSpacing: 1.5 }}>
                CURATED SELECTION
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mt: 0.5 }}>
                Handpicked <span style={{ color: '#e53e3e' }}>Accommodations</span>
              </Typography>
            </Box>
          </Box>

          {/* Loading state: prominent message + skeleton cards */}
          {propertiesLoading && (
            <>
              <PageLoader
                message="Loading featured properties…"
                subMessage="Handpicking the best accommodations for you"
              />
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {[1, 2, 3, 4].map((i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                    <PropertyCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {/* Error state */}
          {!propertiesLoading && propertiesError && (
            <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: '16px', border: '1.5px dashed #fecaca', bgcolor: '#fff5f5' }}>
              <WifiOff sx={{ fontSize: 48, color: '#fca5a5', mb: 1.5 }} />
              <Typography variant="h6" fontWeight={700} sx={{ color: '#991b1b', mb: 0.5 }}>
                Couldn't load properties
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We're having trouble fetching listings right now. Please try refreshing the page.
              </Typography>
            </Paper>
          )}

          {/* Loaded cards */}
          {!propertiesLoading && !propertiesError && handpickedProperties.length > 0 && (
            <Grid container spacing={3}>
              {handpickedProperties.map((property) => (
                <Grid item xs={12} sm={6} md={3} key={property.propertyId}>
                  <PropertyCard property={property} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Explore More Button */}
          {!propertiesLoading && (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={handleExploreMore}
                sx={{
                  bgcolor: '#e53e3e', px: 5, py: 1.5, fontWeight: 700,
                  borderRadius: '10px', fontSize: '1rem', boxShadow: 'none',
                  '&:hover': { bgcolor: '#c53030', boxShadow: '0 4px 14px rgba(229,62,62,0.4)' },
                }}
              >
                Explore More
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {!isAuthenticated ? 'Login to explore all properties' : `${(properties || []).length} properties available`}
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* ── How It Works ── */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" sx={{ color: '#e53e3e', fontWeight: 700, letterSpacing: 1.5 }}>
              SIMPLE PROCESS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: '#111827' }}>
              How It Works
            </Typography>
          </Box>

          <Grid container spacing={4} alignItems="stretch">
            {[
              {
                icon: <SearchIcon sx={{ fontSize: 34 }} />,
                step: '01',
                title: 'Search',
                desc: 'Browse verified listings and filter by location, price, and amenities',
              },
              {
                icon: <ShieldIcon sx={{ fontSize: 34 }} />,
                step: '02',
                title: 'Connect',
                desc: 'Send booking requests directly to property owners',
              },
              {
                icon: <BoltIcon sx={{ fontSize: 34 }} />,
                step: '03',
                title: 'Move In',
                desc: 'Get approval and move in hassle-free with zero brokerage',
              },
            ].map((item) => (
              <Grid size={{ xs: 12, md: 4 }} key={item.step}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: '24px',
                    border: '1px solid #f0f0f0',
                    background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: '#e53e3e',
                      boxShadow: '0 12px 28px rgba(229, 62, 62, 0.12)',
                    },
                  }}
                >
                  {/* Icon circle */}
                  <Box sx={{
                    width: 80, height: 80, bgcolor: '#fff1f0',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', mx: 'auto', mb: 2.5,
                    border: '2px dashed #e53e3e', color: '#e53e3e',
                  }}>
                    {item.icon}
                  </Box>

                  {/* Step badge + title */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1.5 }}>
                    <Typography sx={{
                      color: '#e53e3e', fontWeight: 800, fontSize: '0.85rem',
                      bgcolor: '#fee2e2', px: 1.2, py: 0.3, borderRadius: '20px',
                    }}>
                      {item.step}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#111827' }}>
                      {item.title}
                    </Typography>
                  </Box>

                  {/* Description */}
                  <Typography color="text.secondary" variant="body2" sx={{ lineHeight: 1.7, maxWidth: 220, mx: 'auto' }}>
                    {item.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


      {/* ── CTA Section ── */}
      <Box sx={{
        py: 8,
        background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
      }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 1.5 }}>
              Ready to find your perfect space?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of students and professionals who found their home with StayEase.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="contained" size="large" onClick={handleStartSearching}
                sx={{
                  bgcolor: 'white', color: '#e53e3e', px: 4, py: 1.5,
                  fontWeight: 700, borderRadius: '10px', boxShadow: 'none',
                  '&:hover': { bgcolor: '#f9fafb', boxShadow: 'none' }
                }}
              >
                Start Exploring
              </Button>
              <Button variant="outlined" size="large" onClick={handleListProperty}
                sx={{
                  borderColor: 'white', color: 'white', px: 4, py: 1.5,
                  fontWeight: 700, borderRadius: '10px', borderWidth: 2,
                  '&:hover': { borderWidth: 2, bgcolor: 'rgba(255,255,255,0.15)' }
                }}
              >
                Become a Partner
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>


    </Box>
  );
};

export default HomePage;