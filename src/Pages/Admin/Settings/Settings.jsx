import { useState } from "react";
import {
  FaUser,
  FaLock,
  FaShieldAlt,
  FaSlidersH as FaSliders,
  FaBell,
  FaPlug as FaPlugCircle,
  FaCheck,
  FaEdit,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaPlus,
  FaSave,
  FaUndo,
} from "react-icons/fa";
import useAdminMeta from '../../../hooks/useAdminMeta';


const Settings = () => {
  useAdminMeta(
    'Settings - TechMart Admin',
    'Configure TechMart admin settings. Manage profile, security, preferences, notifications, and integrations'
  );
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Profile Form State
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Administrator",
    email: "admin@techmart.com",
    phone: "+1 (555) 123-4567",
    company: "TechMart Admin",
    position: "System Administrator",
  });

  // Security Form State
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    orderNotifications: true,
    emailDigest: true,
    securityAlerts: true,
    weeklyReport: false,
    productUpdates: true,
    systemUpdates: true,
  });

  // System Preferences
  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    timezone: "UTC-5",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    itemsPerPage: 20,
  });

  // Roles and Permissions
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Administrator",
      description: "Full system access",
      users: 2,
      permissions: [
        "users.manage",
        "products.manage",
        "orders.manage",
        "settings.manage",
      ],
      status: "Active",
    },
    {
      id: 2,
      name: "Manager",
      description: "Limited admin access",
      users: 5,
      permissions: ["products.view", "orders.manage", "users.view"],
      status: "Active",
    },
    {
      id: 3,
      name: "Viewer",
      description: "Read-only access",
      users: 8,
      permissions: ["products.view", "orders.view", "users.view"],
      status: "Active",
    },
  ]);

  // Integrations
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: "Stripe Payment",
      description: "Payment processing integration",
      status: "Connected",
      icon: "💳",
      lastSync: "2024-01-04 14:32 UTC",
    },
    {
      id: 2,
      name: "SendGrid Email",
      description: "Email delivery service",
      status: "Connected",
      icon: "✉️",
      lastSync: "2024-01-04 12:15 UTC",
    },
    {
      id: 3,
      name: "Google Analytics",
      description: "Analytics tracking",
      status: "Disconnected",
      icon: "📊",
      lastSync: "Never",
    },
    {
      id: 4,
      name: "AWS S3",
      description: "Cloud storage",
      status: "Connected",
      icon: "☁️",
      lastSync: "2024-01-04 10:45 UTC",
    },
  ]);

  // API Keys
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: "Production API Key",
      key: "sk_live_51234567890abcdef",
      created: "2023-12-01",
      lastUsed: "2024-01-04",
      status: "Active",
    },
    {
      id: 2,
      name: "Development API Key",
      key: "sk_test_0987654321fedcba",
      created: "2023-11-15",
      lastUsed: "2024-01-03",
      status: "Active",
    },
  ]);

  // Handlers
  const handleProfileChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleSecurityChange = (field, value) => {
    setSecurityData({ ...securityData, [field]: value });
  };

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences({ ...preferences, [field]: value });
  };

  const handleSaveProfile = () => {
    // Validation
    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
      setFormErrors({ submit: "Please fill in all required fields" });
      return;
    }
    setFormErrors({});
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setEditMode(false);
  };

  const handleChangePassword = () => {
    const errors = {};
    if (!securityData.currentPassword) errors.currentPassword = "Required";
    if (!securityData.newPassword) errors.newPassword = "Required";
    if (securityData.newPassword !== securityData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (securityData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setSecurityData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const maskApiKey = (key) => {
    const visible = key.substring(0, 10);
    return visible + "*".repeat(key.length - 10);
  };

  const tabs = [
    { id: "profile", label: "Account Profile", icon: FaUser },
    { id: "security", label: "Security", icon: FaLock },
    { id: "roles", label: "Roles & Permissions", icon: FaShieldAlt },
    { id: "preferences", label: "System Preferences", icon: FaSliders },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "integrations", label: "Integrations", icon: FaPlugCircle },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-end justify-between pb-6 border-b border-neutral-200">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-neutral-900">Settings</h1>
            <p className="text-neutral-500 mt-1 text-sm font-mono">Manage your account and system configurations</p>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200">
            <FaCheck className="text-green-600" />
            <p className="text-green-700 font-medium">
              Changes saved successfully
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <nav className="flex flex-col">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-3 px-6 py-4 text-sm font-medium
                        border-b border-neutral-200 last:border-b-0
                        transition-all duration-200
                        ${
                          activeTab === tab.id
                            ? "bg-neutral-100 text-neutral-900 border-l-4 border-l-neutral-900 pl-5"
                            : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                        }
                      `}
                    >
                      <IconComponent
                        className={`text-lg ${
                          activeTab === tab.id ? "text-neutral-900" : "text-neutral-400"
                        }`}
                      />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Account Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white border border-neutral-200 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-light tracking-tight text-neutral-900">
                  Account Profile
                </h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`
                    flex items-center gap-2 px-4 py-2 font-medium transition-colors text-xs
                    ${
                      editMode
                        ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                        : "bg-neutral-900 text-white hover:bg-neutral-800"
                    }
                  `}
                >
                  {editMode ? (
                    <>
                      <FaTimes size={16} />
                      Cancel
                    </>
                  ) : (
                    <>
                      <FaEdit size={16} />
                      Edit
                    </>
                  )}
                </button>
              </div>

              {/* Profile Avatar */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-neutral-500 to-neutral-600 flex items-center justify-center text-white text-3xl font-bold">
                  {profileData.firstName.charAt(0)}
                  {profileData.lastName.charAt(0)}
                </div>
                {editMode && (
                  <button className="px-4 py-2 border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-colors text-xs">
                    Change Avatar
                  </button>
                )}
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) =>
                      handleProfileChange("firstName", e.target.value)
                    }
                    disabled={!editMode}
                    className={`
                      w-full px-4 py-2 border transition-all
                      ${
                        editMode
                          ? "border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                          : "border-neutral-200 bg-neutral-50 cursor-not-allowed"
                      }
                    `}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) =>
                      handleProfileChange("lastName", e.target.value)
                    }
                    disabled={!editMode}
                    className={`
                      w-full px-4 py-2 border transition-all
                      ${
                        editMode
                          ? "border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                          : "border-neutral-200 bg-neutral-50 cursor-not-allowed"
                      }
                    `}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      handleProfileChange("email", e.target.value)
                    }
                    disabled={!editMode}
                    className={`
                      w-full px-4 py-2 border transition-all
                      ${
                        editMode
                          ? "border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                          : "border-neutral-200 bg-neutral-50 cursor-not-allowed"
                      }
                    `}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      handleProfileChange("phone", e.target.value)
                    }
                    disabled={!editMode}
                    className={`
                      w-full px-4 py-2 border transition-all
                      ${
                        editMode
                          ? "border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                          : "border-neutral-200 bg-neutral-50 cursor-not-allowed"
                      }
                    `}
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) =>
                      handleProfileChange("company", e.target.value)
                    }
                    disabled={!editMode}
                    className={`
                      w-full px-4 py-2 border transition-all
                      ${
                        editMode
                          ? "border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                          : "border-neutral-200 bg-neutral-50 cursor-not-allowed"
                      }
                    `}
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={profileData.position}
                    onChange={(e) =>
                      handleProfileChange("position", e.target.value)
                    }
                    disabled={!editMode}
                    className={`
                      w-full px-4 py-2 border transition-all
                      ${
                        editMode
                          ? "border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                          : "border-neutral-200 bg-neutral-50 cursor-not-allowed"
                      }
                    `}
                  />
                </div>
              </div>

              {/* Error Message */}
              {formErrors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700">
                  {formErrors.submit}
                </div>
              )}

              {/* Action Buttons */}
              {editMode && (
                <div className="flex gap-3 pt-4 border-t border-neutral-200">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-6 py-2 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors text-xs"
                  >
                    <FaSave size={16} />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center gap-2 px-6 py-2 border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-colors text-xs"
                  >
                    <FaUndo size={16} />
                    Reset
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Change Password */}
              <div className="bg-white border border-neutral-200 p-6 space-y-6">
                <h2 className="text-xl font-light tracking-tight text-neutral-900">
                  Change Password
                </h2>

                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={securityData.currentPassword}
                      onChange={(e) =>
                        handleSecurityChange("currentPassword", e.target.value)
                      }
                      className={`
                        w-full px-4 py-2 pr-10 border transition-all
                        ${
                          formErrors.currentPassword
                            ? "border-red-300 focus:ring-2 focus:ring-red-500"
                            : "border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                        }
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {formErrors.currentPassword && (
                    <p className="text-red-600 text-sm mt-1">
                      {formErrors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    New Password *
                  </label>
                  <input
                    type="password"
                    value={securityData.newPassword}
                    onChange={(e) =>
                      handleSecurityChange("newPassword", e.target.value)
                    }
                    className={`
                      w-full px-4 py-2 border transition-all
                      ${
                        formErrors.newPassword
                          ? "border-red-300 focus:ring-2 focus:ring-red-500"
                          : "border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                      }
                    `}
                  />
                  {formErrors.newPassword && (
                    <p className="text-red-600 text-sm mt-1">
                      {formErrors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={securityData.confirmPassword}
                      onChange={(e) =>
                        handleSecurityChange("confirmPassword", e.target.value)
                      }
                      className={`
                        w-full px-4 py-2 pr-10 border transition-all
                        ${
                          formErrors.confirmPassword
                            ? "border-red-300 focus:ring-2 focus:ring-red-500"
                            : "border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                        }
                      `}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-neutral-200">
                  <button
                    onClick={handleChangePassword}
                    className="flex items-center gap-2 px-6 py-2 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors text-xs"
                  >
                    <FaSave size={16} />
                    Update Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-white border border-neutral-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-light tracking-tight text-neutral-900">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors text-xs">
                    Enable 2FA
                  </button>
                </div>
              </div>

              {/* Login History */}
              <div className="bg-white border border-neutral-200 p-6 space-y-4">
                <h3 className="text-lg font-light tracking-tight text-neutral-900">
                  Recent Login Activity
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      device: "Chrome on Windows",
                      location: "New York, USA",
                      date: "2024-01-04 14:32 UTC",
                    },
                    {
                      device: "Safari on MacOS",
                      location: "New York, USA",
                      date: "2024-01-04 09:15 UTC",
                    },
                    {
                      device: "Chrome on Windows",
                      location: "New York, USA",
                      date: "2024-01-03 16:45 UTC",
                    },
                  ].map((login, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-100"
                    >
                      <div>
                        <p className="font-medium text-neutral-900">
                          {login.device}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {login.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-neutral-700">
                          {login.date}
                        </p>
                        <p className="text-xs text-green-600">Current</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Roles & Permissions Tab */}
          {activeTab === "roles" && (
            <div className="bg-white border border-neutral-200 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-light tracking-tight text-neutral-900">
                  Roles & Permissions
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors text-xs">
                  <FaPlus size={16} />
                  New Role
                </button>
              </div>

              <div className="space-y-4">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="border border-neutral-200 p-6 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-light tracking-tight text-neutral-900">
                          {role.name}
                        </h3>
                        <p className="text-sm text-neutral-600 mt-1">
                          {role.description}
                        </p>
                      </div>
                      <span
                        className={`
                        px-3 py-1 text-xs font-medium
                        ${
                          role.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-neutral-100 text-neutral-700"
                        }
                      `}
                      >
                        {role.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-mono uppercase tracking-wider text-neutral-600">
                          Users
                        </p>
                        <p className="text-2xl font-light text-neutral-900 mt-1">
                          {role.users}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-mono uppercase tracking-wider text-neutral-600">
                          Permissions
                        </p>
                        <p className="text-2xl font-light text-neutral-900 mt-1">
                          {role.permissions.length}
                        </p>
                      </div>
                      <div className="text-right">
                        <button className="px-4 py-2 border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-colors text-xs">
                          Edit Role
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-200">
                      <p className="text-xs font-mono uppercase tracking-wider text-neutral-600 mb-3">
                        Permissions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((perm, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-neutral-50 text-neutral-700 text-xs font-medium border border-neutral-200"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="bg-white border border-neutral-200 p-6 space-y-6">
              <h2 className="text-xl font-light tracking-tight text-neutral-900">
                System Preferences
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={preferences.theme}
                    onChange={(e) =>
                      handlePreferenceChange("theme", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Language
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) =>
                      handlePreferenceChange("language", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) =>
                      handlePreferenceChange("timezone", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  >
                    <option value="UTC-8">UTC-8 (PST)</option>
                    <option value="UTC-5">UTC-5 (EST)</option>
                    <option value="UTC+0">UTC+0 (GMT)</option>
                    <option value="UTC+1">UTC+1 (CET)</option>
                  </select>
                </div>

                {/* Date Format */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date Format
                  </label>
                  <select
                    value={preferences.dateFormat}
                    onChange={(e) =>
                      handlePreferenceChange("dateFormat", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                {/* Time Format */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Time Format
                  </label>
                  <select
                    value={preferences.timeFormat}
                    onChange={(e) =>
                      handlePreferenceChange("timeFormat", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  >
                    <option value="12h">12-Hour (AM/PM)</option>
                    <option value="24h">24-Hour</option>
                  </select>
                </div>

                {/* Items Per Page */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Items Per Page
                  </label>
                  <select
                    value={preferences.itemsPerPage}
                    onChange={(e) =>
                      handlePreferenceChange(
                        "itemsPerPage",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2 border border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-neutral-200">
                <button className="flex items-center gap-2 px-6 py-2 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors text-xs">
                  <FaSave size={16} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="bg-white border border-neutral-200 p-6 space-y-4">
                <h2 className="text-xl font-light tracking-tight text-neutral-900">
                  Email Notifications
                </h2>

                {[
                  {
                    key: "orderNotifications",
                    label: "New Orders",
                    description: "Get notified when a new order is placed",
                  },
                  {
                    key: "emailDigest",
                    label: "Daily Digest",
                    description: "Receive a summary of daily activity",
                  },
                  {
                    key: "securityAlerts",
                    label: "Security Alerts",
                    description: "Important security notifications",
                  },
                  {
                    key: "weeklyReport",
                    label: "Weekly Reports",
                    description: "Weekly business performance reports",
                  },
                  {
                    key: "productUpdates",
                    label: "Product Updates",
                    description: "New product and inventory updates",
                  },
                  {
                    key: "systemUpdates",
                    label: "System Updates",
                    description: "Important system maintenance notices",
                  },
                ].map((notif) => (
                  <div
                    key={notif.key}
                    className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-100"
                  >
                    <div>
                      <p className="font-medium text-neutral-900">{notif.label}</p>
                      <p className="text-sm text-neutral-600 mt-1">
                        {notif.description}
                      </p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[notif.key]}
                        onChange={() => handleNotificationChange(notif.key)}
                        className="w-5 h-5 text-neutral-900 focus:ring-2 focus:ring-neutral-500"
                      />
                    </label>
                  </div>
                ))}
              </div>

              {/* Notification Frequency */}
              <div className="bg-white border border-neutral-200 p-6 space-y-4">
                <h2 className="text-xl font-light tracking-tight text-neutral-900">
                  Notification Frequency
                </h2>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    How often would you like to receive notifications?
                  </label>
                  <select className="w-full px-4 py-2 border border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-transparent">
                    <option>Instantly</option>
                    <option>Hourly</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-2 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors text-xs">
                  <FaSave size={16} />
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === "integrations" && (
            <div className="space-y-6">
              {/* Available Integrations */}
              <div>
                <h2 className="text-xl font-light tracking-tight text-neutral-900 mb-6">
                  Integrations
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {integrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="bg-white border border-neutral-200 p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-16 h-16 bg-neutral-100 flex items-center justify-center text-2xl">
                            {integration.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-light tracking-tight text-neutral-900">
                                {integration.name}
                              </h3>
                              <span
                                className={`
                                px-3 py-1 text-xs font-medium
                                ${
                                  integration.status === "Connected"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-neutral-100 text-neutral-700"
                                }
                              `}
                              >
                                {integration.status}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600">
                              {integration.description}
                            </p>
                            <p className="text-xs text-neutral-500 mt-2">
                              Last sync: {integration.lastSync}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {integration.status === "Connected" ? (
                            <>
                              <button className="px-4 py-2 border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-colors text-xs">
                                Settings
                              </button>
                              <button className="px-4 py-2 border border-red-300 text-red-700 font-medium hover:bg-red-50 transition-colors text-xs">
                                Disconnect
                              </button>
                            </>
                          ) : (
                            <button className="px-4 py-2 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors text-xs">
                              Connect
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Keys */}
              <div className="bg-white border border-neutral-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-light tracking-tight text-neutral-900">
                    API Keys
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors text-xs">
                    <FaPlus size={16} />
                    Generate Key
                  </button>
                </div>

                <div className="space-y-3">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-100"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">{key.name}</p>
                        <p className="text-sm text-neutral-500 font-mono mt-1">
                          {maskApiKey(key.key)}
                        </p>
                        <div className="flex gap-4 text-xs text-neutral-500 mt-2">
                          <span>Created: {key.created}</span>
                          <span>Last used: {key.lastUsed}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700">
                          {key.status}
                        </span>
                        <button className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Settings;
