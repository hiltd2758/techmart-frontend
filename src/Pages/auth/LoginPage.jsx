import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← THÊM
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const navigate = useNavigate(); // ← THÊM
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
        const username = formData.email.split('@')[0];
        localStorage.setItem("username", username);
        setIsLoading(false);
        navigate('/account'); // ← THAY THẾ alert()
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