import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import useFetch from "../hooks/useFetch";
import axiosInstance from "../api/axiosInstance";

import {
  Box, Typography, TextField, Button, Paper, CircularProgress,
  Alert, Chip, InputAdornment, Divider, Stepper, Step, StepLabel,
  Select, FormControl, InputLabel, FormHelperText, MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SaveIcon from "@mui/icons-material/Save";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const pill = {
  "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#fafafa" },
};

const PROPERTY_TYPES = ["Apartment", "Villa", "PG", "Hostel"];
const STATE_CITY_MAP: Record<string, string> = {
  "Andhra Pradesh": "Amaravati",
  "Karnataka": "Bangalore",
  "Maharashtra": "Mumbai",
  "Gujarat": "Gandhinagar",
  "Tamil Nadu": "Chennai",
  "Delhi": "New Delhi",
  "Telangana": "Hyderabad",
  "Rajasthan": "Jaipur",
  "West Bengal": "Kolkata",
  "Uttar Pradesh": "Lucknow",
  "Punjab": "Chandigarh",
  "Kerala": "Thiruvananthapuram",
  "Madhya Pradesh": "Bhopal",
  "Bihar": "Patna",
  "Odisha": "Bhubaneswar",
};

const INDIAN_STATES = Object.keys(STATE_CITY_MAP);
const COMMON_FACILITIES = [
  "WiFi", "AC", "Parking", "CCTV", "Gym", "Swimming Pool",
  "Power Backup", "Lift", "Security", "Laundry", "Kitchen",
  "Hot Water", "Furnished", "TV", "Balcony",
];

const STEPS = ["Basic Info", "Pricing & Rooms", "Amenities", "Policies"];

// Define which fields belong to which step for validation triggering
const STEP_FIELDS: (keyof FormState)[][] = [
  ["propertyName", "propertyType", "address", "city", "state", "pincode"],
  ["totalRooms", "availableRooms", "rentPerMonth", "securityDeposit", "rentIncludes"],
  ["facilities", "checkInTime", "checkOutTime", "imageUrl", "description"],
  ["cancellationPolicy", "depositPolicy", "houseRules"],
];

export interface FormState {
  propertyName: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalRooms: string;
  availableRooms: string;
  rentPerMonth: string;
  securityDeposit: string;
  rentIncludes: string;
  facilities: string[];
  checkInTime: string;
  checkOutTime: string;
  description: string;
  imageUrl: string;
  cancellationPolicy: string;
  depositPolicy: string;
  houseRules: string;
}

// ─── Build form from API response ─────────────────────────────────────────────
function buildForm(p: any): FormState {
  return {
    propertyName: p.propertyName ?? "",
    propertyType: p.propertyType ?? "",
    address: p.address ?? "",
    city: p.city ?? "",
    state: p.state ?? "",
    pincode: p.pincode ?? "",
    totalRooms: String(p.totalRooms ?? ""),
    availableRooms: String(p.availableRooms ?? ""),
    rentPerMonth: String(p.rentPerMonth ?? ""),
    securityDeposit: String(p.securityDeposit ?? ""),
    rentIncludes: p.rentIncludes ?? "",
    facilities: Array.isArray(p.facilities) ? p.facilities : [],
    checkInTime: p.checkInTime ?? "",
    checkOutTime: p.checkOutTime ?? "",
    description: p.description ?? "",
    imageUrl: p.imageUrl ?? "",
    cancellationPolicy: p.cancellationPolicy ?? "",
    depositPolicy: p.depositPolicy ?? "",
    houseRules: p.houseRules ?? "",
  };
}

// ─── Main Component ─────────────────────────────────────────────────────────────
const UpdateProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: property, loading, error } = useFetch(`/properties/details/${id}`);

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSuccess] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormState>({
    mode: "onChange", // Validates fields as user types for immediate feedback
  });

  // Populate form when API data arrives
  useEffect(() => {
    if (property) {
      reset(buildForm(property));
    }
  }, [property, reset]);

  // Handle Step Navigation with Validation
  const goNext = async () => {
    // 1. Trigger validation ONLY for the current step's fields
    const fieldsToValidate = STEP_FIELDS[step];
    const isStepValid = await trigger(fieldsToValidate);

    // 2. If valid, proceed to next step. If invalid, RHF auto-displays errors.
    if (isStepValid) {
      setStep((s) => s + 1);
    }
  };

  const goPrev = () => setStep((s) => s - 1);

  // Handle Form Submission
  const onSubmit = async (data: FormState) => {
    setSubmitting(true);
    setSubmitError(null);
    setSuccess(false);

    const payload = {
      ...data,
      totalRooms: data.totalRooms ? parseInt(data.totalRooms) : undefined,
      availableRooms: data.availableRooms ? parseInt(data.availableRooms) : undefined,
      rentPerMonth: data.rentPerMonth ? parseFloat(data.rentPerMonth) : undefined,
      securityDeposit: data.securityDeposit ? parseFloat(data.securityDeposit) : undefined,
    };

    try {
      await axiosInstance.put(`/properties/owner/update/${id}`, payload);
      setSuccess(true);
      setTimeout(() => navigate(-1), 1500);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message ?? "Failed to update property.");
    } finally {
      setSubmitting(false);
    }
  };

  const showSpinner = loading || (!error && !isDirty && Object.keys(watch()).length === 0);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f2f5", display: "flex", alignItems: "flex-start", justifyContent: "center", py: 6, px: 2 }}>
      <Box sx={{ width: "100%", maxWidth: 680 }}>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ color: "#e53e3e", fontWeight: 600 }}>
            Back
          </Button>
          <HomeWorkIcon sx={{ color: "#e53e3e" }} />
          <Typography variant="h5" fontWeight={800} color="#111827">Edit Property</Typography>
        </Box>

        {showSpinner && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress sx={{ color: "#e53e3e" }} />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}

        {!showSpinner && !error && (
          <Paper elevation={2} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 5 }}>
            <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
              {STEPS.map((label, idx) => (
                <Step key={label} completed={idx < step}>
                  <StepLabel StepIconProps={{ sx: { "&.Mui-completed": { color: "#e53e3e" }, "&.Mui-active": { color: "#e53e3e" } } }}>
                    <Typography variant="caption" fontWeight={600}>{label}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box component="form">
              {/* ─── STEP 0: BASIC INFO ──────────────────────────────────────── */}
              {step === 0 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700}>Basic Information</Typography>

                  <TextField
                    fullWidth label="Property Name" sx={pill}
                    {...register("propertyName", {
                      required: "Property name is required",
                      minLength: { value: 3, message: "At least 3 characters required" },
                      maxLength: { value: 100, message: "Maximum 100 characters allowed" }
                    })}
                    error={!!errors.propertyName} helperText={errors.propertyName?.message}
                  />

                  <FormControl fullWidth error={!!errors.propertyType}>
                    <InputLabel>Property Type</InputLabel>
                    <Controller
                      name="propertyType" control={control} rules={{ required: "Please select a property type" }}
                      render={({ field }) => (
                        <Select {...field} label="Property Type" sx={{ borderRadius: "14px", bgcolor: "#fafafa" }}>
                          {PROPERTY_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                        </Select>
                      )}
                    />
                    {errors.propertyType && <FormHelperText>{errors.propertyType.message}</FormHelperText>}
                  </FormControl>

                  <TextField
                    fullWidth label="Address" sx={pill}
                    {...register("address", {
                    required: "Address is required",
                    minLength: { value: 5, message: "Address must be at least 5 characters" },
                    maxLength: { value: 200, message: "Address cannot exceed 200 characters" }
                   })}
                  
                    error={!!errors.address} helperText={errors.address?.message}
                  />

                 <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>

  <FormControl fullWidth error={!!errors.state}>
    <InputLabel>State</InputLabel>
    <Controller
      name="state" control={control}
      rules={{ required: "Please select a state" }}
      render={({ field }) => (
        <Select
          {...field}
          label="State"
          sx={{ borderRadius: "14px", bgcolor: "#fafafa" }}
          onChange={(e) => {
            field.onChange(e);
            // auto-set city to capital of selected state
            setValue("city", STATE_CITY_MAP[e.target.value as string] || "", { shouldValidate: true });
          }}
        >
          {INDIAN_STATES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </Select>
      )}
    />
    {errors.state && <FormHelperText>{errors.state.message}</FormHelperText>}
  </FormControl>

  {/* City is auto-filled from state — read only */}
  <TextField
    label="City (Capital)" sx={pill}
    {...register("city", { required: "City is required" })}
    error={!!errors.city} helperText={errors.city?.message}
    InputProps={{ readOnly: true }}
    InputLabelProps={{ shrink: !!watch("city") }}
  />

  <TextField
    label="Pincode" sx={pill} inputProps={{ maxLength: 6 }}
    {...register("pincode", {
      required: "Pincode is required",
      pattern: { value: /^\d{6}$/, message: "Pincode must be exactly 6 digits" }
    })}
    error={!!errors.pincode} helperText={errors.pincode?.message}
  />
</Box> 
                </Box>
              )}

              {/* ─── STEP 1: PRICING & ROOMS ─────────────────────────────────── */}
              {step === 1 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700}>Pricing & Rooms</Typography>

                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                      label="Total Rooms" type="number" sx={pill}
                      {...register("totalRooms", {
                      required: "Total rooms required",
                      min: { value: 1, message: "Must be at least 1 room" },
                      max: { value: 1000, message: "Cannot exceed 1000 rooms" }
                      })}
                      error={!!errors.totalRooms} helperText={errors.totalRooms?.message}
                    />
                    
                    <TextField
                      label="Available Rooms" type="number" sx={pill}
                      {...register("availableRooms", {
                        required: "Available rooms required",
                        min: { value: 0, message: "Cannot be negative" },
                        validate: (val, formValues) => {
                          if (!formValues.totalRooms) return true;
                          return parseInt(val) <= parseInt(formValues.totalRooms) || "Cannot exceed total rooms";
                        }
                      })}
                      error={!!errors.availableRooms} helperText={errors.availableRooms?.message}
                    />
                  </Box>

                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                      label="Rent / Month" type="number" sx={pill}
                      InputProps={{ startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon sx={{ fontSize: 18 }} /></InputAdornment> }}
                      {...register("rentPerMonth", {
                        required: "Rent amount is required",
                        min: { value: 1, message: "Rent must be greater than 0" }
                      })}
                      error={!!errors.rentPerMonth} helperText={errors.rentPerMonth?.message}
                    />
                    <TextField
                      label="Security Deposit" type="number" sx={pill}
                      InputProps={{ startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon sx={{ fontSize: 18 }} /></InputAdornment> }}
                      {...register("securityDeposit", {
                       required: "Security deposit is required",
                       min: { value: 1, message: "Must be greater than 0" } 
                      })}
                      error={!!errors.securityDeposit} helperText={errors.securityDeposit?.message}
                    />
                  </Box>

                  <TextField
                    fullWidth label="Rent Includes (e.g. WiFi, Water)" sx={pill}
                    {...register("rentIncludes", {
                    required: "Please specify what rent includes"
                  })}
                  error={!!errors.rentIncludes} helperText={errors.rentIncludes?.message ?? "Comma separated list"}
                  />
                </Box>
              )}

              {/* ─── STEP 2: AMENITIES ───────────────────────────────────────── */}
              {step === 2 && (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
    <Typography variant="subtitle1" fontWeight={700}>Amenities & Timings</Typography>

    <Controller
      name="facilities"
      control={control}
      rules={{ validate: (val) => (val && val.length > 0) || "Select at least one facility" }}
      render={({ field, fieldState }) => (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Select available facilities
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {COMMON_FACILITIES.map(f => {
              const selected = (field.value || []).includes(f);
              return (
                <Chip
                  key={f} label={f} clickable
                  onClick={() => {
                    const updated = selected
                      ? field.value.filter((item: string) => item !== f)
                      : [...(field.value || []), f];
                    field.onChange(updated);
                  }}
                  sx={{
                    bgcolor: selected ? "#e53e3e" : "#f3f4f6",
                    color: selected ? "#fff" : "#374151",
                    fontWeight: 600,
                    border: selected ? "none" : "1.5px solid #e5e7eb",
                    "&:hover": { bgcolor: selected ? "#c53030" : "#fecaca", color: selected ? "#fff" : "#e53e3e" },
                  }}
                />
              );
            })}
          </Box>
          {fieldState.error && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
              {fieldState.error.message}
            </Typography>
          )}
        </Box>
      )}
    />

    <Divider />

    {/* ✅ Only checkIn/checkOut inside the 2-column grid */}
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
      <TextField
        label="Check-In Time" placeholder="e.g. 12:00 PM" sx={pill}
        InputProps={{ startAdornment: <InputAdornment position="start"><AccessTimeIcon sx={{ fontSize: 18 }} /></InputAdornment> }}
        {...register("checkInTime", {
          required: "Check-in time is required"
        })}
        error={!!errors.checkInTime} helperText={errors.checkInTime?.message}
      />
      <TextField
        label="Check-Out Time" placeholder="e.g. 11:00 AM" sx={pill}
        InputProps={{ startAdornment: <InputAdornment position="start"><AccessTimeIcon sx={{ fontSize: 18 }} /></InputAdornment> }}
        {...register("checkOutTime", {
          required: "Check-out time is required"
        })}
        error={!!errors.checkOutTime} helperText={errors.checkOutTime?.message}
      />
    </Box>  {/* ✅ Grid box closes HERE — before imageUrl and description */}

    {/* ✅ These are outside the grid, as standalone full-width fields */}
    <TextField
      fullWidth label="Image URL" placeholder="https://..." sx={pill}
      {...register("imageUrl", {
        required: "Image URL is required",
        pattern: { value: /^https?:\/\/.+/, message: "Must be a valid URL starting with http:// or https://" }
      })}
      error={!!errors.imageUrl} helperText={errors.imageUrl?.message}
    />

    <TextField
      fullWidth label="Description" multiline rows={3} sx={pill}
      {...register("description", {
        required: "Description is required",
        minLength: { value: 10, message: "Minimum 10 characters" },
        maxLength: { value: 1000, message: "Description cannot exceed 1000 characters" }
      })}
      error={!!errors.description} helperText={errors.description?.message ?? `${watch("description")?.length || 0} / 1000`}
    />

  </Box>
)}

              {/* ─── STEP 3: POLICIES ────────────────────────────────────────── */}
              {step === 3 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700}>Policies & Rules</Typography>
                  <TextField fullWidth label="Cancellation Policy" multiline rows={2} sx={pill}
                 {...register("cancellationPolicy", {
                 required: "Cancellation policy is required",
                 minLength: { value: 10, message: "Minimum 10 characters" }
                 })}
                 placeholder="e.g. Full refund if cancelled 7 days before check-in"
                 error={!!errors.cancellationPolicy} helperText={errors.cancellationPolicy?.message} />
                  <TextField fullWidth label="Deposit Policy" multiline rows={2} sx={pill}
                 {...register("depositPolicy", {
                 required: "Deposit policy is required",
                 minLength: { value: 10, message: "Minimum 10 characters" }
                 })}
                 placeholder="e.g. Security deposit refunded within 7 days after checkout"
                 error={!!errors.depositPolicy} helperText={errors.depositPolicy?.message} />
                 <TextField fullWidth label="House Rules" multiline rows={3} sx={pill}
                 {...register("houseRules", {
                 required: "House rules are required",
                 minLength: { value: 10, message: "Minimum 10 characters" }
                 })}
                 placeholder="e.g. No smoking, No pets, Quiet hours after 10 PM"
                 error={!!errors.houseRules} helperText={errors.houseRules?.message} />
                </Box>
              )}

              {/* Notifications & Action Buttons */}
              {submitError && <Alert severity="error" sx={{ mt: 3, borderRadius: 3 }}>{submitError}</Alert>}
              {submitSuccess && <Alert severity="success" sx={{ mt: 3, borderRadius: 3 }}>Property updated! Redirecting…</Alert>}

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, gap: 2 }}>
                <Button
                  variant="outlined" disabled={step === 0 || submitting} onClick={goPrev}
                  sx={{ flex: 1, py: 1.4, borderRadius: "50px", borderColor: "#e53e3e", color: "#e53e3e", fontWeight: 700, "&:hover": { borderColor: "#c53030", bgcolor: "transparent" } }}
                >
                  Previous
                </Button>

                {step < STEPS.length - 1 ? (
                  <Button
                    variant="contained" endIcon={<ArrowForwardIcon />} onClick={goNext}
                    sx={{ flex: 1, py: 1.4, borderRadius: "50px", bgcolor: "#e53e3e", fontWeight: 700, "&:hover": { bgcolor: "#c53030" } }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained" onClick={handleSubmit(onSubmit)} disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                    sx={{ flex: 1, py: 1.4, borderRadius: "50px", bgcolor: "#e53e3e", fontWeight: 700, boxShadow: "0 4px 15px rgba(229,62,62,0.35)", "&:hover": { bgcolor: "#c53030" } }}
                  >
                    {submitting ? "Saving…" : "Save Changes"}
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default UpdateProperty;