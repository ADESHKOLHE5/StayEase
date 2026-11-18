import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Box, Paper, Typography, TextField,
  Button, Alert, CircularProgress,
  IconButton, InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axiosInstance from "../api/axiosInstance";
import useAuth from "../hooks/useAuth";


interface LoginForm {
  username: string;
  password: string;
}


const pillInput = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "50px",
    bgcolor: "#fafafa",
  },
  "& .MuiOutlinedInput-notchedOutline": { border: "1.5px solid #e0e0e0" },
};

const Login = () => {
  const [error, setError]               = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

 
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginForm>({ mode: "onChange" });


  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", {
        username: data.username,
        password: data.password,
      });

      const decoded = login(response.data.token);

      if (decoded.role === "TENANT")     navigate("/accommodations");
      else if (decoded.role === "OWNER") navigate("/owner/dashboard");
      else                               navigate("/unauthorized");

    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.message || "Login failed. Check credentials.");
      } 
      else if (err.request) {
        setError("No response from server. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: "#f0f2f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Paper elevation={3} sx={{ p: 5, width: "100%", maxWidth: 420, borderRadius: 5 }}>

    
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
          Login
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Welcome back
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{
              required:  "Username is required",
              minLength: { value: 3, message: "Username must be at least 3 characters" },
              pattern:   { value: /^\S+$/, message: "Username cannot contain spaces" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Username or Email"
                fullWidth
                margin="normal"
                error={!!errors.username}
                helperText={errors.username?.message}
                sx={pillInput}
                InputProps={{ sx: { px: 1 } }}
              />
            )}
          />

          
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{
              required:  "Password is required",
              minLength: { value: 8, message: "At least 8 characters" },
              validate: {
                hasUppercase: (v) => /[A-Z]/.test(v)  || "Add at least one uppercase letter",
                hasLowercase: (v) => /[a-z]/.test(v)  || "Add at least one lowercase letter",
                hasNumber:    (v) => /[0-9]/.test(v)  || "Add at least one number",
                hasSpecial:   (v) => /[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/.test(v) || "Add at least one special character",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={pillInput}
                InputProps={{
                  sx: { px: 1 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ mr: 0.5 }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.6,
              borderRadius: "50px",
              bgcolor: "#e53e3e",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: 1,
              boxShadow: "0 4px 15px rgba(229,62,62,0.4)",
              "&:hover": { bgcolor: "#c53030" },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "LOGIN"}
          </Button>

          <Typography align="center" variant="body2" sx={{ mt: 3, color: "text.secondary" }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{ color: "#e53e3e", fontWeight: 600, textDecoration: "none" }}
            >
              Sign Up
            </Link>
          </Typography>

        </Box>
      </Paper>
    </Box>
  );
};

export default Login;