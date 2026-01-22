import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaSave, FaImage, FaTrash, FaTimes, FaUpload, FaInfoCircle, FaDollarSign, FaEye, FaHistory } from 'react-icons/fa'

const EditProduct = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('details')
  
  const [formData, setFormData] = useState({
    name: 'MacBook Pro 16" M3 Max',
    category: 'laptops',
    brand: 'Apple',
    price: '5499',
    stock: '15',
    description: 'Apple M3 Max chip, 36GB RAM, 1TB SSD',
    status: 'Active',
    sku: 'MBP-M3-16-2024',
    weight: '2.1',
    dimensions: '35.57 x 24.81 x 1.68 cm'
  })

  const [previewImage, setPreviewImage] = useState('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400')

  const tabs = [
    { id: 'details', label: 'Product Details', icon: FaInfoCircle },
    { id: 'pricing', label: 'Pricing & Inventory', icon: FaDollarSign },
    { id: 'media', label: 'Media', icon: FaImage },
  ]

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/products')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-sm text-gray-500 mt-0.5">ID: {id} • Last updated: 2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                <FaEye size={14} />
                Preview
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                <FaTrash size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
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
              {/* Product Details Tab */}
              {activeTab === 'details' && (
                <>
                  {/* Basic Information */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                      <span className="text-xs text-gray-500">Required fields *</span>
                    </div>
                    
                    <div className="space-y-5">
                      {/* Product Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter product name"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <p className="mt-1.5 text-xs text-gray-500">A clear, descriptive name for your product</p>
                      </div>

                      {/* Category & Brand */}
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            <option value="">Select category</option>
                            <option value="laptops">Laptops</option>
                            <option value="phones">Phones</option>
                            <option value="tablets">Tablets</option>
                            <option value="accessories">Accessories</option>
                            <option value="audio">Audio</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Brand <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Apple, Samsung"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      {/* SKU */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SKU (Stock Keeping Unit)
                        </label>
                        <input
                          type="text"
                          name="sku"
                          value={formData.sku}
                          onChange={handleChange}
                          placeholder="e.g., MBP-M3-16-2024"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <p className="mt-1.5 text-xs text-gray-500">Unique identifier for inventory tracking</p>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="5"
                          placeholder="Describe your product features, specifications, and benefits..."
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        />
                        <p className="mt-1.5 text-xs text-gray-500">Provide detailed information about the product</p>
                      </div>
                    </div>
                  </div>

                  {/* Product Specifications */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">Specifications</h2>
                    
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight (kg)
                        </label>
                        <input
                          type="text"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          placeholder="e.g., 2.1"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dimensions
                        </label>
                        <input
                          type="text"
                          name="dimensions"
                          value={formData.dimensions}
                          onChange={handleChange}
                          placeholder="L x W x H (cm)"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Pricing & Inventory Tab */}
              {activeTab === 'pricing' && (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">Pricing</h2>
                    
                    <div className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                            <input
                              type="number"
                              name="price"
                              value={formData.price}
                              onChange={handleChange}
                              required
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                          </div>
                          <p className="mt-1.5 text-xs text-gray-500">Regular selling price</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Compare at Price
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                            <input
                              type="number"
                              name="comparePrice"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                          </div>
                          <p className="mt-1.5 text-xs text-gray-500">Show original price for discounts</p>
                        </div>
                      </div>

                      {/* Price Preview */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900 font-medium mb-1">Price Preview</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-blue-600">${formData.price}</span>
                          <span className="text-sm text-blue-600">USD</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">Inventory</h2>
                    
                    <div className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock Quantity <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            min="0"
                            placeholder="0"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                          <p className="mt-1.5 text-xs text-gray-500">Current available quantity</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Low Stock Alert
                          </label>
                          <input
                            type="number"
                            name="lowStockThreshold"
                            placeholder="5"
                            min="0"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                          <p className="mt-1.5 text-xs text-gray-500">Alert when stock falls below</p>
                        </div>
                      </div>

                      {/* Stock Status */}
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Stock Status</span>
                          <span className={`
                            inline-flex px-3 py-1 text-xs font-medium rounded-full
                            ${formData.stock > 10 ? 'bg-green-100 text-green-700' : 
                              formData.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-red-100 text-red-700'}
                          `}>
                            {formData.stock > 10 ? 'In Stock' : formData.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              formData.stock > 10 ? 'bg-green-500' : 
                              formData.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min((formData.stock / 20) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-5">Product Images</h2>
                  
                  {/* Image Preview Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    {previewImage && (
                      <div className="relative group aspect-square">
                        <div className="rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 h-full">
                          <img 
                            src={previewImage} 
                            alt="Product" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewImage(null)}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        >
                          <FaTimes size={12} />
                        </button>
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                          Primary
                        </div>
                      </div>
                    )}

                    {/* Upload Placeholder */}
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                      <FaUpload className="text-gray-400 mb-2" size={24} />
                      <span className="text-sm font-medium text-gray-600">Add Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden" 
                      />
                    </label>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Image guidelines:</strong> Upload high-quality images (PNG, JPG up to 5MB). 
                      First image will be used as the primary product image.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Product Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">Publish Status</h2>
                
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
                    <option value="Draft">Draft</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                  <p className="mt-1.5 text-xs text-gray-500">Control product visibility</p>
                </div>

                <div className="mt-4 p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Status:</span>
                    <span className={`
                      inline-flex px-3 py-1 text-xs font-medium rounded-full
                      ${formData.status === 'Active' ? 'bg-green-100 text-green-700' : 
                        formData.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'}
                    `}>
                      {formData.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">Quick Stats</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Sales</span>
                    <span className="font-semibold text-gray-900">156 units</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="font-semibold text-gray-900">$857,844</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Views</span>
                    <span className="font-semibold text-gray-900">2,847</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="bg-white border-t border-gray-200 shadow-lg mt-6">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <FaHistory size={14} />
                <span>Last saved: 2 hours ago</span>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                >
                  <FaSave size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditProduct