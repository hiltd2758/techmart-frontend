import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaTimes,
} from "react-icons/fa";
import { customerAPI } from "../../api/customerAPI"; // Import API

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "", // Thêm username
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarContent, setSidebarContent] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    else if (formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await customerAPI.createGuestUser({
        username: formData.username,
        password: formData.password,
        name: formData.name,
        email: formData.email,
      });

      console.log("Registration successful:", response.data);
      // Save username to localStorage
      localStorage.setItem("username", formData.username);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);

      // Xử lý lỗi từ backend
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: "Registration failed. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
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
        <h3 className="text-lg font-medium text-neutral-900 mb-3">
          1. Account Terms
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          You must be 18 years or older to use this service. You are responsible
          for maintaining the security of your account and password. We cannot
          and will not be liable for any loss or damage from your failure to
          comply with this security obligation.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">
          2. Acceptable Use
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          You agree not to use the service for any unlawful purpose or to
          violate any laws. You must not transmit any worms, viruses, or any
          code of a destructive nature.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">
          3. Service Modifications
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          We reserve the right to modify or discontinue the service at any time
          without notice. We shall not be liable to you or any third party for
          any modification, suspension, or discontinuance of the service.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">
          4. Limitation of Liability
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          In no event shall we be liable for any indirect, incidental, special,
          or consequential damages arising out of or in connection with your use
          of the service.
        </p>
      </div>
    </div>
  );

  const privacyContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">
          Information We Collect
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          We collect information you provide directly to us, including your
          name, email address, and any other information you choose to provide
          when creating an account or using our services.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">
          How We Use Your Information
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          We use the information we collect to provide, maintain, and improve
          our services, to communicate with you, and to protect our users and
          services from fraud and abuse.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">
          Information Sharing
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          We do not share your personal information with third parties except as
          described in this policy. We may share information with service
          providers who assist us in operating our services.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">
          Data Security
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          We take reasonable measures to protect your information from
          unauthorized access, disclosure, or destruction. However, no security
          system is impenetrable.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3">
          Your Rights
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          You have the right to access, update, or delete your personal
          information at any time. Contact us if you wish to exercise these
          rights.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <div
        className={`flex-1 flex items-center justify-center px-4 py-8 transition-all ${showSidebar ? "mr-96" : ""}`}
      >
        <div className="w-full max-w-md">
          <div className="bg-white border border-neutral-200 p-12">
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
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-neutral-400 text-sm" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                    className={`w-full pl-10 pr-3 py-2.5 border ${
                      errors.username
                        ? "border-red-400 bg-red-50"
                        : "border-neutral-300 bg-white focus:border-neutral-900"
                    } focus:outline-none`}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-600 text-xs mt-2">{errors.username}</p>
                )}
              </div>

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
                    type={showPassword ? "text" : "password"}
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
                    type={showConfirmPassword ? "text" : "password"}
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
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-sm" />
                    ) : (
                      <FaEye className="text-sm" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs mt-2">
                    {errors.confirmPassword}
                  </p>
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
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => openSidebar("terms")}
                    className="text-neutral-900 font-medium hover:underline"
                  >
                    Terms and Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => openSidebar("privacy")}
                    className="text-neutral-900 font-medium hover:underline"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Error Message - THÊM MỚI */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-neutral-900 text-white py-2.5 font-medium hover:bg-neutral-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </div>

            <p className="text-center text-neutral-500 text-sm mt-8">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-neutral-900 font-medium hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-neutral-200 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-medium text-neutral-900">
              {sidebarContent === "terms"
                ? "Terms and Conditions"
                : "Privacy Policy"}
            </h2>
            <button
              onClick={closeSidebar}
              className="text-neutral-400 hover:text-neutral-700"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          <div className="px-6 py-8">
            <p className="text-xs text-neutral-500 mb-6">
              Last updated: January 5, 2026
            </p>
            {sidebarContent === "terms" ? termsContent : privacyContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
