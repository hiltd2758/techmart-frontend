import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaSave, FaUser, FaEnvelope, FaTrash, FaLock, FaHistory } from 'react-icons/fa'
import useAdminMeta from '../../../hooks/useAdminMeta';
import { customerAPI } from '../../../api/customerAPI';

const EditUser = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile')

  useAdminMeta(
    `Edit User ${id} - TechMart Admin`,
    `Edit user details for customer ${id} in TechMart platform`
  );

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',  // Dummy field for backend
  })

  // Load customer data
  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getCustomerById(id);
      const customer = response.data.data;
      
      setFormData({
        username: customer.username || '',
        name: customer.name || '',
        email: customer.email || '',
        password: 'dummy123',  // Backend yêu cầu password
      });
    } catch (error) {
      console.error('Error fetching customer:', error);
      alert('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await customerAPI.updateCustomer(id, formData);
      alert('Customer updated successfully!');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Failed to update customer');
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await customerAPI.deleteCustomer(id);
        alert('Customer deleted successfully!');
        navigate('/admin/users');
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer');
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading customer data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
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
                  User ID: {id}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
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

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">User Information</h2>
            
            <div className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                <FaSave size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditUser