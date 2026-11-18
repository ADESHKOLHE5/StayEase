import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box, Container, Paper, Typography, TextField, Button,
  Alert, FormControl, FormLabel, RadioGroup, FormControlLabel,
  Radio, InputAdornment, IconButton, MenuItem, Select,
  InputLabel, FormHelperText,
} from '@mui/material';
import { Home as HomeIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import axiosInstance from '../api/axiosInstance';
import CustomAlert from '../components/CustomAlert';

const roundedField = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '50px',
    backgroundColor: '#fff',
    '& fieldset': { borderColor: '#e0e0e0' },
    '&:hover fieldset': { borderColor: '#bdbdbd' },
    '&.Mui-focused fieldset': { borderColor: '#e53e3e' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#e53e3e' },
};

interface SignupForm {
  firstName:       string;
  lastName:        string;
  email:           string;
  username:        string;
  phone:           string;
  password:        string;
  confirmPassword: string;
  gender:          'male' | 'female' | 'other' | '';
  role:            'TENANT' | 'ADMIN' | '';
  age:             number | '';
}

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [signupError,   setSignupError]   = useState('');
  const [loading,       setLoading]       = useState(false);
  const [showPassword,  setShowPassword]  = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);

  const [alertOpen,    setAlertOpen]    = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType,    setAlertType]    = useState<'success' | 'error' | 'warning' | 'info'>('success');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SignupForm>({ mode: 'onChange' });

  const watchedPassword = watch('password');
  const watchedEmail    = watch('email');

  // ── Auto-sync username = email ────────────────────────────────────────────
  useEffect(() => {
    setValue('username', watchedEmail ?? '', { shouldValidate: !!errors.username });
  }, [watchedEmail]);

  const onSubmit = async (data: SignupForm) => {
    setSignupError('');
    setLoading(true);
    try {
      await axiosInstance.post('/auth/register', {
        firstname:   data.firstName,
        lastname:    data.lastName,
        email:       data.email,
        username:    data.email,
        phoneNumber: data.phone,
        password:    data.password,
        gender:      data.gender,
        role:        data.role,
        age:         Number(data.age),
      });

      setAlertType('success');
      setAlertMessage('🎉 Account created successfully! Now you can login. Redirecting in 3 seconds…');
      setAlertOpen(true);
      setTimeout(() => navigate('/login'), 3000);

    } catch (err: any) {
      const msg: string = err.response?.data?.message || err.response?.data || '';

      if (msg.toLowerCase().includes('email') && msg.toLowerCase().includes('already')) {
        setSignupError('Email ID already registered. Please use a different email or log in.');
      } else if (msg.toLowerCase().includes('username') && msg.toLowerCase().includes('already')) {
        setSignupError('Username already registered. Please use a different username.');
      } else {
        setSignupError(msg || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container component="main" maxWidth="sm" sx={{ flex: 1, py: 8 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Join StayEase today
          </Typography>

          {signupError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
              {signupError}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            {/* ── First Name + Last Name ── */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}   // ← only on error
                sx={roundedField}
                {...register('firstName', {
                  required:  'First name is required',
                  minLength: { value: 3,  message: 'First name must be at least 3 characters' },
                  maxLength: { value: 30, message: 'First name cannot exceed 30 characters' },
                  pattern:   { value: /^[A-Za-z]+$/, message: 'Only alphabets allowed' },
                })}
              />
              <TextField
                fullWidth
                label="Last Name"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}    // ← only on error
                sx={roundedField}
                {...register('lastName', {
                  required:  'Last name is required',
                  minLength: { value: 3,  message: 'Last name must be at least 3 characters' },
                  maxLength: { value: 30, message: 'Last name cannot exceed 30 characters' },
                  pattern:   { value: /^[A-Za-z]+$/, message: 'Only alphabets allowed' },
                })}
              />
            </Box>

            {/* ── Email ── */}
            <TextField
              fullWidth label="Email" type="email"
              error={!!errors.email}
              helperText={errors.email?.message}         // ← only on error
              sx={{ ...roundedField, mb: 2 }}
              {...register('email', {
                required: 'Email is required',
                pattern:  { value: /\S+@\S+\.\S+/, message: 'Enter a valid email address' },
              })}
            />
{/* 
            ── Username (hidden / auto-filled, kept for form submission) ──
            <TextField
              fullWidth
              label="Username"
              disabled                                   // ← read-only, auto-filled from email
              error={!!errors.username}
              helperText={errors.username?.message}      // ← only on error
              sx={{ ...roundedField, mb: 2 }}
              {...register('username', {
                required: 'Username is required',
                validate: {
                  matchesEmail:  (v) => v === getValues('email') || 'Username must match your email address',
                  isEmailFormat: (v) => /\S+@\S+\.\S+/.test(v)  || 'Username must be a valid email format',
                },
              })}
            /> */}

            {/* ── Phone ── */}
            <TextField
              fullWidth label="Phone Number"
              error={!!errors.phone}
              helperText={errors.phone?.message}         // ← only on error
              sx={{ ...roundedField, mb: 2 }}
              {...register('phone', {
                required: 'Phone number is required',
                pattern:  { value: /^\d{10}$/, message: 'Must be exactly 10 digits' },
              })}
            />

            {/* ── Age ── */}
            <TextField
              fullWidth label="Age" type="number"
              error={!!errors.age}
              helperText={errors.age?.message}           // ← only on error
              sx={{ ...roundedField, mb: 2 }}
              inputProps={{ min: 15, max: 100 }}
              {...register('age', {
                required: 'Age is required',
                min:      { value: 15,  message: 'Age must be at least 15' },
                max:      { value: 100, message: 'Age must be 100 or below' },
                validate: (v) => Number.isInteger(Number(v)) || 'Age must be a whole number',
              })}
            />

            {/* ── Password ── */}
            <TextField
              fullWidth label="Password"
              type={showPassword ? 'text' : 'password'}
              error={!!errors.password}
              helperText={errors.password?.message}      // ← only on error
              sx={{ ...roundedField, mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ mr: 0.5 }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password', {
                required:  'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
                validate: {
                  hasUppercase: (v) => /[A-Z]/.test(v)  || 'Add at least one uppercase letter',
                  hasLowercase: (v) => /[a-z]/.test(v)  || 'Add at least one lowercase letter',
                  hasNumber:    (v) => /[0-9]/.test(v)  || 'Add at least one number',
                  hasSpecial:   (v) => /[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/.test(v) || 'Add at least one special character',
                },
              })}
            />

            {/* ── Confirm Password ── */}
            <TextField
              fullWidth label="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}  // ← only on error
              sx={{ ...roundedField, mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" sx={{ mr: 0.5 }}>
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === watchedPassword || 'Passwords do not match',
              })}
            />

            {/* ── Role Dropdown ── */}
            <Controller
              name="role"
              control={control}
              defaultValue=""
              rules={{ required: 'Please select a role' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.role} sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '50px', backgroundColor: '#fff',
                    '& fieldset': { borderColor: '#e0e0e0' },
                    '&:hover fieldset': { borderColor: '#bdbdbd' },
                    '&.Mui-focused fieldset': { borderColor: '#e53e3e' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#e53e3e' },
                }}>
                  <InputLabel>Role</InputLabel>
                  <Select {...field} label="Role">
                    <MenuItem value="TENANT">tenant</MenuItem>
                    <MenuItem value="OWNER">owner</MenuItem>
                  </Select>
                  {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
                </FormControl>
              )}
            />

            {/* ── Gender ── */}
            <Controller
              name="gender"
              control={control}
              defaultValue=""
              rules={{ required: 'Please select your gender' }}
              render={({ field }) => (
                <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                  <FormLabel component="legend" sx={{ '&.Mui-focused': { color: '#e53e3e' } }}>
                    Gender
                  </FormLabel>
                  <RadioGroup row {...field}>
                    <FormControlLabel value="Male"   control={<Radio sx={{ '&.Mui-checked': { color: '#e53e3e' } }} />} label="Male"   />
                    <FormControlLabel value="Female" control={<Radio sx={{ '&.Mui-checked': { color: '#e53e3e' } }} />} label="Female" />
                    <FormControlLabel value="Others" control={<Radio sx={{ '&.Mui-checked': { color: '#e53e3e' } }} />} label="Others" />
                  </RadioGroup>
                  {errors.gender && (
                    <Typography variant="caption" color="error">{errors.gender.message}</Typography>
                  )}
                </FormControl>
              )}
            />

            {/* ── Submit ── */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                bgcolor: '#e53e3e',
                borderRadius: '50px',
                py: 1.5,
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: 1,
                boxShadow: '0 4px 15px rgba(229,62,62,0.4)',
                '&:hover': { bgcolor: '#c53030', boxShadow: '0 6px 20px rgba(229,62,62,0.5)' },
                '&.Mui-disabled': { bgcolor: '#f5a5a5', color: '#fff' },
              }}
            >
              {loading ? 'Creating Account…' : 'SIGN UP'}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#e53e3e', textDecoration: 'none', fontWeight: 600 }}>
                Log in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>

      <CustomAlert
        open={alertOpen}
        message={alertMessage}
        severity={alertType}
        onClose={() => setAlertOpen(false)}
      />
    </Box>
  );
};

export default Signup;