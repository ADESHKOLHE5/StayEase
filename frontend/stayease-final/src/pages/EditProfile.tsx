import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useStore } from '../store';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useStore();
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });
  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone must be 10 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (!validateForm() || !currentUser) return;

    updateProfile(currentUser.userId, formData);
    setSuccess(true);
    setTimeout(() => navigate(-1), 1500);
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
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>Edit Profile</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Update your personal information
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 2 }}>Profile updated successfully!</Alert>}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={!!errors.firstName} helperText={errors.firstName} />
              <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={!!errors.lastName} helperText={errors.lastName} />
            </Box>

            <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} sx={{ mb: 2 }} />
            <TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} error={!!errors.phone} helperText={errors.phone} sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" fullWidth onClick={() => navigate(-1)} sx={{ color: 'text.primary', borderColor: 'grey.300' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: '#e53e3e', '&:hover': { bgcolor: '#c53030' } }}>
                Save Changes
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default EditProfile;
