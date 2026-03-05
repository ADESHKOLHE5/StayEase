import React from 'react';
import { Home, TrendingUp, AlertCircle, Plus, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useStore } from '../store';
import { Property } from '../types';

const OwnerDashboard: React.FC = () => {
  const { properties, user, bookings, addProperty } = useStore();
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    propertyName: '',
    location: '',
    monthlyRent: '',
    totalRooms: ''
  });

  // Get owner's properties
  const ownerProperties = properties.filter(p => p.ownerId === user?.userId);
  
  // Get pending bookings for owner
  const pendingBookings = bookings.filter(
    b => b.ownerId === user?.userId && b.status === 'PENDING'
  );

  // Calculate stats
  const totalProperties = ownerProperties.length;
  const totalRooms = ownerProperties.reduce((sum, p) => sum + p.totalRooms, 0);
  const bookedRooms = ownerProperties.reduce((sum, p) => sum + (p.totalRooms - p.availableRooms), 0);
  const occupancyRate = totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0;

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProperty: Property = {
      propertyId: Date.now(),
      ownerId: user?.userId || 1,
      propertyName: formData.propertyName,
      propertyType: 'PG',
      location: formData.location,
      address: formData.location,
      city: formData.location.split(',')[0],
      state: 'Maharashtra',
      totalRooms: parseInt(formData.totalRooms),
      availableRooms: parseInt(formData.totalRooms),
      rentPerMonth: parseInt(formData.monthlyRent),
      facilities: ['WiFi', 'Security'],
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      description: 'New property listing',
      aiSummary: 'Recently added property',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addProperty(newProperty);
    setShowAddModal(false);
    setFormData({ propertyName: '', location: '', monthlyRent: '', totalRooms: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-primary-600 mb-2">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
            <span className="font-semibold">LIVE DASHBOARD</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">StayEase Manager</h1>
          <p className="text-gray-600">Good morning, Owner. Here's what's happening today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Properties */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">TOTAL PROPERTIES</p>
                <p className="text-3xl font-bold text-gray-900">{totalProperties}</p>
                <p className="text-sm text-gray-500 mt-1">Active listings</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Occupancy Rate */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">OCCUPANCY RATE</p>
                <p className="text-3xl font-bold text-gray-900">{occupancyRate}%</p>
                <p className="text-sm text-gray-500 mt-1">{bookedRooms}/{totalRooms} rooms booked</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">ACTION ITEMS</p>
                <p className="text-3xl font-bold text-gray-900">{pendingBookings.length}</p>
                <p className="text-sm text-gray-500 mt-1">Pending requests</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Add Property Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">My Properties</h2>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
          >
            <Plus className="w-5 h-5" />
            <span>Add Property</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          <button className="flex-1 px-4 py-2 bg-white text-gray-900 font-medium rounded-md shadow-sm">
            Booking Requests
          </button>
          <button className="flex-1 px-4 py-2 text-gray-600 font-medium rounded-md hover:bg-white/50">
            My Listings
          </button>
        </div>

        {/* Incoming Applications */}
        {pendingBookings.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Incoming Applications</h3>
                <span className="text-sm text-gray-600">{pendingBookings.length} Total</span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {pendingBookings.map((booking) => {
                const property = properties.find(p => p.propertyId === booking.propertyId);
                return (
                  <div key={booking.bookingId} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {booking.tenant?.name.charAt(0)}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">
                              {booking.tenant?.name}
                            </h4>
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded">
                              PENDING
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-1">
                            Application for <span className="font-medium text-gray-900">{property?.propertyName}</span>
                          </p>
                          
                          <p className="text-xs text-gray-500">
                            RECEIVED ON {new Date(booking.requestDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }).toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          Decline
                        </button>
                        <button className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-1">
                          <span>Approve</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests</h3>
            <p className="text-gray-600">You'll see booking requests from tenants here</p>
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Property</h2>
            <p className="text-sm text-gray-600 mb-6">Fill in the details for your accommodation listing.</p>

            <form onSubmit={handleAddProperty} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PROPERTY TITLE
                </label>
                <input
                  type="text"
                  value={formData.propertyName}
                  onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LOCATION
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MONTHLY RENT
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                    placeholder="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TOTAL ROOMS
                  </label>
                  <input
                    type="number"
                    value={formData.totalRooms}
                    onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save Listing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
