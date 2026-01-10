// EditUser.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaSave, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShieldAlt, FaTrash, FaLock, FaHistory } from 'react-icons/fa'

const EditUser = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('profile')

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    
    // Address
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    
    // Account Settings
    role: 'Customer',
    status: 'Active',
    emailVerified: true,
    twoFactorEnabled: false,
    
    // Stats
    joinDate: '2023-08-15',
    lastLogin: '2024-01-09',
    totalOrders: 12,
    totalSpent: '$3,450.00'
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'security', label: 'Security', icon: FaShieldAlt },
    { id: 'activity', label: 'Activity', icon: FaHistory },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Update user:', id, formData)
    // TODO: Call API
    navigate('/admin/users')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      console.log('Delete user:', id)
      navigate('/admin/users')
    }
  }

  const handleResetPassword = () => {
    if (confirm('Send password reset email to this user?')) {
      console.log('Send password reset email')
      // TODO: Call API
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/users')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  User ID: {id} • Last updated: 2 hours ago
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetPassword}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              >
                <FaLock size={14} />
                Reset Password
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                <FaTrash size={14} />
                Delete User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-[73px] z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all relative
                  ${activeTab === tab.id 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
                `}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <>
                  {/* Personal Information */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                      <span className="text-xs text-gray-500">Required fields *</span>
                    </div>
                    
                    <div className="space-y-5">
                      {/* Name */}
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            placeholder="Enter first name"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder="Enter last name"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              placeholder="user@example.com"
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                          </div>
                          {formData.emailVerified && (
                            <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Verified
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+1 (555) 000-0000"
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">Address Information</h2>
                    
                    <div className="space-y-5">
                      {/* Street Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" size={14} />
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Main Street"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      {/* City, State, ZIP */}
                      <div className="grid sm:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="New York"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="NY"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            placeholder="10001"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                          <option>Australia</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">Account Security</h2>
                    
                    <div className="space-y-5">
                      {/* Password Section */}
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Password</h3>
                            <p className="text-sm text-gray-500 mt-1">Last changed 30 days ago</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleResetPassword}
                            className="px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                          >
                            Reset Password
                          </button>
                        </div>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {formData.twoFactorEnabled ? 'Enabled' : 'Add an extra layer of security'}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              name="twoFactorEnabled"
                              checked={formData.twoFactorEnabled}
                              onChange={handleChange}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>

                      {/* Email Verification */}
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Email Verification</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {formData.emailVerified ? 'Email verified' : 'Email not verified'}
                            </p>
                          </div>
                          <span className={`
                            inline-flex px-3 py-1 text-xs font-medium rounded-full
                            ${formData.emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                          `}>
                            {formData.emailVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Session Management */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">Active Sessions</h2>
                    
                    <div className="space-y-3">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Chrome on Windows</p>
                            <p className="text-sm text-gray-500 mt-1">New York, US • Active now</p>
                          </div>
                          <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            Current
                          </span>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Safari on iPhone</p>
                            <p className="text-sm text-gray-500 mt-1">Los Angeles, US • 2 hours ago</p>
                          </div>
                          <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                            Revoke
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">Recent Activity</h2>
                    
                    <div className="space-y-4">
                      {[
                        { action: 'Placed order #12345', time: '2 hours ago', type: 'order' },
                        { action: 'Updated profile information', time: '1 day ago', type: 'profile' },
                        { action: 'Changed password', time: '3 days ago', type: 'security' },
                        { action: 'Placed order #12344', time: '5 days ago', type: 'order' },
                        { action: 'Logged in from new device', time: '1 week ago', type: 'security' },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                            ${activity.type === 'order' ? 'bg-blue-100 text-blue-600' : 
                              activity.type === 'security' ? 'bg-purple-100 text-purple-600' : 
                              'bg-green-100 text-green-600'}
                          `}>
                            <FaHistory size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">Login History</h2>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Location</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Device</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">IP Address</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            { date: '2024-01-09 14:30', location: 'New York, US', device: 'Chrome on Windows', ip: '192.168.1.1' },
                            { date: '2024-01-08 09:15', location: 'New York, US', device: 'Safari on iPhone', ip: '192.168.1.2' },
                            { date: '2024-01-07 18:45', location: 'New York, US', device: 'Chrome on Windows', ip: '192.168.1.1' },
                          ].map((login, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm text-gray-900">{login.date}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{login.location}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{login.device}</td>
                              <td className="py-3 px-4 text-sm text-gray-600 font-mono">{login.ip}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">Account Status</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="Customer">Customer</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Current Status:</span>
                      <span className={`
                        inline-flex px-3 py-1 text-xs font-medium rounded-full
                        ${formData.status === 'Active' ? 'bg-green-100 text-green-700' : 
                          formData.status === 'Inactive' ? 'bg-gray-100 text-gray-700' : 
                          'bg-red-100 text-red-700'}
                      `}>
                        {formData.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">User Statistics</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Orders</span>
                    <span className="font-semibold text-gray-900">{formData.totalOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Spent</span>
                    <span className="font-semibold text-gray-900">{formData.totalSpent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="font-semibold text-gray-900">{formData.joinDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Login</span>
                    <span className="font-semibold text-gray-900">{formData.lastLogin}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">Quick Actions</h2>
                
                <div className="space-y-2">
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    View Orders
                  </button>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Send Password Reset
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Send Email
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={handleDelete}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <FaHistory size={14} />
              <span>Last saved: 2 hours ago</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              >
                <FaSave size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditUser