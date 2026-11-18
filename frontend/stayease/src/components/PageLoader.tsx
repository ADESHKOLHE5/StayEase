import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface PageLoaderProps {
  message?: string;
  subMessage?: string;
  /** If true, takes full viewport height (e.g. for full page loads) */
  fullPage?: boolean;
}

/**
 * A prominent, animated loading indicator with a message.
 * Use inside any page/section while waiting for data.
 */
const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading, please wait…',
  subMessage,
  fullPage = false,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullPage ? '70vh' : '40vh',
        gap: 3,
        px: 3,
      }}
    >
      {/* Animated icon */}
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 34,
          animation: 'pulse 1.4s ease-in-out infinite',
          '@keyframes pulse': {
            '0%':   { transform: 'scale(1)',    boxShadow: '0 0 0 0 rgba(229,62,62,0.35)' },
            '50%':  { transform: 'scale(1.08)', boxShadow: '0 0 0 12px rgba(229,62,62,0)' },
            '100%': { transform: 'scale(1)',    boxShadow: '0 0 0 0 rgba(229,62,62,0)' },
          },
        }}
      >
        🏠
      </Box>

      {/* Message */}
      <Box sx={{ textAlign: 'center', maxWidth: 340 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: '#111827', mb: 0.5 }}
        >
          {message}
        </Typography>
        {subMessage && (
          <Typography variant="body2" color="text.secondary">
            {subMessage}
          </Typography>
        )}
      </Box>

      {/* Animated progress bar */}
      <Box sx={{ width: '100%', maxWidth: 280 }}>
        <LinearProgress
          sx={{
            height: 5,
            borderRadius: 10,
            bgcolor: '#fee2e2',
            '& .MuiLinearProgress-bar': {
              bgcolor: '#e53e3e',
              borderRadius: 10,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default PageLoader;
