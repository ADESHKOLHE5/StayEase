import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Grid, Paper, Chip, CircularProgress, Alert,
} from '@mui/material';
import {
  LocationOn, ArrowBack, AccessTime, CheckCircleOutline,
  Wifi, LocalParking, Security, Fastfood, AcUnit,
  LocalLaundryService, FlashOn, FitnessCenter,
} from '@mui/icons-material';
import useFetch from '../hooks/useFetch';
import useAuth from '../hooks/useAuth';
import  { useMaskedEmail } from '../hooks/useMaskedemail';

interface PropertyDetailData {
  propertyId: string;
  ownerId: number;
  ownerName: string;
  propertyName: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalRooms: number;
  availableRooms: number;
  rentPerMonth: number;
  securityDeposit: number;
  rentIncludes: string;
  facilities: string[];
  checkInTime: string;
  checkOutTime: string;
  description: string;
  imageUrl: string;
  cancellationPolicy: string;
  depositPolicy: string;
  houseRules: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ─── Inline styles / design tokens ─────────────────────────── */
const TOKEN = {
  red:        '#C0392B',
  redLight:   '#FDECEA',
  redMid:     '#E74C3C',
  dark:       '#1A1A2E',
  darkMid:    '#16213E',
  ink:        '#2D2D2D',
  muted:      '#7A7A8C',
  border:     '#EBEBF0',
  surface:    '#FFFFFF',
  bg:         '#F5F5FA',
  green:      '#16A34A',
  greenBg:    '#DCFCE7',
  amber:      '#D97706',
  amberBg:    '#FEF3C7',
  radius:     '18px',
  radiusSm:   '10px',
  font:       "'Cormorant Garamond', Georgia, serif",
  fontSans:   "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
};

/* Google Fonts injection */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap';
if (!document.head.querySelector('[href*="Cormorant"]')) {
  document.head.appendChild(fontLink);
}

/* ─── Sub-components ─────────────────────────────────────────── */

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
    <Box sx={{ width: 3, height: 22, bgcolor: TOKEN.red, borderRadius: 2, flexShrink: 0 }} />
    <Typography
      sx={{
        fontFamily: TOKEN.font,
        fontWeight: 700,
        fontSize: '1.25rem',
        color: TOKEN.dark,
        letterSpacing: '0.01em',
      }}
    >
      {children}
    </Typography>
  </Box>
);

const InfoCard: React.FC<{ label: string; value: string; icon?: React.ReactNode; accent?: boolean }> = ({
  label, value, icon, accent,
}) => (
  <Box
    sx={{
      flex: 1,
      bgcolor: accent ? TOKEN.redLight : TOKEN.bg,
      borderRadius: TOKEN.radiusSm,
      p: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      border: `1px solid ${accent ? '#F5C6C2' : TOKEN.border}`,
    }}
  >
    {icon && (
      <Box sx={{ color: accent ? TOKEN.red : TOKEN.muted, display: 'flex' }}>{icon}</Box>
    )}
    <Box>
      <Typography sx={{ fontFamily: TOKEN.fontSans, fontSize: '0.6rem', color: TOKEN.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </Typography>
      <Typography sx={{ fontFamily: TOKEN.fontSans, fontSize: '0.88rem', fontWeight: 700, color: TOKEN.ink, mt: '2px' }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

/* ─── Main Component ─────────────────────────────────────────── */

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { user: currentUser } = useAuth();
  const isAuthenticated = !!currentUser;

  const { data, loading, error } = useFetch(`/properties/details/${id}`);
  const maskedOwnerName = useMaskedEmail(data?.ownerName);  

  // Fetch current tenant's bookings to check for a pending booking on this property
  const { data: myBookings } = useFetch(
    currentUser?.role === 'TENANT' ? '/bookings/tenant/my' : ''
  );
  const hasPendingBooking = !!(myBookings && Array.isArray(myBookings) && myBookings.some(
    (b: any) => b.propertyId === id && b.status === 'PENDING'
  ));

  const handleBookNow = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (currentUser?.role === 'OWNER') {
      // This should never be called now because the button is disabled, but keep as safeguard
      alert('Owners cannot book properties. Please use a tenant account.');
      return;
    }
    navigate(`/booking/${data?.propertyId}`);
  };

  const getFacilityIcon = (facility: string) => {
    const f = facility.toLowerCase();
    if (f.includes('wifi'))                     return <Wifi sx={{ fontSize: 17 }} />;
    if (f.includes('parking'))                  return <LocalParking sx={{ fontSize: 17 }} />;
    if (f.includes('security') || f.includes('cctv')) return <Security sx={{ fontSize: 17 }} />;
    if (f.includes('food') || f.includes('kitchen'))  return <Fastfood sx={{ fontSize: 17 }} />;
    if (f.includes('ac') || f.includes('air'))  return <AcUnit sx={{ fontSize: 17 }} />;
    if (f.includes('laundry'))                  return <LocalLaundryService sx={{ fontSize: 17 }} />;
    if (f.includes('power') || f.includes('backup')) return <FlashOn sx={{ fontSize: 17 }} />;
    if (f.includes('gym') || f.includes('fitness'))  return <FitnessCenter sx={{ fontSize: 17 }} />;
    return <CheckCircleOutline sx={{ fontSize: 17 }} />;
  };

  const typeColors: Record<string, { bg: string; color: string }> = {
    Apartment: { bg: '#EFF6FF', color: '#1D4ED8' },
    Hostel:    { bg: '#F0FDF4', color: '#15803D' },
    PG:        { bg: '#FDF4FF', color: '#7E22CE' },
  };

  const getAvailLabel = (property: PropertyDetailData) => {
    const count = property.availableRooms;
    if (count === 0) return { label: 'Sold Out', color: '#DC2626', bg: '#FEE2E2' };
    let unit = property.propertyType === 'Apartment' ? 'flat' : property.propertyType === 'Hostel' ? 'bed' : 'room';
    if (count > 1) unit += 's';
    return {
      label: `${count} ${unit} available`,
      color: count === 1 ? TOKEN.amber : TOKEN.green,
      bg:    count === 1 ? TOKEN.amberBg : TOKEN.greenBg,
    };
  };

  /* ── Loading ── */
  if (loading) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: TOKEN.bg }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress sx={{ color: TOKEN.red }} />
        <Typography sx={{ mt: 2, fontFamily: TOKEN.fontSans, color: TOKEN.muted, fontSize: '0.9rem' }}>
          Loading property…
        </Typography>
      </Box>
    </Box>
  );

  /* ── Error ── */
  if (error) return (
    <Box sx={{ minHeight: '100vh', bgcolor: TOKEN.bg }}>
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ borderRadius: TOKEN.radiusSm }}>
          Failed to load property details. Please try again later.
        </Alert>
        <Button onClick={() => navigate('/accommodations')} sx={{ mt: 2, fontFamily: TOKEN.fontSans }}>
          Back to listings
        </Button>
      </Container>
    </Box>
  );

  /* ── Not found ── */
  if (!data) return (
    <Box sx={{ minHeight: '100vh', bgcolor: TOKEN.bg }}>
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography sx={{ fontFamily: TOKEN.font, fontSize: '1.6rem', color: TOKEN.dark }}>
          Property not found
        </Typography>
        <Button onClick={() => navigate('/accommodations')} sx={{ mt: 2 }}>
          Back to listings
        </Button>
      </Container>
    </Box>
  );

  const property = data;
  const typeColor = typeColors[property.propertyType] || { bg: '#F3F4F6', color: '#374151' };
  const avail = getAvailLabel(property);

  const policies = [
    property.cancellationPolicy && { title: 'Cancellation Policy',  detail: property.cancellationPolicy },
    property.depositPolicy       && { title: 'Deposit Policy',       detail: property.depositPolicy },
    property.houseRules          && { title: 'House Rules',           detail: property.houseRules },
    property.rentIncludes        && { title: 'Rent Includes',         detail: property.rentIncludes },
    property.securityDeposit     && { title: 'Security Deposit',      detail: `₹${property.securityDeposit.toLocaleString('en-IN')}` },
  ].filter(Boolean) as { title: string; detail: string }[];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: TOKEN.bg,
        fontFamily: TOKEN.fontSans,
      }}
    >
      {/* ── Hero Banner ── */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 260, sm: 360, md: 460 },
          overflow: 'hidden',
        }}
      >
        <img
          src={property.imageUrl || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1400'}
          alt={property.propertyName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Dark gradient overlay */}
        <Box
          sx={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(26,26,46,0.18) 0%, rgba(26,26,46,0.72) 100%)',
          }}
        />
        {/* Back button on hero */}
        <Button
          startIcon={<ArrowBack sx={{ fontSize: 18 }} />}
          onClick={() => navigate(-1)}
          sx={{
            position: 'absolute', top: 20, left: 20,
            bgcolor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontFamily: TOKEN.fontSans,
            fontWeight: 600,
            fontSize: '0.82rem',
            borderRadius: '8px',
            px: 2, py: 0.8,
            border: '1px solid rgba(255,255,255,0.25)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
          }}
        >
          Back
        </Button>

        {/* Hero title overlay */}
        <Box
          sx={{
            position: 'absolute', bottom: 28, left: { xs: 20, md: 40 }, right: { xs: 20, md: 40 },
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Chip
                label={property.propertyType}
                size="small"
                sx={{
                  bgcolor: typeColor.bg, color: typeColor.color,
                  fontFamily: TOKEN.fontSans, fontWeight: 700,
                  fontSize: '0.72rem', borderRadius: '6px',
                }}
              />
              <Chip
                label={avail.label}
                size="small"
                sx={{
                  bgcolor: avail.bg, color: avail.color,
                  fontFamily: TOKEN.fontSans, fontWeight: 700,
                  fontSize: '0.72rem', borderRadius: '6px',
                }}
              />
            </Box>
            <Typography
              sx={{
                fontFamily: TOKEN.font,
                fontWeight: 700,
                fontSize: { xs: '1.6rem', md: '2.2rem' },
                color: '#fff',
                lineHeight: 1.15,
                textShadow: '0 2px 12px rgba(0,0,0,0.3)',
              }}
            >
              {property.propertyName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.8 }}>
              <LocationOn sx={{ fontSize: 15, color: '#ffb3ae' }} />
              <Typography sx={{ fontFamily: TOKEN.fontSans, fontSize: '0.83rem', color: 'rgba(255,255,255,0.82)', fontWeight: 400 }}>
                {property.address}, {property.city}, {property.state} – {property.pincode}
              </Typography>
            </Box>
          </Box>
          {/* Rent badge on hero */}
          <Box
            sx={{
              bgcolor: TOKEN.red,
              borderRadius: '14px',
              px: 2.5, py: 1.5,
              textAlign: 'center',
              backdropFilter: 'blur(4px)',
              minWidth: 130,
            }}
          >
            <Typography sx={{ fontFamily: TOKEN.fontSans, fontSize: '0.6rem', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
              Monthly Rent
            </Typography>
            <Typography sx={{ fontFamily: TOKEN.font, fontWeight: 700, fontSize: '1.8rem', color: '#fff', lineHeight: 1.2 }}>
              ₹{property.rentPerMonth?.toLocaleString('en-IN')}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Body ── */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Grid container spacing={4} alignItems="flex-start">

          {/* ── Left Column ── */}
          <Grid item xs={12} md={8}>

            {/* About */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                mb: 3,
                borderRadius: TOKEN.radius,
                border: `1px solid ${TOKEN.border}`,
                bgcolor: TOKEN.surface,
              }}
            >
              <SectionHeading>About this Property</SectionHeading>
              <Typography
                sx={{
                  fontFamily: TOKEN.fontSans,
                  fontSize: '0.95rem',
                  color: TOKEN.muted,
                  lineHeight: 1.85,
                  fontWeight: 300,
                }}
              >
                {property.description}
              </Typography>
            </Paper>

            {/* Quick Info Strip */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <InfoCard label="Check-In" value={property.checkInTime}   icon={<AccessTime sx={{ fontSize: 18 }} />} accent />
              <InfoCard label="Check-Out" value={property.checkOutTime} icon={<AccessTime sx={{ fontSize: 18 }} />} />
              <InfoCard label="Total Rooms" value={String(property.totalRooms)} />
              <InfoCard label="Security Deposit" value={`₹${property.securityDeposit?.toLocaleString('en-IN') ?? '—'}`} />
            </Box>

            {/* Facilities */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                mb: 3,
                borderRadius: TOKEN.radius,
                border: `1px solid ${TOKEN.border}`,
                bgcolor: TOKEN.surface,
              }}
            >
              <SectionHeading>Facilities &amp; Amenities</SectionHeading>
              <Grid container spacing={1.5}>
                {property.facilities.map((facility, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.2,
                        bgcolor: TOKEN.bg,
                        border: `1px solid ${TOKEN.border}`,
                        borderRadius: '10px',
                        px: 1.5,
                        py: 1.1,
                        transition: 'all 0.18s ease',
                        '&:hover': {
                          bgcolor: TOKEN.redLight,
                          borderColor: '#F5C6C2',
                        },
                      }}
                    >
                      <Box sx={{ color: TOKEN.red, display: 'flex', flexShrink: 0 }}>
                        {getFacilityIcon(facility)}
                      </Box>
                      <Typography sx={{ fontFamily: TOKEN.fontSans, fontSize: '0.82rem', fontWeight: 500, color: TOKEN.ink }}>
                        {facility}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Policies */}
            {policies.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: TOKEN.radius,
                  border: `1px solid ${TOKEN.border}`,
                  bgcolor: TOKEN.surface,
                }}
              >
                <SectionHeading>Property Policies</SectionHeading>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {policies.map((policy, i) => (
                    <Box
                      key={policy.title}
                      sx={{
                        display: 'flex',
                        gap: 2,
                        py: 1.8,
                        borderBottom: i < policies.length - 1 ? `1px solid ${TOKEN.border}` : 'none',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: 130,
                          fontFamily: TOKEN.fontSans,
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: TOKEN.red,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          pt: '2px',
                        }}
                      >
                        {policy.title}
                      </Box>
                      <Typography sx={{ fontFamily: TOKEN.fontSans, fontSize: '0.88rem', color: TOKEN.ink, lineHeight: 1.7 }}>
                        {policy.detail}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}
          </Grid>

          {/* ── Right Column (Sticky Booking Card) ── */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: TOKEN.radius,
                border: `1px solid ${TOKEN.border}`,
                bgcolor: TOKEN.surface,
                overflow: 'hidden',
                position: 'sticky',
                top: 90,
              }}
            >
              {/* Card header strip */}
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${TOKEN.dark} 0%, ${TOKEN.darkMid} 100%)`,
                  p: '20px 24px 18px',
                }}
              >
                <Typography sx={{ fontFamily: TOKEN.fontSans, fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>
                  Monthly Rent
                </Typography>
                <Typography sx={{ fontFamily: TOKEN.font, fontWeight: 700, fontSize: '2.2rem', color: '#fff', lineHeight: 1.15, mt: 0.3 }}>
                  ₹{property.rentPerMonth?.toLocaleString('en-IN')}
                  <Typography component="span" sx={{ fontFamily: TOKEN.fontSans, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400, ml: 0.8 }}>
                    / month
                  </Typography>
                </Typography>

                {/* Availability + Type row */}
                <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                  <Chip
                    label={avail.label}
                    size="small"
                    sx={{ bgcolor: avail.bg, color: avail.color, fontFamily: TOKEN.fontSans, fontWeight: 700, fontSize: '0.72rem', borderRadius: '6px' }}
                  />
                  <Chip
                    label={property.propertyType}
                    size="small"
                    sx={{ bgcolor: typeColor.bg, color: typeColor.color, fontFamily: TOKEN.fontSans, fontWeight: 700, fontSize: '0.72rem', borderRadius: '6px' }}
                  />
                </Box>
              </Box>

              {/* Card body */}
              <Box sx={{ p: '20px 24px' }}>

                {/* Timings */}
                <Typography sx={{ fontFamily: TOKEN.fontSans, fontSize: '0.65rem', color: TOKEN.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                  Timings
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
                  <Box sx={{ flex: 1, bgcolor: TOKEN.redLight, borderRadius: TOKEN.radiusSm, p: '10px 14px', border: '1px solid #F5C6C2' }}>
                    <Typography sx={{ fontFamily: TOKEN.fontSans, fontSize: '0.6rem', color: TOKEN.red, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Check-In</Typography>
                    <Typography sx={{ fontFamily: TOKEN.fontSans, fontWeight: 700, fontSize: '0.9rem', color: TOKEN.ink, mt: '2px' }}>{property.checkInTime}</Typography>
                  </Box>
                  <Box sx={{ flex: 1, bgcolor: TOKEN.bg, borderRadius: TOKEN.radiusSm, p: '10px 14px', border: `1px solid ${TOKEN.border}` }}>
                    <Typography sx={{ fontFamily: TOKEN.fontSans, fontSize: '0.6rem', color: TOKEN.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Check-Out</Typography>
                    <Typography sx={{ fontFamily: TOKEN.fontSans, fontWeight: 700, fontSize: '0.9rem', color: TOKEN.ink, mt: '2px' }}>{property.checkOutTime}</Typography>
                  </Box>
                </Box>

                {/* CTA — hidden for owners */}
                {currentUser?.role !== 'OWNER' && (
                  hasPendingBooking ? (
                    /* Pending booking guard */
                    <Box
                      sx={{
                        bgcolor: '#fffbeb',
                        border: '1.5px solid #fcd34d',
                        borderRadius: TOKEN.radiusSm,
                        p: '14px 18px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                      }}
                    >
                      <Box sx={{ fontSize: 22, lineHeight: 1.2 }}>⏳</Box>
                      <Box>
                        <Typography sx={{ fontFamily: TOKEN.fontSans, fontWeight: 700, fontSize: '0.82rem', color: '#92400e', mb: 0.3 }}>
                          Booking Request Pending
                        </Typography>
                        <Typography sx={{ fontFamily: TOKEN.fontSans, fontSize: '0.75rem', color: '#b45309', lineHeight: 1.5 }}>
                          You already sent a request for this property. Please wait for the owner's decision or cancel your request first.
                        </Typography>
                      </Box>
                    </Box>
                  ) : property.availableRooms > 0 ? (
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleBookNow}
                      sx={{
                        background: `linear-gradient(135deg, ${TOKEN.red} 0%, ${TOKEN.redMid} 100%)`,
                        color: '#fff',
                        py: 1.6,
                        fontFamily: TOKEN.fontSans,
                        fontWeight: 700,
                        borderRadius: TOKEN.radiusSm,
                        fontSize: '0.95rem',
                        letterSpacing: '0.03em',
                        boxShadow: `0 6px 20px rgba(192,57,43,0.35)`,
                        border: 'none',
                        '&:hover': {
                          background: `linear-gradient(135deg, #A93226 0%, ${TOKEN.red} 100%)`,
                          boxShadow: `0 8px 24px rgba(192,57,43,0.45)`,
                        },
                      }}
                    >
                      Book Now
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      disabled
                      size="large"
                      sx={{ py: 1.6, borderRadius: TOKEN.radiusSm, fontSize: '0.95rem', fontFamily: TOKEN.fontSans }}
                    >
                      Sold Out
                    </Button>
                  )
                )}

                {currentUser?.role !== 'OWNER' && !hasPendingBooking && (
                  <Typography sx={{ fontFamily: TOKEN.fontSans, fontSize: '0.72rem', color: TOKEN.muted, textAlign: 'center', mt: 1.2 }}>
                    ℹ You won't be charged yet
                  </Typography>
                )}


                {/* Owner */}
                {property.ownerName && (
                  <Box sx={{ mt: 2.5, pt: 2.5, borderTop: `1px solid ${TOKEN.border}` }}>
                    <Typography sx={{ fontFamily: TOKEN.fontSans, fontSize: '0.6rem', color: TOKEN.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                      Property Owner
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                      <Box
                        sx={{
                          width: 38, height: 38,
                          borderRadius: '50%',
                          bgcolor: TOKEN.dark,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: TOKEN.fontSans,
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          color: '#fff',
                          flexShrink: 0,
                        }}
                      >
                        {property.ownerName.charAt(0).toUpperCase()}
                        
                      </Box>
                      <Typography sx={{ fontFamily: TOKEN.fontSans, fontWeight: 600, fontSize: '0.9rem', color: TOKEN.ink }}>
                        {/* {property.ownerName} */}
                        {maskedOwnerName}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PropertyDetail;