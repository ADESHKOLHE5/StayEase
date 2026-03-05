import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Menu, Globe, Bell } from 'lucide-react';
import { useStore } from '../store';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, isOwnerView, switchView, logout } = useStore();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleViewSwitch = () => {
    switchView();
    if (isOwnerView) {
      navigate('/');
    } else {
      navigate('/owner/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowMenu(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isOwnerView ? '/owner/dashboard' : '/'} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <HomeIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">StayEase</span>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              {!isOwnerView ? (
                <>
                  <Link
                    to="/"
                    className={`text-sm font-medium ${
                      location.pathname === '/' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/accommodations"
                    className={`text-sm font-medium ${
                      location.pathname === '/accommodations' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    Find Accommodation
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/owner/dashboard"
                    className={`text-sm font-medium ${
                      location.pathname === '/owner/dashboard' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/owner/bookings"
                    className={`text-sm font-medium ${
                      location.pathname === '/owner/bookings' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    Booking Requests
                  </Link>
                  <Link
                    to="/owner/listings"
                    className={`text-sm font-medium ${
                      location.pathname === '/owner/listings' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    My Listings
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'OWNER' && (
                  <button
                    onClick={handleViewSwitch}
                    className="hidden md:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 border border-gray-300 rounded-lg hover:border-primary-600 transition-colors"
                  >
                    {isOwnerView ? 'Switch to Hosting' : 'Switch to Hosting'}
                  </button>
                )}
                
                <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>

                <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <Globe className="w-5 h-5" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-2 p-2 border border-gray-300 rounded-full hover:shadow-md transition-shadow"
                  >
                    <Menu className="w-4 h-4 text-gray-600" />
                    <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {user?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      
                      {user?.role === 'OWNER' && (
                        <button
                          onClick={handleViewSwitch}
                          className="md:hidden w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {isOwnerView ? 'Switch to Tenant View' : 'Switch to Owner View'}
                        </button>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
