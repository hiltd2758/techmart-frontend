import React, { useState } from 'react';  
import { Link, useNavigate } from 'react-router-dom';  
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';  
import { useAuth } from '../../Context/AuthContext';  
  
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
  const navigate = useNavigate();  
  const { login } = useAuth();  
  
  const handleChange = (e) => {  
    setFormData({  
      ...formData,  
      [e.target.name]: e.target.value  
    });  
  };  
  
  const handleSubmit = (e) => {  
    e.preventDefault();  
      
    // Validation  
    const newErrors = {};  
    if (!formData.name) newErrors.name = 'Name is required';  
    if (!formData.email) newErrors.email = 'Email is required';  
    if (!formData.password) newErrors.password = 'Password is required';  
    if (formData.password !== formData.confirmPassword) {  
      newErrors.confirmPassword = 'Passwords do not match';  
    }  
      
    if (Object.keys(newErrors).length > 0) {  
      setErrors(newErrors);  
      return;  
    }  
  
    // Mock registration - in real app, this would be an API call  
    const mockUser = {  
      name: formData.name,  
      email: formData.email,  
      phone: '+1 234 567 8900'  
    };  
      
    login('mock-token', mockUser);  
    navigate('/account');  
  };  
  
  return (  
    <div className="w-full bg-white pt-[150px] pb-[100px] min-h-screen">  
      <div className="lg:container mx-auto px-4">  
        <div className="max-w-md mx-auto">  
          <div className="text-center mb-8">  
            <h1 className="text-3xl text-[#484848] font-poppins font-medium mb-3">  
              Create Account  
            </h1>  
            <p className="text-base text-[#8a8a8a] font-poppins">  
              Join TechMart and start shopping  
            </p>  
          </div>  
  
          <form onSubmit={handleSubmit} className="space-y-6">  
            {/* Name Field */}  
            <div>  
              <label className="block text-sm text-[#484848] font-poppins font-medium mb-2">  
                Full Name  
              </label>  
              <div className="relative">  
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">  
                  <FaUser className="text-[#8a8a8a]" />  
                </div>  
                <input  
                  type="text"  
                  name="name"  
                  value={formData.name}  
                  onChange={handleChange}  
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-[#484848] font-poppins focus:outline-none focus:border-black"  
                  placeholder="Enter your full name"  
                />  
              </div>  
              {errors.name && (  
                <p className="mt-1 text-sm text-red-600 font-poppins">{errors.name}</p>  
              )}  
            </div>  
  
            {/* Email Field */}  
            <div>  
              <label className="block text-sm text-[#484848] font-poppins font-medium mb-2">  
                Email Address  
              </label>  
              <div className="relative">  
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">  
                  <FaEnvelope className="text-[#8a8a8a]" />  
                </div>  
                <input  
                  type="email"  
                  name="email"  
                  value={formData.email}  
                  onChange={handleChange}  
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-[#484848] font-poppins focus:outline-none focus:border-black"  
                  placeholder="Enter your email"  
                />  
              </div>  
              {errors.email && (  
                <p className="mt-1 text-sm text-red-600 font-poppins">{errors.email}</p>  
              )}  
            </div>  
  
            {/* Password Field */}  
            <div>  
              <label className="block text-sm text-[#484848] font-poppins font-medium mb-2">  
                Password  
              </label>  
              <div className="relative">  
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">  
                  <FaLock className="text-[#8a8a8a]" />  
                </div>  
                <input  
                  type={showPassword ? 'text' : 'password'}  
                  name="password"  
                  value={formData.password}  
                  onChange={handleChange}  
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-[#484848] font-poppins focus:outline-none focus:border-black"  
                  placeholder="Create a password"  
                />  
                <button  
                  type="button"  
                  onClick={() => setShowPassword(!showPassword)}  
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"  
                >  
                  {showPassword ? (  
                    <FaEyeSlash className="text-[#8a8a8a] hover:text-black" />  
                  ) : (  
                    <FaEye className="text-[#8a8a8a] hover:text-black" />  
                  )}  
                </button>  
              </div>  
              {errors.password && (  
                <p className="mt-1 text-sm text-red-600 font-poppins">{errors.password}</p>  
              )}  
            </div>  
  
            {/* Confirm Password Field */}  
            <div>  
              <label className="block text-sm text-[#484848] font-poppins font-medium mb-2">  
                Confirm Password  
              </label>  
              <div className="relative">  
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">  
                  <FaLock className="text-[#8a8a8a]" />  
                </div>  
                <input  
                  type={showConfirmPassword ? 'text' : 'password'}  
                  name="confirmPassword"  
                  value={formData.confirmPassword}  
                  onChange={handleChange}  
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-[#484848] font-poppins focus:outline-none focus:border-black"  
                  placeholder="Confirm your password"  
                />  
                <button  
                  type="button"  
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}  
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"  
                >  
                  {showConfirmPassword ? (  
                    <FaEyeSlash className="text-[#8a8a8a] hover:text-black" />  
                  ) : (  
                    <FaEye className="text-[#8a8a8a] hover:text-black" />  
                  )}  
                </button>  
              </div>  
              {errors.confirmPassword && (  
                <p className="mt-1 text-sm text-red-600 font-poppins">{errors.confirmPassword}</p>  
              )}  
            </div>  
  
            {/* Terms and Conditions */}  
            <div className="flex items-start">  
              <input  
                type="checkbox"  
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black mt-1"  
                required  
              />  
              <label className="ml-2 text-sm text-[#484848] font-poppins">  
                I agree to the{' '}  
                <Link to="/terms" className="text-black hover:underline">  
                  Terms and Conditions  
                </Link>{' '}  
                and{' '}  
                <Link to="/privacy" className="text-black hover:underline">  
                  Privacy Policy  
                </Link>  
              </label>  
            </div>  
  
            {/* Submit Button */}  
            <button  
              type="submit"  
              className="w-full py-3 bg-black text-white font-poppins font-medium rounded-lg hover:bg-gray-800 transition-colors"  
            >  
              Create Account  
            </button>  
          </form>  
  
          {/* Sign In Link */}  
          <div className="text-center mt-6">  
            <p className="text-sm text-[#8a8a8a] font-poppins">  
              Already have an account?{' '}  
              <Link to="/login" className="text-black font-poppins font-medium hover:underline">  
                Sign in  
              </Link>  
            </p>  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
};  
  
export default Register;