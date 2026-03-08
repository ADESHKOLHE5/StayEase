export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'TENANT' | 'OWNER';
  gender?: 'Male' | 'Female' | 'Others';
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  propertyId: string;
  ownerId: string;
  propertyName: string;
  propertyType: 'PG' | 'Hostel' | 'Apartment';
  location: string;
  address: string;
  city: string;
  state: string;
  totalRooms: number;
  availableRooms: number;
  rentPerMonth?: number;
  rentPerDay?: number;
  genderSpecific: 'Male' | 'Female' | 'Co-living' | 'Any';
  furnishing: 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished';
  facilities: string[];
  images: string[];
  description: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  bookingId: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  requestDate: string;
  approvalDate?: string;
  moveInDate?: string;
  rentAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Filters {
  propertyType?: string;
  genderSpecific?: string;
  furnishing?: string;
  minRent?: number;
  maxRent?: number;
  city?: string;
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'newest';
}
