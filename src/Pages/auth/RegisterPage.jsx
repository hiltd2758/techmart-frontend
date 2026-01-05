import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarContent, setSidebarContent] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      console.log("Registration data:", formData);
      alert('Registration successful!');
      setIsLoading(false);
    }, 1500);
  };

  const openSidebar = (content) => {
    setSidebarContent(content);
    setShowSidebar(true);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const termsContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">1. Account Terms</h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          You must be 18 years or older to use this service. You are responsible for maintaining the security of your account and password. We cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">2. Acceptable Use</h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          You agree not to use the service for any unlawful purpose or to violate any laws. You must not transmit any worms, viruses, or any code of a destructive nature.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">3. Service Modifications</h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          We reserve the right to modify or discontinue the service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">4. Limitation of Liability</h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          In no event shall we be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the service.
        </p>
      </div>
    </div>
  );

  const privacyContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">Information We Collect</h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          We collect information you provide directly to us, including your name, email address, and any other information you choose to provide when creating an account or using our services.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">How We Use Your Information</h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to protect our users and services from fraud and abuse.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">Information Sharing</h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          We do not share your personal information with third parties except as described in this policy. We may share information with service providers who assist us in operating our services.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">Data Security</h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          We take reasonable measures to protect your information from unauthorized access, disclosure, or destruction. However, no security system is impenetrable.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">Your Rights</h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          You have the right to access, update, or delete your personal information at any time. Contact us if you wish to exercise these rights.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Main Content */}
      <div className={`flex-1 flex items-center justify-center px-4 py-8 transition-all ${showSidebar ? 'mr-96' : ''}`}>
        <div className="w-full max-w-md">
          <div className="bg-white border border-neutral-200 p-12">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-2xl font-medium text-neutral-900 mb-2">
                Create account
              </h1>
              <p className="text-sm text-neutral-500">
                Fill in your details to get started
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-neutral-400 text-sm" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-3 py-2.5 border ${
                      errors.name
                        ? "border-red-400 bg-red-50"
                        : "border-neutral-300 bg-white focus:border-neutral-900"
                    } focus:outline-none`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-600 text-xs mt-2">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-neutral-400 text-sm" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-3 py-2.5 border ${
                      errors.email
                        ? "border-red-400 bg-red-50"
                        : "border-neutral-300 bg-white focus:border-neutral-900"
                    } focus:outline-none`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-xs mt-2">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-neutral-400 text-sm" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-10 py-2.5 border ${
                      errors.password
                        ? "border-red-400 bg-red-50"
                        : "border-neutral-300 bg-white focus:border-neutral-900"
                    } focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700"
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs mt-2">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-neutral-400 text-sm" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`w-full pl-10 pr-10 py-2.5 border ${
                      errors.confirmPassword
                        ? "border-red-400 bg-red-50"
                        : "border-neutral-300 bg-white focus:border-neutral-900"
                    } focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs mt-2">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-neutral-300 mt-1 cursor-pointer"
                  required
                />
                <label className="ml-2 text-sm text-neutral-600">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => openSidebar('terms')}
                    className="text-neutral-900 font-medium hover:underline"
                  >
                    Terms and Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => openSidebar('privacy')}
                    className="text-neutral-900 font-medium hover:underline"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-neutral-900 text-white py-2.5 font-medium hover:bg-neutral-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-neutral-200"></div>
              <span className="px-4 text-neutral-400 text-xs">OR</span>
              <div className="flex-1 border-t border-neutral-200"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-3 border border-neutral-300 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 border border-neutral-300 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Continue with Apple
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-neutral-500 text-sm mt-8">
              Already have an account?{' '}
              <a href="/login" className="text-neutral-900 font-medium hover:underline">
                Sign in
              </a>
            </p>
          </div>

          {/* Help Text */}
          <p className="text-center text-neutral-400 text-xs mt-6">
            By continuing, you agree to our{' '}
            <button
              type="button"
              onClick={() => openSidebar('terms')}
              className="underline hover:text-neutral-600"
            >
              Terms
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => openSidebar('privacy')}
              className="underline hover:text-neutral-600"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-neutral-200 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-medium text-neutral-900">
              {sidebarContent === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'}
            </h2>
            <button
              onClick={closeSidebar}
              className="text-neutral-400 hover:text-neutral-700"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
          
          <div className="px-6 py-8">
            <p className="text-xs text-neutral-500 mb-6">Last updated: January 5, 2026</p>
            {sidebarContent === 'terms' ? termsContent : privacyContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;