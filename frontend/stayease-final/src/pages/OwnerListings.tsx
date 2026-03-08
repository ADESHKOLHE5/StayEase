import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper, Grid, Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Info as InfoIcon, Upload as UploadIcon, Close as CloseIcon } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useStore } from '../store';
import { Property } from '../types';

const OwnerListings: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, properties, updateProperty, addProperty } = useStore();
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [viewProperty, setViewProperty] = useState<Property | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [addFormData, setAddFormData] = useState({
    propertyName: '',
    propertyType: '',
    location: '',
    address: '',
    city: '',
    state: '',
    totalRooms: '',
    rentPerMonth: '',
    rentPerDay: '',
    genderSpecific: '',
    furnishing: '',
    facilities: 'WiFi, Security',
    description: '',
  });

  const ownerProperties = properties.filter(p => p.ownerId === currentUser?.userId);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit && editProperty) {
          setEditProperty({ ...editProperty, images: [...editProperty.images, reader.result as string] });
        } else {
          newImages.push(reader.result as string);
          setUploadedImages(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number, isEdit: boolean = false) => {
    if (isEdit && editProperty) {
      setEditProperty({ ...editProperty, images: editProperty.images.filter((_, i) => i !== index) });
    } else {
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProperty) return;
    updateProperty(editProperty.propertyId, editProperty);
    setEditProperty(null);
  };

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const facilitiesArray = addFormData.facilities.split(',').map(f => f.trim()).filter(f => f);
    
    const rentPerMonth = addFormData.rentPerMonth ? parseInt(addFormData.rentPerMonth) : undefined;
    const rentPerDay = addFormData.rentPerDay ? parseInt(addFormData.rentPerDay) : undefined;

    addProperty({
      ownerId: currentUser?.userId || '',
      propertyName: addFormData.propertyName,
      propertyType: addFormData.propertyType as any,
      location: addFormData.location,
      address: addFormData.address,
      city: addFormData.city,
      state: addFormData.state,
      totalRooms: parseInt(addFormData.totalRooms),
      rentPerMonth,
      rentPerDay,
      genderSpecific: addFormData.genderSpecific as any,
      furnishing: addFormData.furnishing as any,
      facilities: facilitiesArray,
      images: uploadedImages.length > 0 ? uploadedImages : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      description: addFormData.description,
    });

    setShowAddModal(false);
    setUploadedImages([]);
    setAddFormData({
      propertyName: '', propertyType: '', location: '', address: '', city: '', state: '',
      totalRooms: '', rentPerMonth: '', rentPerDay: '', genderSpecific: '',
      furnishing: '', facilities: 'WiFi, Security', description: '',
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>My Listings</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>{ownerProperties.length} active properties</Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Button onClick={() => navigate('/owner/dashboard')} sx={{ mr: 2, pb: 1, color: 'text.secondary' }}>
            Booking Requests
          </Button>
          <Button sx={{ pb: 1, borderBottom: 2, borderColor: '#e53e3e', color: '#e53e3e', fontWeight: 600 }}>
            My Listings
          </Button>
        </Box>

        {ownerProperties.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
            {ownerProperties.map(property => (
              <Paper key={property.propertyId} elevation={0} sx={{ overflow: 'hidden', border: 1, borderColor: 'grey.200' }}>
                <Grid container>
                  <Grid item xs={12} md={3}>
                    <Box component="img" src={property.images[0]} alt={property.propertyName} sx={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 200 }} />
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Box sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box>
                          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>{property.propertyName}</Typography>
                          <Typography variant="body2" color="text.secondary">{property.location}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={() => setEditProperty(property)}>
                            Edit
                          </Button>
                          <Button variant="outlined" size="small" startIcon={<InfoIcon />} onClick={() => setViewProperty(property)}>
                            Details
                          </Button>
                        </Box>
                      </Box>

                      <Grid container spacing={4}>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">RENT</Typography>
                          {property.rentPerMonth && property.rentPerMonth > 0 ? (
                            <Typography variant="h6" fontWeight={700} color="primary">
                              ₹{property.rentPerMonth.toLocaleString('en-IN')}/mo
                            </Typography>
                          ) : null}
                          {property.rentPerDay && property.rentPerDay > 0 ? (
                            <Typography variant="h6" fontWeight={700} color="primary">
                              ₹{property.rentPerDay.toLocaleString('en-IN')}/day
                            </Typography>
                          ) : null}
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">AVAILABLE</Typography>
                          <Typography variant="h6" fontWeight={700}>{property.availableRooms} Units</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">TOTAL ROOMS</Typography>
                          <Typography variant="h6" fontWeight={700}>{property.totalRooms}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        )}

        {/* Plus Button to Add Property */}
        <Paper 
          elevation={0} 
          onClick={() => setShowAddModal(true)}
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            border: 2, 
            borderStyle: 'dashed', 
            borderColor: 'grey.300',
            cursor: 'pointer',
            transition: 'all 0.3s',
            '&:hover': {
              borderColor: '#e53e3e',
              bgcolor: '#fff5f5'
            }
          }}
        >
          <IconButton sx={{ width: 64, height: 64, bgcolor: '#fee', color: '#e53e3e', mb: 2, '&:hover': { bgcolor: '#fee' } }}>
            <AddIcon sx={{ fontSize: 32 }} />
          </IconButton>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>List another property</Typography>
          <Typography variant="body2" color="text.secondary">Expand your portfolio and reach more tenants</Typography>
        </Paper>
      </Container>

      {/* Edit Dialog */}
      <Dialog open={!!editProperty} onClose={() => setEditProperty(null)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Property</DialogTitle>
        <DialogContent>
          {editProperty && (
            <Box component="form" onSubmit={handleSaveEdit} sx={{ mt: 2 }}>
              <TextField fullWidth label="Property Name" value={editProperty.propertyName} onChange={(e) => setEditProperty({ ...editProperty, propertyName: e.target.value })} sx={{ mb: 2 }} />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Property Type</InputLabel>
                <Select value={editProperty.propertyType} onChange={(e: any) => setEditProperty({ ...editProperty, propertyType: e.target.value })}>
                  <MenuItem value="PG">PG</MenuItem>
                  <MenuItem value="Hostel">Hostel</MenuItem>
                  <MenuItem value="Apartment">Apartment</MenuItem>
                </Select>
              </FormControl>

              <TextField fullWidth label="Location" value={editProperty.location} onChange={(e) => setEditProperty({ ...editProperty, location: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth label="Address" value={editProperty.address} onChange={(e) => setEditProperty({ ...editProperty, address: e.target.value })} sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField fullWidth label="City" value={editProperty.city} onChange={(e) => setEditProperty({ ...editProperty, city: e.target.value })} />
                <TextField fullWidth label="State" value={editProperty.state} onChange={(e) => setEditProperty({ ...editProperty, state: e.target.value })} />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField fullWidth type="number" label="Total Rooms" value={editProperty.totalRooms} onChange={(e) => setEditProperty({ ...editProperty, totalRooms: parseInt(e.target.value) })} />
                <TextField fullWidth type="number" label="Rent/Month" value={editProperty.rentPerMonth || ''} onChange={(e) => setEditProperty({ ...editProperty, rentPerMonth: e.target.value ? parseInt(e.target.value) : undefined })} />
                <TextField fullWidth type="number" label="Rent/Day" value={editProperty.rentPerDay || ''} onChange={(e) => setEditProperty({ ...editProperty, rentPerDay: e.target.value ? parseInt(e.target.value) : undefined })} />
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Gender Specific</InputLabel>
                <Select value={editProperty.genderSpecific} onChange={(e: any) => setEditProperty({ ...editProperty, genderSpecific: e.target.value })}>
                  <MenuItem value="Any">Any</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Co-living">Co-living</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Furnishing</InputLabel>
                <Select value={editProperty.furnishing} onChange={(e: any) => setEditProperty({ ...editProperty, furnishing: e.target.value })}>
                  <MenuItem value="Fully Furnished">Fully Furnished</MenuItem>
                  <MenuItem value="Semi-Furnished">Semi-Furnished</MenuItem>
                  <MenuItem value="Unfurnished">Unfurnished</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mb: 2 }}>
                <Button variant="outlined" component="label" startIcon={<UploadIcon />} fullWidth>
                  Add More Images
                  <input type="file" hidden multiple accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                </Button>
                {editProperty.images.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                    {editProperty.images.map((img, idx) => (
                      <Box key={idx} sx={{ position: 'relative', width: 100, height: 100 }}>
                        <img src={img} alt={`Property ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                        <IconButton size="small" onClick={() => removeImage(idx, true)} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <TextField fullWidth label="Facilities" value={editProperty.facilities.join(', ')} onChange={(e) => setEditProperty({ ...editProperty, facilities: e.target.value.split(',').map(f => f.trim()) })} sx={{ mb: 2 }} />
              <TextField fullWidth multiline rows={3} label="Description" value={editProperty.description} onChange={(e) => setEditProperty({ ...editProperty, description: e.target.value })} sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button fullWidth variant="outlined" onClick={() => setEditProperty(null)}>Cancel</Button>
                <Button fullWidth type="submit" variant="contained" sx={{ bgcolor: '#e53e3e', '&:hover': { bgcolor: '#c53030' } }}>Save Changes</Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Property Dialog */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Property</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleAddProperty} sx={{ mt: 2 }}>
            <TextField fullWidth label="Property Name" placeholder="Enter property name" value={addFormData.propertyName} onChange={(e) => setAddFormData({ ...addFormData, propertyName: e.target.value })} required sx={{ mb: 2 }} />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Property Type</InputLabel>
              <Select value={addFormData.propertyType} onChange={(e: any) => setAddFormData({ ...addFormData, propertyType: e.target.value })} required displayEmpty>
                <MenuItem value="" disabled>Select Property Type</MenuItem>
                <MenuItem value="PG">PG</MenuItem>
                <MenuItem value="Hostel">Hostel</MenuItem>
                <MenuItem value="Apartment">Apartment</MenuItem>
              </Select>
            </FormControl>

            <TextField fullWidth label="Location" placeholder="e.g., Andheri West, Mumbai" value={addFormData.location} onChange={(e) => setAddFormData({ ...addFormData, location: e.target.value })} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Address" placeholder="Complete address" value={addFormData.address} onChange={(e) => setAddFormData({ ...addFormData, address: e.target.value })} required sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField fullWidth label="City" placeholder="City" value={addFormData.city} onChange={(e) => setAddFormData({ ...addFormData, city: e.target.value })} required />
              <TextField fullWidth label="State" placeholder="State" value={addFormData.state} onChange={(e) => setAddFormData({ ...addFormData, state: e.target.value })} required />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField fullWidth type="number" label="Total Rooms" placeholder="Number of rooms" value={addFormData.totalRooms} onChange={(e) => setAddFormData({ ...addFormData, totalRooms: e.target.value })} required />
              <TextField fullWidth type="number" label="Rent/Month (Optional)" placeholder="Monthly rent" value={addFormData.rentPerMonth} onChange={(e) => setAddFormData({ ...addFormData, rentPerMonth: e.target.value })} />
              <TextField fullWidth type="number" label="Rent/Day (Optional)" placeholder="Daily rent" value={addFormData.rentPerDay} onChange={(e) => setAddFormData({ ...addFormData, rentPerDay: e.target.value })} />
            </Box>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Gender Specific</InputLabel>
              <Select value={addFormData.genderSpecific} onChange={(e: any) => setAddFormData({ ...addFormData, genderSpecific: e.target.value })} displayEmpty>
                <MenuItem value="" disabled>Select Gender Preference</MenuItem>
                <MenuItem value="Any">Any</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Co-living">Co-living</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Furnishing</InputLabel>
              <Select value={addFormData.furnishing} onChange={(e: any) => setAddFormData({ ...addFormData, furnishing: e.target.value })} displayEmpty>
                <MenuItem value="" disabled>Select Furnishing Status</MenuItem>
                <MenuItem value="Fully Furnished">Fully Furnished</MenuItem>
                <MenuItem value="Semi-Furnished">Semi-Furnished</MenuItem>
                <MenuItem value="Unfurnished">Unfurnished</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mb: 2 }}>
              <Button variant="outlined" component="label" startIcon={<UploadIcon />} fullWidth>
                Upload Property Images
                <input type="file" hidden multiple accept="image/*" onChange={(e) => handleImageUpload(e, false)} />
              </Button>
              {uploadedImages.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  {uploadedImages.map((img, idx) => (
                    <Box key={idx} sx={{ position: 'relative', width: 100, height: 100 }}>
                      <img src={img} alt={`Upload ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                      <IconButton size="small" onClick={() => removeImage(idx, false)} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <TextField fullWidth label="Facilities (comma separated)" placeholder="WiFi, Security, Parking" value={addFormData.facilities} onChange={(e) => setAddFormData({ ...addFormData, facilities: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth multiline rows={3} label="Description" placeholder="Describe your property" value={addFormData.description} onChange={(e) => setAddFormData({ ...addFormData, description: e.target.value })} required sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button fullWidth variant="outlined" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button fullWidth type="submit" variant="contained" sx={{ bgcolor: '#e53e3e', '&:hover': { bgcolor: '#c53030' } }}>Save Property</Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={!!viewProperty} onClose={() => setViewProperty(null)} maxWidth="md" fullWidth>
        <DialogTitle>{viewProperty?.propertyName}</DialogTitle>
        <DialogContent>
          {viewProperty && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}><Typography variant="body2"><strong>Type:</strong> {viewProperty.propertyType}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2"><strong>Location:</strong> {viewProperty.location}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2"><strong>City:</strong> {viewProperty.city}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2"><strong>State:</strong> {viewProperty.state}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2"><strong>Total Rooms:</strong> {viewProperty.totalRooms}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2"><strong>Available:</strong> {viewProperty.availableRooms}</Typography></Grid>
                {viewProperty.rentPerMonth && <Grid item xs={6}><Typography variant="body2"><strong>Rent/Month:</strong> ₹{viewProperty.rentPerMonth.toLocaleString('en-IN')}</Typography></Grid>}
                {viewProperty.rentPerDay && <Grid item xs={6}><Typography variant="body2"><strong>Rent/Day:</strong> ₹{viewProperty.rentPerDay.toLocaleString('en-IN')}</Typography></Grid>}
                <Grid item xs={6}><Typography variant="body2"><strong>Gender:</strong> {viewProperty.genderSpecific}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2"><strong>Furnishing:</strong> {viewProperty.furnishing}</Typography></Grid>
                <Grid item xs={12}><Typography variant="body2"><strong>Facilities:</strong> {viewProperty.facilities.join(', ')}</Typography></Grid>
                <Grid item xs={12}><Typography variant="body2"><strong>Description:</strong> {viewProperty.description}</Typography></Grid>
              </Grid>
              <Button fullWidth variant="contained" onClick={() => setViewProperty(null)} sx={{ mt: 3, bgcolor: '#e53e3e' }}>Close</Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default OwnerListings;
