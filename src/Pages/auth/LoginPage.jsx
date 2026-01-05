import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        console.log("Login data:", formData);
        alert("Login successful!");
        setIsLoading(false);
      }, 1500);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white border border-neutral-200 p-12">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-2xl font-medium text-neutral-900 mb-2">
              Sign in
            </h1>
            <p className="text-sm text-neutral-500">
              Enter your credentials to continue
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-neutral-400 text-sm" />
                </div>
                <input
                  type="email"
                  id="email"
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-neutral-400 text-sm" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
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

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 border-neutral-300 cursor-pointer"
                />
                <span className="ml-2 text-neutral-600">Remember me</span>
              </label>
              <a href="#" className="text-neutral-900 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-neutral-900 text-white py-2.5 font-medium hover:bg-neutral-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
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
            Don't have an account?{" "}
            <a href="/register" className="text-neutral-900 font-medium hover:underline">
              Create account
            </a>
          </p>
        </div>

        {/* Help Text */}
        <p className="text-center text-neutral-400 text-xs mt-6">
          By continuing, you agree to our{" "}
          <a href="#" className="underline">Terms</a> and{" "}
          <a href="#" className="underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;