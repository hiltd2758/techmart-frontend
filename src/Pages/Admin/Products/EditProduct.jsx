import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaSave, FaImage, FaTrash } from 'react-icons/fa'

const EditProduct = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [formData, setFormData] = useState({
    name: 'MacBook Pro 16" M3 Max',
    category: 'laptops',
    brand: 'Apple',
    price: '5499',
    stock: '15',
    description: 'Apple M3 Max chip, 36GB RAM, 1TB SSD',
    status: 'Active'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Update product:', id, formData)
    // TODO: Call API
    navigate('/admin/products')
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this product?')) {
      console.log('Delete product:', id)
      navigate('/admin/products')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-500 mt-1">Update product information</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaTrash />
          Delete
        </button>
      </div>

      {/* Same form as AddProduct but with populated data */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="laptops">Laptops</option>
                    <option value="smartphones">Smartphones</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FaSave />
              Update Product
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditProduct