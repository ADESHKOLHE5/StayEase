import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Fade } from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import useAuth from '../hooks/useAuth';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleGoBack = () => {
    logout();
    navigate('/login');
  };

  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#fafafa',
          p: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 450,
            width: '100%',
            p: { xs: 4, md: 5 },
            borderRadius: '24px',
            textAlign: 'center',
            border: '1px solid',
            borderColor: '#f0f0f0',
            background: 'linear-gradient(145deg, #ffffff 0%, #fcfcfc 100%)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          }}
        >
          {/* Icon with decorative background */}
          <Box
            sx={{
              width: 96,
              height: 96,
              bgcolor: '#fee',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              border: '2px dashed #e53e3e',
            }}
          >
            <LockIcon sx={{ fontSize: 48, color: '#e53e3e' }} />
          </Box>

          {/* Error code */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '5rem', md: '6rem' },
              fontWeight: 800,
              lineHeight: 1,
              color: '#e53e3e',
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            403
          </Typography>

          {/* Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#111827',
              mb: 1.5,
            }}
          >
            Access Denied
          </Typography>

          {/* Message */}
          <Typography
            variant="body1"
            sx={{
              color: '#6b7280',
              mb: 4,
              maxWidth: 300,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            You don't have permission to view this page. Please log in with appropriate credentials.
          </Typography>

          {/* Button with hover effect */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleGoBack}
            sx={{
              bgcolor: '#e53e3e',
              py: 1.5,
              fontWeight: 700,
              borderRadius: '12px',
              fontSize: '1rem',
              boxShadow: 'none',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: '#c53030',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(229, 62, 62, 0.3)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            Back to Login
          </Button>
        </Paper>
      </Box>
    </Fade>
  );
};

export default Unauthorized;