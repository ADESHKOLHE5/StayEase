import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button,
  Menu, MenuItem, Avatar, Box, Container, Divider, Chip, Badge,
} from '@mui/material';
import { Home as HomeIcon, KeyboardArrowDown } from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import axiosInstance from '../api/axiosInstance';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!user;
  const userRole = user?.role;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [newBookingCount, setNewBookingCount] = useState(0);

  const open = Boolean(anchorEl);
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => { logout(); navigate('/'); handleMenuClose(); };

  const isActive = (path: string) => location.pathname === path;

  // ── Booking badge logic (TENANT only) ──────────────────────────────────────
  useEffect(() => {
    if (!user || userRole !== 'TENANT') {
      setNewBookingCount(0);
      return;
    }

    const storageKey = `bookings_seen_count_${user.sub}`;

    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get('/bookings/tenant/my');
        const bookings = res.data;
        const totalCount = Array.isArray(bookings) ? bookings.length : 0;
        const seenCount = parseInt(localStorage.getItem(storageKey) || '0', 10);
        const diff = totalCount - seenCount;
        setNewBookingCount(diff > 0 ? diff : 0);
      } catch {
        // silently ignore
      }
    };

    fetchBookings();
  }, [user, userRole]);

  // When tenant visits My Bookings page → clear badge
  useEffect(() => {
    if (userRole !== 'TENANT' || !user) return;
    if (location.pathname === '/tenant/my-bookings') {
      const storageKey = `bookings_seen_count_${user.sub}`;
      // Fetch current count and mark as seen
      axiosInstance.get('/bookings/tenant/my').then(res => {
        const totalCount = Array.isArray(res.data) ? res.data.length : 0;
        localStorage.setItem(storageKey, String(totalCount));
        setNewBookingCount(0);
      }).catch(() => {});
    }
  }, [location.pathname, user, userRole]);

  const navLinkSx = (path: string) => ({
    color: isActive(path) ? '#e53e3e' : '#374151',
    fontWeight: isActive(path) ? 700 : 500,
    fontSize: '0.875rem',
    borderRadius: '10px',
    px: 1.5, py: 0.75,
    textTransform: 'none' as const,
    '&:hover': { bgcolor: '#fff5f5', color: '#e53e3e' },
    ...(isActive(path) && { bgcolor: '#fff5f5' }),
  });

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #f0f0f0',
        color: 'text.primary',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1, minHeight: '64px !important' }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Box sx={{
              width: 38, height: 38, bgcolor: '#e53e3e', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(229,62,62,0.3)',
            }}>
              <HomeIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, color: '#e53e3e', fontSize: '1.15rem', letterSpacing: '-0.3px', display: { xs: 'none', sm: 'block' } }}>
              StayEase
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          {/* ── Nav Links ── */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            <Button component={Link} to="/" sx={navLinkSx('/')}>Home</Button>
            <Button component={Link} to="/accommodations" sx={navLinkSx('/accommodations')}>Find Accommodation</Button>

            {isAuthenticated && userRole === 'TENANT' && (
              <Badge
                badgeContent={newBookingCount}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    minWidth: 18,
                    height: 18,
                    top: 6,
                    right: 4,
                  },
                }}
              >
                <Button component={Link} to="/tenant/my-bookings" sx={navLinkSx('/tenant/my-bookings')}>
                  My Bookings
                </Button>
              </Badge>
            )}

            {isAuthenticated && userRole === 'OWNER' && (
              <>
                <Button component={Link} to="/owner/dashboard" sx={navLinkSx('/owner/dashboard')}>Dashboard</Button>
                <Button component={Link} to="/owner/bookings" sx={navLinkSx('/owner/bookings')}>Booking Requests</Button>
                <Button component={Link} to="/owner/browse" sx={navLinkSx('/owner/browse')}>My Listings</Button>
              </>
            )}
          </Box>

          <Box sx={{ flexGrow: 0.5 }} />

          {/* ── Auth ── */}
          {isAuthenticated ? (
            <>
              <Box
                onClick={handleMenuOpen}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  border: '1.5px solid #e5e7eb', borderRadius: '50px',
                  px: 1.5, py: 0.5, cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: '#fca5a5', bgcolor: '#fff5f5' },
                }}
              >
                <Avatar sx={{ bgcolor: '#e53e3e', width: 30, height: 30, fontSize: '0.8rem', fontWeight: 700 }}>
                  {(user?.sub || '?').charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>
                    {user?.sub}
                  </Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: '#6b7280', lineHeight: 1 }}>
                    {userRole}
                  </Typography>
                </Box>
                <KeyboardArrowDown sx={{ fontSize: 18, color: '#9ca3af' }} />
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1, minWidth: 180, borderRadius: '12px',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body2" fontWeight={700} color="#111827">{user?.sub}</Typography>
                  <Chip label={userRole} size="small" sx={{ mt: 0.5, height: 20, fontSize: '0.68rem', bgcolor: '#fff5f5', color: '#e53e3e', fontWeight: 600 }} />
                </Box>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: '#e53e3e', fontWeight: 600, fontSize: '0.875rem', mt: 0.5, mb: 0.5 }}>
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link} to="/login" variant="outlined"
                sx={{
                  color: '#374151', borderColor: '#d1d5db', fontWeight: 600,
                  borderRadius: '10px', textTransform: 'none', fontSize: '0.875rem',
                  '&:hover': { borderColor: '#e53e3e', color: '#e53e3e', bgcolor: '#fff5f5' },
                }}
              >
                Login
              </Button>
              <Button
                component={Link} to="/signup" variant="contained"
                sx={{
                  bgcolor: '#e53e3e', fontWeight: 600, borderRadius: '10px',
                  textTransform: 'none', fontSize: '0.875rem', boxShadow: 'none',
                  '&:hover': { bgcolor: '#c53030', boxShadow: '0 4px 12px rgba(229,62,62,0.3)' },
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;