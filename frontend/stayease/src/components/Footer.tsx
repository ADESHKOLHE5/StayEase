import React from 'react';
import { Box, Container, Typography, Divider, Grid } from '@mui/material';
import { Email, Phone, LocationOn, Facebook, Instagram, Twitter, LinkedIn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const linkSx = {
    color: '#6b7280', fontSize: '0.875rem', cursor: 'pointer',
    display: 'block', mb: 1.2, transition: 'color 0.2s',
    '&:hover': { color: '#e53e3e' },
  };

  return (
    <Box component="footer" sx={{ bgcolor: '#fff', borderTop: '1px solid #f0f0f0', mt: 'auto' }}>

      {/* ── Main Content ── */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={5}>

          {/* Brand */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: '10px',
                bgcolor: '#e53e3e', display: 'flex', alignItems: 'center',
                justifyContent: 'center', boxShadow: '0 4px 12px rgba(229,62,62,0.25)',
              }}>
                <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>SE</Typography>
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#e53e3e' }}>StayEase</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.8, mb: 3, maxWidth: 260 }}>
              Your trusted platform for finding PGs, Hostels & Apartments. Direct owners, zero brokerage.
            </Typography>
            {/* Social Icons */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {[Facebook, Instagram, Twitter, LinkedIn].map((Icon, i) => (
                <Box key={i} sx={{
                  width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #e5e7eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                  '&:hover': { bgcolor: '#e53e3e', borderColor: '#e53e3e', '& svg': { color: 'white' } },
                }}>
                  <Icon sx={{ fontSize: 16, color: '#6b7280' }} />
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', mb: 2.5, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.72rem' }}>
              Browse
            </Typography>
            {[
              { label: 'All Properties', path: '/accommodations' },
              { label: 'Apartments', path: '/accommodations' },
              { label: 'Hostels', path: '/accommodations' },
              { label: 'PGs', path: '/accommodations' },
            ].map(({ label, path }) => (
              <Typography key={label} component="span" sx={linkSx} onClick={() => navigate(path)}>
                {label}
              </Typography>
            ))}
          </Grid>

          {/* Top Cities */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', mb: 2.5, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.72rem' }}>
              Top Cities
            </Typography>
            {['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad'].map((city) => (
              <Typography key={city} component="span" sx={linkSx} onClick={() => navigate('/accommodations')}>
                {city}
              </Typography>
            ))}
          </Grid>

          {/* Contact */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', mb: 2.5, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.72rem' }}>
              Contact Us
            </Typography>
            {[
              { Icon: Email, text: 'support@stayease.com' },
              { Icon: Phone, text: '+91 98765 43210' },
              { Icon: LocationOn, text: 'Bangalore, Karnataka, India' },
            ].map(({ Icon, text }) => (
              <Box key={text} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.8 }}>
                <Box sx={{
                  width: 30, height: 30, borderRadius: '8px', bgcolor: '#fff5f5', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon sx={{ fontSize: 15, color: '#e53e3e' }} />
                </Box>
                <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.5, pt: 0.4 }}>{text}</Typography>
              </Box>
            ))}
          </Grid>

        </Grid>
      </Container>

      {/* ── Stats Row ── */}
      <Box sx={{ borderTop: '1px solid #f0f0f0', bgcolor: '#fafafa', py: 3 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {[
              { value: '50L+', label: 'Happy Users' },
              { value: '₹200Cr', label: 'Brokerage Saved' },
              { value: '2L+', label: 'Active Listings' },
            ].map((stat) => (
              <Grid size={{ xs: 4 }} key={stat.label} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.2rem', md: '1.6rem' }, color: '#e53e3e', lineHeight: 1.2 }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.62rem' }}>
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Bottom Bar ── */}
      <Divider />
      <Container maxWidth="lg">
        <Box sx={{ py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="caption" sx={{ color: '#9ca3af' }}>
            © 2026 StayEase. All rights reserved. Made with ❤️ for students and professionals.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((item) => (
              <Typography key={item} variant="caption" sx={{ color: '#9ca3af', cursor: 'pointer', '&:hover': { color: '#e53e3e' } }}>
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;