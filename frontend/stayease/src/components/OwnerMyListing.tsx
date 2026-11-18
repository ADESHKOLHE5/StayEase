import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Chip,
  Paper,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import BathtubIcon from "@mui/icons-material/Bathtub";
import KingBedIcon from "@mui/icons-material/KingBed";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import KitchenIcon from "@mui/icons-material/Kitchen";

import DescriptionIcon from "@mui/icons-material/Description";

const OwnerMyListing = () => {
  const { data: properties, loading, error } = useFetch("/properties/owner/my");
  const navigate = useNavigate();

  const handleEdit = (propertyId: string) => {
    navigate(`/owner/update/property/${propertyId}`);
  };


  // 1. Loading → spinner
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress sx={{ color: "#e53e3e" }} />
      </Box>
    );
  }

  // 2. Real server/network error → friendly message
  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 6, textAlign: "center", borderRadius: 4, border: "1.5px dashed #fecaca", bgcolor: "#fff5f5" }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ color: "#991b1b", mb: 1 }}>
          We're currently having a technical issue.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please try again later.
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ bgcolor: "#e53e3e", fontWeight: 600, borderRadius: "10px", px: 4, boxShadow: "none", "&:hover": { bgcolor: "#c53030" } }}
        >
          Retry
        </Button>
      </Paper>
    );
  }

  // 3. data is null (404 / not-yet-hydrated) → no flash
  if (properties === null) return null;

  // 4. Empty array → empty state
  if (Array.isArray(properties) && properties.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 6, textAlign: "center", borderRadius: 4, border: "1.5px dashed #e0e0e0", bgcolor: "#fafafa" }}
      >
        <HomeWorkIcon sx={{ fontSize: 48, color: "#d1d5db", mb: 2 }} />
        <Typography variant="h6" fontWeight={600} color="text.secondary">
          No properties listed yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Click "Add Property" to get started.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#111827" }}>
        🏢 My Listings ({properties.length})
      </Typography>

      <Grid container spacing={3}>
        {properties.map((property: any, index: number) => {
          // Determine availability status
          const isAvailable = property.availableRooms > 0;
          const statusColor = isAvailable ? "#2e7d32" : "#d32f2f";
          const statusText = isAvailable ? "Available" : "Fully Occupied";
          const StatusIcon = isAvailable ? CheckCircleIcon : CancelIcon;

          // Safely access optional fields
          const rawName = property.propertyName;
          const rawImage = property.imageUrl;

          // Detect if propertyName and imageUrl are swapped (backend bug)
          const isNameActuallyUrl = typeof rawName === 'string' && (rawName.startsWith('http://') || rawName.startsWith('https://'));
          const propertyName = isNameActuallyUrl ? (rawImage || 'Unnamed Property') : rawName;
          const imageUrl = isNameActuallyUrl ? rawName : rawImage;

          const {
            address,
            city,
            rentPerMonth,
            availableRooms,
            totalRooms,
            propertyType,
            bedrooms,
            bathrooms,
            area,
            description,
            furnished,
            amenities = [],
          } = property;

          return (
            <Grid size={12} key={property.propertyId || index}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "stretch",
                  p: 2.5,
                  borderRadius: 4,
                  border: "1.5px solid #e5e7eb",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    borderColor: "#fecaca",
                    boxShadow: "0 8px 24px rgba(229,62,62,0.12)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {/* Image */}
                <CardMedia
                  component="img"
                  image={
                    imageUrl ||
                    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=300&q=80"
                  }
                  alt={propertyName}
                  sx={{
                    width: { xs: "100%", sm: 200 },
                    height: { xs: 160, sm: 140 },
                    borderRadius: 3,
                    objectFit: "cover",
                    mr: { sm: 3 },
                    mb: { xs: 2, sm: 0 },
                  }}
                />

                {/* Content */}
                <CardContent sx={{ flex: 1, p: 0, "&:last-child": { pb: 0 } }}>
                  {/* Title row with property type and status */}
                  <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 1 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ color: "#111827" }}>
                      {propertyName}
                    </Typography>
                    {propertyType && (
                      <Chip
                        label={propertyType}
                        size="small"
                        sx={{
                          bgcolor: "#fff5f5",
                          color: "#e53e3e",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                        }}
                      />
                    )}
                    <Chip
                      icon={<StatusIcon sx={{ fontSize: "0.9rem !important" }} />}
                      label={statusText}
                      size="small"
                      sx={{
                        bgcolor: isAvailable ? "#e8f5e8" : "#ffebee",
                        color: statusColor,
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        ml: "auto",
                      }}
                    />
                  </Box>

                  {/* Address with icon */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
                    <LocationOnIcon sx={{ fontSize: 16, color: "#e53e3e" }} />
                    <Typography variant="body2" color="text.secondary">
                      {address}
                      {city ? `, ${city}` : ""}
                    </Typography>
                  </Box>

                  {/* Key stats in a grid */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    {/* Rent */}
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Monthly Rent
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#e53e3e", fontWeight: 700 }}>
                        ₹{rentPerMonth?.toLocaleString("en-IN")}
                      </Typography>
                    </Grid>

                    {/* Available Rooms */}
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Available
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <MeetingRoomIcon sx={{ fontSize: 18, color: "#6b7280" }} />
                        <Typography variant="body1" fontWeight={600}>
                          {availableRooms} / {totalRooms}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Bedrooms (if exists) */}
                    {bedrooms !== undefined && (
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Bedrooms
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <KingBedIcon sx={{ fontSize: 18, color: "#6b7280" }} />
                          <Typography variant="body1" fontWeight={600}>
                            {bedrooms}
                          </Typography>
                        </Box>
                      </Grid>
                    )}

                    {/* Bathrooms (if exists) */}
                    {bathrooms !== undefined && (
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Bathrooms
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <BathtubIcon sx={{ fontSize: 18, color: "#6b7280" }} />
                          <Typography variant="body1" fontWeight={600}>
                            {bathrooms}
                          </Typography>
                        </Box>
                      </Grid>
                    )}

                    {/* Area (if exists) */}
                    {area !== undefined && (
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Area
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <SquareFootIcon sx={{ fontSize: 18, color: "#6b7280" }} />
                          <Typography variant="body1" fontWeight={600}>
                            {area} sqft
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                  {/* Description snippet (if exists) */}
                  {description && (
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, mb: 1.5 }}>
                      <DescriptionIcon sx={{ fontSize: 18, color: "#9ca3af", mt: 0.3 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        {description.length > 100
                          ? `${description.substring(0, 100)}...`
                          : description}
                      </Typography>
                    </Box>
                  )}

                  {/* Furnished status & Amenities chips */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                    {furnished !== undefined && (
                      <Chip
                        icon={furnished ? <KitchenIcon /> : <CancelIcon />}
                        label={furnished ? "Furnished" : "Unfurnished"}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: "#e0e0e0", color: "#4b5563" }}
                      />
                    )}
                    {amenities.slice(0, 3).map((amenity: string, idx: number) => (
                      <Chip
                        key={idx}
                        label={amenity}
                        size="small"
                        sx={{ bgcolor: "#f3f4f6", color: "#374151" }}
                      />
                    ))}
                    {amenities.length > 3 && (
                      <Chip label={`+${amenities.length - 3}`} size="small" sx={{ bgcolor: "#f3f4f6" }} />
                    )}
                  </Box>
                </CardContent>

                {/* Actions */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "row", sm: "column" },
                    justifyContent: { xs: "flex-end", sm: "center" },
                    gap: 1.5,
                    ml: { sm: 2 },
                    mt: { xs: 2, sm: 0 },
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(property.propertyId)}
                    sx={{
                      borderColor: "#e53e3e",
                      color: "#e53e3e",
                      fontWeight: 600,
                      borderRadius: "10px",
                      px: 2.5,
                      "&:hover": {
                        bgcolor: "#fff5f5",
                        borderColor: "#c53030",
                      },
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default OwnerMyListing;