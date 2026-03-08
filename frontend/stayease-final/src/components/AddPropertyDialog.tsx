import React, { useState } from "react";
import {
Dialog,
DialogTitle,
DialogContent,
Box,
Grid,
TextField,
Button,
FormControl,
InputLabel,
Select,
MenuItem,
Chip,
Typography
} from "@mui/material";

interface Props {
open: boolean;
onClose: () => void;
ownerId: string;
onPropertyAdded: (property: any) => void;
}

const facilitiesList = [
"WiFi",
"Parking",
"Security",
"Laundry",
"AC",
"Food",
"Power Backup"
];

const AddPropertyDialog: React.FC<Props> = ({
open,
onClose,
ownerId,
onPropertyAdded
}) => {

const [uploadedImages, setUploadedImages] = useState<string[]>([]);

const [formData, setFormData] = useState({
propertyName: "",
propertyType: "",
location: "",
address: "",
city: "",
state: "",
totalRooms: "",
rentPerMonth: "",
rentPerDay: "",
genderSpecific: "",
furnishing: "",
facilities: [] as string[],
description: ""
});

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

const files = e.target.files;

if (!files) return;

Array.from(files).forEach(file => {

const reader = new FileReader();

reader.onloadend = () => {
setUploadedImages(prev => [...prev, reader.result as string]);
};

reader.readAsDataURL(file);

});

};
const removeImage = (index: number) => {
  setUploadedImages((prev) => prev.filter((_, i) => i !== index));
};

const toggleFacility = (facility: string) => {

if (formData.facilities.includes(facility)) {

setFormData({
...formData,
facilities: formData.facilities.filter(f => f !== facility)
});

} else {

setFormData({
...formData,
facilities: [...formData.facilities, facility]
});

}

};

const handleAddProperty = (e: React.FormEvent) => {

e.preventDefault();

const newProperty = {

propertyId: crypto.randomUUID(),

ownerId,

propertyName: formData.propertyName,

propertyType: formData.propertyType,

location: formData.location,

address: formData.address,

city: formData.city,

state: formData.state,

totalRooms: Number(formData.totalRooms),

availableRooms: Number(formData.totalRooms),

rentPerMonth: formData.rentPerMonth
? Number(formData.rentPerMonth)
: undefined,

rentPerDay: formData.rentPerDay
? Number(formData.rentPerDay)
: undefined,

genderSpecific: formData.genderSpecific,

furnishing: formData.furnishing,

facilities: formData.facilities,

description: formData.description,

images:
uploadedImages.length > 0
? uploadedImages
: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]

};

const stored = JSON.parse(localStorage.getItem("properties") || "[]");

const updated = [...stored, newProperty];

localStorage.setItem("properties", JSON.stringify(updated));

onPropertyAdded(newProperty);

onClose();

};

return (

<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>

<DialogTitle>Add New Property</DialogTitle>

<DialogContent>

<Box component="form" onSubmit={handleAddProperty} sx={{ mt: 2 }}>

<Grid container spacing={2}>

<Grid item xs={12}>
<TextField
fullWidth
label="Property Name"
required
value={formData.propertyName}
onChange={(e) =>
setFormData({ ...formData, propertyName: e.target.value })
}
/>
</Grid>

<Grid item xs={12}>
<FormControl fullWidth>
<InputLabel>Property Type</InputLabel>
<Select
value={formData.propertyType}
label="Property Type"
onChange={(e) =>
setFormData({ ...formData, propertyType: e.target.value })
}
>
<MenuItem value="PG">PG</MenuItem>
<MenuItem value="Hostel">Hotel</MenuItem>
<MenuItem value="Apartment">Apartment</MenuItem>
</Select>
</FormControl>
</Grid>

<Grid item xs={12}>
<TextField
fullWidth
label="Location"
value={formData.location}
onChange={(e) =>
setFormData({ ...formData, location: e.target.value })
}
/>
</Grid>

<Grid item xs={12}>
<TextField
fullWidth
label="Address"
value={formData.address}
onChange={(e) =>
setFormData({ ...formData, address: e.target.value })
}
/>
</Grid>

<Grid item xs={6}>
<TextField
fullWidth
label="City"
value={formData.city}
onChange={(e) =>
setFormData({ ...formData, city: e.target.value })
}
/>
</Grid>

<Grid item xs={6}>
<TextField
fullWidth
label="State"
value={formData.state}
onChange={(e) =>
setFormData({ ...formData, state: e.target.value })
}
/>
</Grid>

<Grid item xs={4}>
<TextField
fullWidth
type="number"
label="Total Rooms"
required
value={formData.totalRooms}
onChange={(e) =>
setFormData({ ...formData, totalRooms: e.target.value })
}
/>
</Grid>

<Grid item xs={4}>
<TextField
fullWidth
type="number"
label="Rent / Month"
value={formData.rentPerMonth}
onChange={(e) =>
setFormData({ ...formData, rentPerMonth: e.target.value })
}
/>
</Grid>

<Grid item xs={4}>
<TextField
fullWidth
type="number"
label="Rent / Day"
value={formData.rentPerDay}
onChange={(e) =>
setFormData({ ...formData, rentPerDay: e.target.value })
}
/>
</Grid>

<Grid item xs={6}>
<FormControl fullWidth>
<InputLabel>Gender Preference</InputLabel>
<Select
value={formData.genderSpecific}
label="Gender Preference"
onChange={(e) =>
setFormData({ ...formData, genderSpecific: e.target.value })
}
>
<MenuItem value="All">All</MenuItem>
<MenuItem value="Male">Male</MenuItem>
<MenuItem value="Female">Female</MenuItem>
</Select>
</FormControl>
</Grid>

<Grid item xs={6}>
<FormControl fullWidth>
<InputLabel>Furnishing</InputLabel>
<Select
value={formData.furnishing}
label="Furnishing"
onChange={(e) =>
setFormData({ ...formData, furnishing: e.target.value })
}
>
<MenuItem value="Fully Furnished">Fully Furnished</MenuItem>
<MenuItem value="Semi-Furnished">Semi-Furnished</MenuItem>
<MenuItem value="Unfurnished">Unfurnished</MenuItem>
</Select>
</FormControl>
</Grid>

<Grid item xs={12}>
<Typography sx={{ mb: 1 }}>Facilities</Typography>

<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
{facilitiesList.map((facility) => (
<Chip
key={facility}
label={facility}
clickable
color={
formData.facilities.includes(facility)
? "primary"
: "default"
}
onClick={() => toggleFacility(facility)}
/>
))} </Box> </Grid>

<Grid item xs={12}>
<Button variant="outlined" component="label" fullWidth>
Upload Property Images
<input
type="file"
hidden
multiple
accept="image/*"
onChange={handleImageUpload}
/>
</Button>

{/* Image Preview */}
{uploadedImages.length > 0 && (
<Box
sx={{
display: "flex",
gap: 2,
flexWrap: "wrap",
mt: 2
}}
>
{uploadedImages.map((img, index) => (
<Box
key={index}
sx={{
position: "relative",
width: 120,
height: 120,
borderRadius: 2,
overflow: "hidden",
border: "1px solid #ddd"
}}
>
<img
src={img}
alt="preview"
style={{
width: "100%",
height: "100%",
objectFit: "cover"
}}
/>

{/* Delete Button */}
<Box
onClick={() => removeImage(index)}
sx={{
position: "absolute",
top: 5,
right: 5,
background: "#e53e3e",
color: "white",
width: 24,
height: 24,
borderRadius: "50%",
display: "flex",
alignItems: "center",
justifyContent: "center",
cursor: "pointer",
fontSize: 14,
fontWeight: "bold"
}}
>
×
</Box>

</Box>
))}
</Box>
)}
</Grid>

</Grid>

<Box sx={{ mt: 3, display: "flex", gap: 2 }}> <Button fullWidth variant="outlined" onClick={onClose}>
Cancel </Button>

<Button fullWidth type="submit" variant="contained">
Save Property
</Button>
</Box>

</Box>

</DialogContent>

</Dialog>

);

};

export default AddPropertyDialog;
