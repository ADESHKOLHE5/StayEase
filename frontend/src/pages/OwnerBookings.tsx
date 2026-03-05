import React from 'react';
import { Check, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const OwnerBookings: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, properties, user, updateBooking } = useStore();
  
  // Get bookings for owner
  const ownerBookings = bookings.filter(b => b.ownerId === user?.userId);
  const pendingBookings = ownerBookings.filter(b => b.status === 'PENDING');
  const processedBookings = ownerBookings.filter(b => b.status !== 'PENDING');

  const handleApprove = (bookingId: number) => {
    updateBooking(bookingId, 'APPROVED');
  };

  const handleDecline = (bookingId: number) => {
    updateBooking(bookingId, 'REJECTED');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Requests</h1>
          <p className="text-gray-600">Manage your incoming applications</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          <button className="flex-1 px-4 py-2 bg-white text-gray-900 font-medium rounded-md shadow-sm">
            Booking Requests
          </button>
          <button 
            onClick={() => navigate('/owner/listings')}
            className="flex-1 px-4 py-2 text-gray-600 font-medium rounded-md hover:bg-white/50"
          >
            My Listings
          </button>
        </div>

        {/* Incoming Applications */}
        {pendingBookings.length > 0 && (
          <div className="mb-8">
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
                    <div key={booking.bookingId} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">
                              {booking.tenant?.name.split(' ').map(n => n[0]).join('')}
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
                          <button
                            onClick={() => handleDecline(booking.bookingId)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                          >
                            <X className="w-4 h-4" />
                            <span>Decline</span>
                          </button>
                          <button
                            onClick={() => handleApprove(booking.bookingId)}
                            className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Processed Applications */}
        {processedBookings.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
              {processedBookings.map((booking) => {
                const property = properties.find(p => p.propertyId === booking.propertyId);
                return (
                  <div key={booking.bookingId} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-700 font-bold text-lg">
                            {booking.tenant?.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">
                              {booking.tenant?.name}
                            </h4>
                            {booking.status === 'APPROVED' && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                CONFIRMED
                              </span>
                            )}
                            {booking.status === 'REJECTED' && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                                REJECTED
                              </span>
                            )}
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

                      {booking.status === 'APPROVED' && (
                        <button className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center space-x-1">
                          <span>PROCESSED</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {ownerBookings.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No booking requests yet</h3>
            <p className="text-gray-600">Applications from tenants will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerBookings;
