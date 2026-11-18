import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Box, Paper, Typography, TextField, Button, Alert,
  CircularProgress, MenuItem, Stepper, Step, StepLabel,
  Checkbox, FormControlLabel, FormGroup, FormLabel,
  FormControl, FormHelperText,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";

const STEPS = ["Basic Info", "Unit & Pricing", "Amenities & Timings", "Policies"];

const PROPERTY_TYPES = ["Apartment", "Villa", "PG", "Hostel"];


const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
   "Pune", "Ahmedabad", 
];

const FACILITIES_OPTIONS = [
  "WiFi", "Parking", "Laundry", "CCTV",
  "Power Backup", "AC", "Gym", "Swimming Pool",
];
const INDIAN_STATES = [
  "Maharashtra","Andhra Pradesh","Karnataka","Gujarat"
  
];

interface PropertyForm {
  propertyName: string;
  propertyType: string;
  address:      string;
  city:         string;
  state:        string;
  pincode:      string;
  totalRooms:       number;
  rentPerMonth:     number;
  securityDeposit:  number;
  rentIncludes:     string;
  facilities:   string[];
  checkInTime:  string;
  checkOutTime: string;
  description:  string;
  imageUrl:     string;
  cancellationPolicy: string;
  depositPolicy:      string;
  houseRules:         string;
}

const pill = {
  "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafafa" },
  "& .MuiOutlinedInput-notchedOutline": { border: "1.5px solid #e0e0e0" },
};

const multiline = {
  "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafafa" },
  "& .MuiOutlinedInput-notchedOutline": { border: "1.5px solid #e0e0e0" },
};

const AddProperty = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep]   = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);

  const {
    handleSubmit, control, trigger,
    formState: { errors },
  } = useForm<PropertyForm>({
    mode: "onChange",
    defaultValues: { facilities: [] },
  });

  const stepFields: (keyof PropertyForm)[][] = [
    ["propertyName", "propertyType", "address", "city", "state", "pincode"],
    ["totalRooms", "rentPerMonth", "securityDeposit", "rentIncludes"],
    ["facilities", "checkInTime", "checkOutTime", "description", "imageUrl"],
    ["cancellationPolicy", "depositPolicy", "houseRules"],
  ];

  const handleNext = async () => {
    const valid = await trigger(stepFields[activeStep]);
    if (valid) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const onSubmit = async (data: PropertyForm) => {
    setSubmitError(null);
    setLoading(true);
    try {
      await axiosInstance.post("/properties/owner/add", {
        propertyName:       data.propertyName,
        propertyType:       data.propertyType,
        address:            data.address,
        city:               data.city,
        state:              data.state,
        pincode:            data.pincode,
        totalRooms:         Number(data.totalRooms),
        rentPerMonth:       Number(data.rentPerMonth),
        securityDeposit:    Number(data.securityDeposit),
        rentIncludes:       data.rentIncludes,
        facilities:         data.facilities,
        checkInTime:        data.checkInTime,
        checkOutTime:       data.checkOutTime,
        description:        data.description,
        imageUrl:           data.imageUrl,
        cancellationPolicy: data.cancellationPolicy,
        depositPolicy:      data.depositPolicy,
        houseRules:         data.houseRules,
      });
      navigate("/owner/dashboard");
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Failed to add property. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", py: 6 }}>
      <Paper elevation={3} sx={{ p: 5, width: "100%", maxWidth: 600, borderRadius: 5 }}>

        <Typography variant="h5" align="center" fontWeight={700} gutterBottom>Add Property</Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Fill in the details step by step
        </Typography>

        {/* ── Stepper ── */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel sx={{
                "& .MuiStepLabel-label": { fontSize: "0.75rem" },
                "& .MuiStepIcon-root.Mui-active":    { color: "#e53e3e" },
                "& .MuiStepIcon-root.Mui-completed": { color: "#e53e3e" },
              }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {submitError && <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>{submitError}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

          {/*  STEP 1 — Basic Info */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Basic Information</Typography>

              {/* Property Name */}
              <Controller name="propertyName" control={control} defaultValue=""
                rules={{ required: "Property name is required", minLength: { value: 3, message: "Minimum 3 characters" }, maxLength: { value: 100, message: "Maximum 100 characters" } }}
                render={({ field }) => (
                  <TextField {...field} placeholder="Property Name" fullWidth margin="normal"
                    error={!!errors.propertyName} helperText={errors.propertyName?.message} sx={pill} />
                )}
              />

              {/* Property Type */}
              <Controller name="propertyType" control={control} defaultValue=""
                rules={{ required: "Property type is required" }}
                render={({ field }) => (
                  <TextField {...field} select label="Property Type" fullWidth margin="normal"
                    error={!!errors.propertyType} helperText={errors.propertyType?.message} sx={pill}>
                    {PROPERTY_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>
                )}
              />

              {/* Address */}
              <Controller name="address" control={control} defaultValue=""
                rules={{ required: "Address is required" }}
                render={({ field }) => (
                  <TextField {...field} placeholder="Address" fullWidth margin="normal"
                    error={!!errors.address} helperText={errors.address?.message} sx={pill} />
                )}
              />

              {/* City (dropdown)  */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Controller name="city" control={control} defaultValue=""
                  rules={{ required: "City is required" }}
                  render={({ field }) => (
                    <TextField {...field} select label="City" fullWidth margin="normal"
                      error={!!errors.city} helperText={errors.city?.message} sx={pill}>
                      {INDIAN_CITIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>
                  )}
                />

               <Controller
  name="state"
  control={control}
  defaultValue=""
  rules={{ required: "State is required" }}
  render={({ field }) => (
    <TextField
      {...field}
      select
      label="State"
      fullWidth
      margin="normal"
      error={!!errors.state}
      helperText={errors.state?.message}
      sx={pill}
    >
      {INDIAN_STATES.map((state) => (
        <MenuItem key={state} value={state}>
          {state}
        </MenuItem>
      ))}
    </TextField>
  )}
/>
{/*                 
                <Controller name="state" control={control} defaultValue=""
                  rules={{ required: "State is required", pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters allowed" } }}
                  render={({ field }) => (
                    <TextField {...field} placeholder="State" fullWidth margin="normal"
                      error={!!errors.state} helperText={errors.state?.message} sx={pill} />
                  )}
                /> */}
              </Box>

              {/* Pincode */}
              <Controller name="pincode" control={control} defaultValue=""
                rules={{ required: "Pincode is required", pattern: { value: /^\d{6}$/, message: "Pincode must be exactly 6 digits" } }}
                render={({ field }) => (
                  <TextField {...field} placeholder="Pincode" fullWidth margin="normal"
                    error={!!errors.pincode} helperText={errors.pincode?.message} sx={pill} />
                )}
              />
            </Box>
          )}

          {/* Unit & Pricing */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Unit and Pricing</Typography>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Controller name="totalRooms" control={control}
                  rules={{ required: "Total rooms is required", min: { value: 1, message: "Must be greater than 0" }, pattern: { value: /^[0-9]+$/, message: "Only numbers allowed" } }}
                  render={({ field }) => (
                    <TextField {...field} placeholder="Total Rooms" type="number" fullWidth margin="normal"
                      error={!!errors.totalRooms} helperText={errors.totalRooms?.message} sx={pill} />
                  )}
                />
                <Controller name="rentPerMonth" control={control}
                  rules={{ required: "Rent is required", min: { value: 1, message: "Must be greater than 0" } }}
                  render={({ field }) => (
                    <TextField {...field} placeholder="Rent Per Month" type="number" fullWidth margin="normal"
                      error={!!errors.rentPerMonth} helperText={errors.rentPerMonth?.message} sx={pill} />
                  )}
                />
              </Box>

              <Controller name="securityDeposit" control={control}
                rules={{ required: "Security deposit is required", min: { value: 1, message: "Must be greater than 0" } }}
                render={({ field }) => (
                  <TextField {...field} placeholder="Security Deposit" type="number" fullWidth margin="normal"
                    error={!!errors.securityDeposit} helperText={errors.securityDeposit?.message} sx={pill} />
                )}
              />

              <Controller name="rentIncludes" control={control} defaultValue=""
                rules={{ required: "Please specify what rent includes" }}
                render={({ field }) => (
                  <TextField {...field} placeholder="Rent Includes (e.g. WiFi, Water, Electricity)" fullWidth margin="normal"
                    error={!!errors.rentIncludes} helperText={errors.rentIncludes?.message ?? "Comma separated list"} sx={pill} />
                )}
              />
            </Box>
          )}

          {/*  3 Amenities & Timings  */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Amenities and Timings</Typography>

              {/* facilities checkboxes */}
              <Controller name="facilities" control={control} defaultValue={[]}
                rules={{ validate: (val) => (val && val.length > 0) || "Select at least one facility" }}
                render={({ field }) => (
                  <FormControl error={!!errors.facilities} sx={{ mb: 2, width: "100%" }}>
                    <FormLabel sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>Facilities</FormLabel>
                    <FormGroup row>
                      {FACILITIES_OPTIONS.map((facility) => (
                        <FormControlLabel key={facility} label={facility} sx={{ width: "45%" }}
                          control={
                            <Checkbox
                              checked={field.value?.includes(facility)}
                              onChange={(e) => {
                                const current = field.value || [];
                                field.onChange(
                                  e.target.checked
                                    ? [...current, facility]
                                    : current.filter((f: string) => f !== facility)
                                );
                              }}
                              sx={{ color: "#e53e3e", "&.Mui-checked": { color: "#e53e3e" } }}
                            />
                          }
                        />
                      ))}
                    </FormGroup>
                    {errors.facilities && <FormHelperText>{errors.facilities.message}</FormHelperText>}
                  </FormControl>
                )}
              />

              {/* Check-in + Check-out clock pickers */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Controller name="checkInTime" control={control} defaultValue=""
                  rules={{ required: "Check-in time is required" }}
                  render={({ field }) => (
                    <TextField {...field} label="Check-in Time" type="time" fullWidth margin="normal"
                      error={!!errors.checkInTime} helperText={errors.checkInTime?.message}
                      InputLabelProps={{ shrink: true }} inputProps={{ step: 300 }} sx={pill} />
                  )}
                />
                <Controller name="checkOutTime" control={control} defaultValue=""
                  rules={{ required: "Check-out time is required" }}
                  render={({ field }) => (
                    <TextField {...field} label="Check-out Time" type="time" fullWidth margin="normal"
                      error={!!errors.checkOutTime} helperText={errors.checkOutTime?.message}
                      InputLabelProps={{ shrink: true }} inputProps={{ step: 300 }} sx={pill} />
                  )}
                />
              </Box>

              {/* Description */}
              <Controller name="description" control={control} defaultValue=""
                rules={{ required: "Description is required", minLength: { value: 10, message: "Minimum 10 characters" } }}
                render={({ field }) => (
                  <TextField {...field} placeholder="Description" fullWidth margin="normal" multiline rows={3}
                    error={!!errors.description} helperText={errors.description?.message} sx={multiline} />
                )}
              />

              {/* Image URL */}
              <Controller name="imageUrl" control={control} defaultValue=""
                rules={{ required: "Image URL is required", pattern: { value: /^https?:\/\/.+/, message: "Must start with http or https" } }}
                render={({ field }) => (
                  <TextField {...field} placeholder="Image URL (https://...)" fullWidth margin="normal"
                    error={!!errors.imageUrl} helperText={errors.imageUrl?.message} sx={pill} />
                )}
              />
            </Box>
          )}

          {/*  4 — Policies */}
          {activeStep === 3 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Policies</Typography>

              <Controller name="cancellationPolicy" control={control} defaultValue=""
                rules={{ required: "Cancellation policy is required", minLength: { value: 10, message: "Minimum 10 characters" } }}
                render={({ field }) => (
                  <TextField {...field} placeholder="Cancellation Policy" fullWidth margin="normal" multiline rows={2}
                    error={!!errors.cancellationPolicy} helperText={errors.cancellationPolicy?.message} sx={multiline} />
                )}
              />

              <Controller name="depositPolicy" control={control} defaultValue=""
                rules={{ required: "Deposit policy is required", minLength: { value: 10, message: "Minimum 10 characters" } }}
                render={({ field }) => (
                  <TextField {...field} placeholder="Deposit Policy" fullWidth margin="normal" multiline rows={2}
                    error={!!errors.depositPolicy} helperText={errors.depositPolicy?.message} sx={multiline} />
                )}
              />

              <Controller name="houseRules" control={control} defaultValue=""
                rules={{ required: "House rules are required", minLength: { value: 10, message: "Minimum 10 characters" } }}
                render={({ field }) => (
                  <TextField {...field} placeholder="House Rules" fullWidth margin="normal" multiline rows={2}
                    error={!!errors.houseRules} helperText={errors.houseRules?.message} sx={multiline} />
                )}
              />
            </Box>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, gap: 2 }}>
            {activeStep > 0 && (
              <Button onClick={handleBack} variant="outlined" sx={{
                flex: 1, py: 1.4, borderRadius: "50px",
                borderColor: "#e53e3e", color: "#e53e3e", fontWeight: 700,
                "&:hover": { borderColor: "#c53030", color: "#c53030", bgcolor: "transparent" },
              }}>
                Back
              </Button>
            )}

            {activeStep < STEPS.length - 1 ? (
              <Button onClick={handleNext} variant="contained" sx={{
                flex: 1, py: 1.4, borderRadius: "50px", bgcolor: "#e53e3e",
                fontWeight: 700, letterSpacing: 1, boxShadow: "0 4px 15px rgba(229,62,62,0.4)",
                "&:hover": { bgcolor: "#c53030" },
              }}>
                NEXT
              </Button>
            ) : (
              <Button type="submit" variant="contained" disabled={loading} sx={{
                flex: 1, py: 1.4, borderRadius: "50px", bgcolor: "#e53e3e",
                fontWeight: 700, letterSpacing: 1, boxShadow: "0 4px 15px rgba(229,62,62,0.4)",
                "&:hover": { bgcolor: "#c53030" },
              }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "SUBMIT"}
              </Button>
            )}
          </Box>

        </Box>
      </Paper>
    </Box>
  );
};

export default AddProperty;