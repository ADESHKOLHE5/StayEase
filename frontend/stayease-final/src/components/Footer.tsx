import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#2d3748', color: 'white', py: 2, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#e53e3e', mb: 0.5 }}>
            StayEase
          </Typography>
          <Typography variant="caption" color="grey.400">
            © 2026 StayEase Platform. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
