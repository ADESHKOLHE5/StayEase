import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
Box,
Container,
Typography,
Button,
Grid,
Paper
} from "@mui/material";
import {
Add as AddIcon,
Home as HomeIcon,
TrendingUp,
Assessment
} from "@mui/icons-material";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AddPropertyDialog from "../components/AddPropertyDialog";

interface Property {
propertyId: string;
ownerId: string;
propertyName: string;
propertyType: string;
location: string;
address: string;
city: string;
state: string;
totalRooms: number;
availableRooms: number;
rentPerMonth?: number;
rentPerDay?: number;
genderSpecific?: string;
furnishing?: string;
facilities: string[];
images: string[];
description: string;
}

const OwnerDashboard: React.FC = () => {
const navigate = useNavigate();

const [showAddModal, setShowAddModal] = useState(false);

const [properties, setProperties] = useState<Property[]>([]);

const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

useEffect(() => {
const stored = JSON.parse(localStorage.getItem("properties") || "[]");
setProperties(stored);
}, []);

const ownerProperties = useMemo(
() => properties.filter((p) => p.ownerId === currentUser?.userId),
[properties, currentUser]
);

const stats = useMemo(() => {
const totalProperties = ownerProperties.length;


const totalRooms = ownerProperties.reduce(
  (sum, p) => sum + p.totalRooms,
  0
);

const bookedRooms = ownerProperties.reduce(
  (sum, p) => sum + (p.totalRooms - p.availableRooms),
  0
);

const occupancyRate =
  totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0;

return {
  totalProperties,
  totalRooms,
  bookedRooms,
  occupancyRate
};

}, [ownerProperties]);

return (
<Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}> <Header />

```
  <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" fontWeight={700}>
        StayEase Manager
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Welcome back, Owner
      </Typography>
    </Box>

    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="overline">
            TOTAL PROPERTIES
          </Typography>

          <Typography variant="h3">
            {stats.totalProperties}
          </Typography>

          <HomeIcon />
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="overline">
            OCCUPANCY RATE
          </Typography>

          <Typography variant="h3">
            {stats.occupancyRate}%
          </Typography>

          <TrendingUp />
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="overline">
            TOTAL ROOMS
          </Typography>

          <Typography variant="h3">
            {stats.totalRooms}
          </Typography>

          <Assessment />
        </Paper>
      </Grid>
    </Grid>

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 3
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        My Properties
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setShowAddModal(true)}
        sx={{ bgcolor: "#e53e3e" }}
      >
        Add Property
      </Button>
    </Box>

    {ownerProperties.length === 0 ? (
      <Paper sx={{ p: 6, textAlign: "center" }}>
        <Typography>No properties added yet</Typography>
      </Paper>
    ) : (
      <Grid container spacing={3}>
        {ownerProperties.map((property) => (
          <Grid item xs={12} md={4} key={property.propertyId}>
            <Paper sx={{ p: 2 }}>
              <img
                src={property.images[0]}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover"
                }}
              />

              <Typography fontWeight={600}>
                {property.propertyName}
              </Typography>

              <Typography color="text.secondary">
                {property.city}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    )}
  </Container>

  <AddPropertyDialog
  open={showAddModal}
  onClose={() => setShowAddModal(false)}
  ownerId={currentUser?.userId}
  onPropertyAdded={(property) => {
    const stored = JSON.parse(localStorage.getItem("properties") || "[]");
    const updated = [...stored, property];

    localStorage.setItem("properties", JSON.stringify(updated));

    setProperties(updated);
  }}
/>

<Footer />
</Box>
);
};

export default OwnerDashboard;