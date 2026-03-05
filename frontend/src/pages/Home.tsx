import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, Zap, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import { useStore } from '../store';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { properties } = useStore();
  
  // Get handpicked properties (first 4)
  const handpickedProperties = properties.slice(0, 4);

  const handleStartSearching = () => {
    navigate('/accommodations');
  };

  const handleListProperty = () => {
    navigate('/owner/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block px-4 py-1.5 bg-primary-50 text-primary-700 text-sm font-semibold rounded-full mb-6">
                #1 Student Accommodation Platform
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Find your <span className="text-primary-600">home</span><br />
                away from home.
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Connect directly with verified property owners. No brokers, no hidden fees. 
                Just safe, affordable, and comfortable stays.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={handleStartSearching}
                  className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 flex items-center space-x-2"
                >
                  <span>Start Searching</span>
                  <Search className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleListProperty}
                  className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-colors"
                >
                  List Your Property
                </button>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-primary-600" />
                  <span>Verified Owners</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Zap className="w-5 h-5 text-primary-600" />
                  <span>Zero Brokerage</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  <span>Instant Booking</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
                  alt="Modern living room"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 hidden lg:block">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">500+</p>
                    <p className="text-sm text-gray-600">Happy Tenants</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Handpicked Accommodations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Handpicked <span className="text-primary-600">Accommodations</span>
              </h2>
              <p className="text-gray-600">Curated properties just for you</p>
            </div>
            
            <button
              onClick={handleStartSearching}
              className="hidden md:flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              <span>Explore all listings</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {handpickedProperties.map((property, index) => (
              <PropertyCard
                key={property.propertyId}
                property={property}
                featured={index === 0}
              />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <button
              onClick={handleStartSearching}
              className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Explore all listings
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Finding your perfect accommodation is just three simple steps away
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. Search</h3>
              <p className="text-gray-600">
                Browse through verified listings and filter by location, price, and amenities
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">2. Connect</h3>
              <p className="text-gray-600">
                Send booking requests directly to property owners without any middlemen
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3. Move In</h3>
              <p className="text-gray-600">
                Get instant approval and move into your new home hassle-free
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 StayEase. All rights reserved. | Built for students, by students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
