import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Home as HomeIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useStore } from '../store';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'TENANT' as 'TENANT' | 'OWNER',
    gender: '' as 'Male' | 'Female' | 'Others' | '',
  });
  const [errors, setErrors] = useState<any>({});
  const [signupError, setSignupError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone number must be 10 digits';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.gender) newErrors.gender = 'Please select your gender';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    if (!validateForm()) return;

    const success = signup(formData);
    if (success) {
      navigate(formData.role === 'OWNER' ? '/owner/dashboard' : '/');
    } else {
      setSignupError('Email already exists. Please use a different email.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
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
          <Typography variant="h5" align="center" fontWeight={700} gutterBottom>Create Account</Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>Join StayEase today</Typography>

          {signupError && <Alert severity="error" sx={{ mb: 2 }}>{signupError}</Alert>}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={!!errors.firstName} helperText={errors.firstName} />
              <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={!!errors.lastName} helperText={errors.lastName} />
            </Box>

            <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} sx={{ mb: 2 }} />
            <TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} error={!!errors.phone} helperText={errors.phone} sx={{ mb: 2 }} />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 2 }}
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

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                <FormControlLabel value="Others" control={<Radio />} label="Others" />
              </RadioGroup>
              {errors.gender && <Typography variant="caption" color="error">{errors.gender}</Typography>}
            </FormControl>

            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">I am a:</FormLabel>
              <RadioGroup row name="role" value={formData.role} onChange={handleChange}>
                <FormControlLabel value="TENANT" control={<Radio />} label="Tenant" />
                <FormControlLabel value="OWNER" control={<Radio />} label="Owner" />
              </RadioGroup>
            </FormControl>

            <Button type="submit" fullWidth variant="contained" size="large" sx={{ bgcolor: '#e53e3e', py: 1.5, fontWeight: 600, '&:hover': { bgcolor: '#c53030' } }}>
              Sign Up
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account? <Link to="/login" style={{ color: '#e53e3e', textDecoration: 'none', fontWeight: 600 }}>Log in</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default Signup;
