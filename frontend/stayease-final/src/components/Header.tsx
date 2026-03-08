import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container,
  Divider,
} from '@mui/material';
import { Home as HomeIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useStore } from '../store';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser, logout } = useStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
    handleProfileMenuClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleProfileMenuClose();
  };

  const getUserInitials = () => {
    if (!currentUser) return '';
    return `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();
  };

  const isOwnerRoute = location.pathname.startsWith('/owner');

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', boxShadow: 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#e53e3e',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HomeIcon sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#e53e3e', display: { xs: 'none', sm: 'block' } }}>
              StayEase
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          {isAuthenticated && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, mr: 2 }}>
              {!isOwnerRoute ? (
                <>
                  <Button
                    component={Link}
                    to="/"
                    sx={{
                      color: location.pathname === '/' ? '#e53e3e' : 'text.primary',
                      fontWeight: location.pathname === '/' ? 600 : 400,
                    }}
                  >
                    Home
                  </Button>
                  <Button
                    component={Link}
                    to="/accommodations"
                    sx={{
                      color: location.pathname === '/accommodations' ? '#e53e3e' : 'text.primary',
                      fontWeight: location.pathname === '/accommodations' ? 600 : 400,
                    }}
                  >
                    Find Accommodation
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/owner/dashboard"
                    sx={{
                      color: location.pathname === '/owner/dashboard' ? '#e53e3e' : 'text.primary',
                      fontWeight: location.pathname === '/owner/dashboard' ? 600 : 400,
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    component={Link}
                    to="/owner/bookings"
                    sx={{
                      color: location.pathname === '/owner/bookings' ? '#e53e3e' : 'text.primary',
                      fontWeight: location.pathname === '/owner/bookings' ? 600 : 400,
                    }}
                  >
                    Booking Requests
                  </Button>
                  <Button
                    component={Link}
                    to="/owner/listings"
                    sx={{
                      color: location.pathname === '/owner/listings' ? '#e53e3e' : 'text.primary',
                      fontWeight: location.pathname === '/owner/listings' ? 600 : 400,
                    }}
                  >
                    My Listings
                  </Button>
                </>
              )}
            </Box>
          )}

          {isAuthenticated ? (
            <>
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: '50px',
                  p: 0.5,
                  gap: 1,
                }}
              >
                <MenuIcon sx={{ color: 'text.secondary' }} />
                <Avatar sx={{ bgcolor: '#e53e3e', width: 32, height: 32, fontSize: '0.875rem', fontWeight: 600 }}>
                  {getUserInitials()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {currentUser?.firstName} {currentUser?.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {currentUser?.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{ color: 'text.primary', borderColor: 'grey.300' }}
              >
                Login
              </Button>
              <Button component={Link} to="/signup" variant="contained" sx={{ bgcolor: '#e53e3e' }}>
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
