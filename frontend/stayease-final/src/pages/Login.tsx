import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Container, Paper, Typography, TextField, Button, Alert, InputAdornment, IconButton } from '@mui/material';
import { Home as HomeIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useStore } from '../store';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!validateForm()) return;

    const success = login(formData.email, formData.password);
    if (success) {
      const user = useStore.getState().currentUser;
      navigate(user?.role === 'OWNER' ? '/owner/dashboard' : '/');
    } else {
      setLoginError('Invalid email or password');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="sm" sx={{ flex: 1, py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ width: 64, height: 64, bgcolor: '#e53e3e', borderRadius: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <HomeIcon sx={{ color: 'white', fontSize: 40 }} />
            </Box>
            <Typography variant="h4" fontWeight={700} color="#e53e3e">StayEase</Typography>
          </Box>
        </Box>

        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" align="center" fontWeight={700} gutterBottom>Log in</Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>Welcome back! Please enter your details.</Typography>

          {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: undefined }); }} error={!!errors.email} helperText={errors.email} sx={{ mb: 2 }} />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErrors({ ...errors, password: undefined }); }}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button type="submit" fullWidth variant="contained" size="large" sx={{ bgcolor: '#e53e3e', py: 1.5, fontWeight: 600, '&:hover': { bgcolor: '#c53030' } }}>
              Log In
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account? <Link to="/signup" style={{ color: '#e53e3e', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default Login;
