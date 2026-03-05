import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';
import { useStore } from '../store';
import { User } from '../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useStore();
  const [email, setEmail] = React.useState('');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - in real app, this would call an API
    const mockUser: User = {
      userId: 1,
      email: email || 'owner@stayease.com',
      name: 'John Doe',
      phone: '9876543210',
      role: email.includes('owner') ? 'OWNER' : 'TENANT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    login(mockUser);
    
    if (mockUser.role === 'OWNER') {
      navigate('/owner/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Mock social login
    const mockUser: User = {
      userId: 1,
      email: `user@${provider}.com`,
      name: 'Demo User',
      phone: '9876543210',
      role: 'TENANT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    login(mockUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <HomeIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">StayEase</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 text-primary-600">
              <HomeIcon className="w-full h-full" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Log in or sign up</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleContinue} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Phone number or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
              <p className="mt-2 text-xs text-gray-500">
                Use 'owner@stayease.com' to login as owner, any other email for tenant view
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Continue
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('apple')}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
