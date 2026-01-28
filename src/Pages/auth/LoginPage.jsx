import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { authAPI } from "../../api/customerAPI";
import { useAuth } from "../../Context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
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
    if (!formData.username) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // Call login API - returns ApiResponse<LoginResponseDTO>
        const response = await authAPI.login(formData.username, formData.password);

        // Backend structure: { status, message, data: LoginResponseDTO }
        const userData = response.data.data;

        console.log('Login success:', userData); // Debug log

        // Store via AuthContext
        login(
          userData.token,           // accessToken
          userData.refreshToken,    // refreshToken
          {
            username: userData.username,
            email: userData.email,
            name: userData.name,
            roles: userData.roles || [],
            avatar: null,           // Backend không có avatar field
            oauthId: userData.oauthId
          }
        );

        // Navigate based on role
        if (userData.roles?.includes("ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/account");
        }

      } catch (error) {
        console.error("Login failed:", error);

        let errorMessage = "Invalid username or password";

        if (error.response) {
          const status = error.response.status;

          if (status === 401) {
            errorMessage = "Invalid username or password";
          } else if (status === 403) {
            errorMessage = "Account not verified. Please check your email.";
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.code === 'ERR_NETWORK') {
          errorMessage = "Network error. Please check your connection.";
        }

        setErrors({ submit: errorMessage });
      } finally {
        setIsLoading(false);
      }
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
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-neutral-400 text-sm" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className={`w-full pl-10 pr-3 py-2.5 border ${errors.username
                    ? "border-red-400 bg-red-50"
                    : "border-neutral-300 bg-white focus:border-neutral-900"
                    } focus:outline-none`}
                />
              </div>
              {errors.username && (
                <p className="text-red-600 text-xs mt-2">{errors.username}</p>
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
                  className={`w-full pl-10 pr-10 py-2.5 border ${errors.password
                    ? "border-red-400 bg-red-50"
                    : "border-neutral-300 bg-white focus:border-neutral-900"
                    } focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-sm" />
                  ) : (
                    <FaEye className="text-sm" />
                  )}
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

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                {errors.submit}
              </div>
            )}

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