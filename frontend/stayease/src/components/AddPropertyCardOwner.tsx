import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";

const PropertyCard = ({ property, onEdit }) => {

  return (
    <Card
      sx={{
        display: "flex",
        borderRadius: 4,
        p: 2,
        boxShadow: 2,
        alignItems: "center"
      }}
    >

      {/* Image */}
      <CardMedia
        component="img"
        image={
          property.imageUrl ||
          "https://images.unsplash.com/photo-1560185127-6ed189bf02f4"
        }
        sx={{
          width: 160,
          height: 120,
          borderRadius: 3,
          objectFit: "cover",
          mr: 3
        }}
      />

      {/* Content */}
      <CardContent sx={{ flex: 1 }}>

        <Typography fontWeight="bold" variant="h6">
          {property.propertyName}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
          <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {property.address}
          </Typography>
        </Box>

        <Chip
          label={property.propertyType}
          size="small"
          sx={{ mt: 1 }}
        />

        {/* Stats */}
        <Box sx={{ display: "flex", gap: 6, mt: 2 }}>

          <Box>
            <Typography variant="caption">
              RENT
            </Typography>

            <Typography sx={{ color: "#d32f2f", fontWeight: "bold" }}>
              ₹{property.rentPerMonth}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption">
              AVAILABLE
            </Typography>

            <Typography>
              {property.availableRooms}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption">
              TOTAL
            </Typography>

            <Typography>
              {property.totalRooms}
            </Typography>
          </Box>

        </Box>

      </CardContent>

      {/* Action */}
      <Button
        startIcon={<EditIcon />}
        variant="outlined"
        size="small"
        onClick={() => onEdit(property)}
      >
        Edit
      </Button>

    </Card>
  );
};

export default PropertyCard;