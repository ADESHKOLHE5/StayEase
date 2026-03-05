export interface User {
  userId: number;
  email: string;
  name: string;
  phone: string;
  role: 'TENANT' | 'OWNER';
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  propertyId: number;
  ownerId: number;
  propertyName: string;
  propertyType: 'PG' | 'Hostel' | 'Apartment';
  location: string;
  address: string;
  city: string;
  state: string;
  totalRooms: number;
  availableRooms: number;
  rentPerMonth: number;
  facilities: string[];
  images: string[];
  description: string;
  aiSummary: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  owner?: User;
}

export interface Room {
  roomId: number;
  propertyId: number;
  roomNumber: string;
  capacity: number;
  isAvailable: boolean;
  rent: number;
}

export interface Booking {
  bookingId: number;
  propertyId: number;
  tenantId: number;
  ownerId: number;
  roomId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  requestDate: string;
  approvalDate?: string;
  moveInDate?: string;
  rentAmount: number;
  createdAt: string;
  updatedAt: string;
  property?: Property;
  tenant?: User;
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

export interface SearchHistory {
  query: string;
  filters: Filters;
  timestamp: string;
}
