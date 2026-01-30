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
    <div className="min-h-screen bg-neutral-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-end justify-between pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate('/admin/products')}
                className="p-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                <FaArrowLeft size={16} />
              </button>
              <h1 className="text-3xl font-light tracking-tight text-neutral-900">Edit Product</h1>
            </div>
            <p className="text-neutral-500 mt-1 text-sm font-mono">ID: {id}</p>
          </div>
          <button
            onClick={handleDelete}
            className="h-9 px-4 bg-red-600 text-white text-xs font-mono uppercase tracking-wider hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border border-neutral-200 flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-xs font-mono uppercase tracking-wider transition-colors border-r border-neutral-200 ${
                activeTab === tab.id 
                  ? 'bg-neutral-900 text-white' 
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="bg-white border border-neutral-200 p-6">
                <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-900 mb-6">Product Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900 text-sm"
                      >
                        <option value="laptops">Laptops</option>
                        <option value="phones">Phones</option>
                        <option value="tablets">Tablets</option>
                        <option value="accessories">Accessories</option>
                        <option value="audio">Audio</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                        Brand
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="text"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                        Dimensions (cm)
                      </label>
                      <input
                        type="text"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <>
                <div className="bg-white border border-neutral-200 p-6">
                  <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-900 mb-6">Pricing</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 p-6">
                  <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-900 mb-6">Inventory</h2>
                  
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900"
                      min="0"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="bg-white border border-neutral-200 p-6">
                <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-900 mb-6">Product Images</h2>
                
                {previewImage && (
                  <div className="mb-4">
                    <img 
                      src={previewImage} 
                      alt="Product" 
                      className="w-full h-64 object-cover border border-neutral-200 mb-3"
                    />
                  </div>
                )}

                <label className="block border border-dashed border-neutral-300 p-8 text-center hover:border-neutral-900 transition-colors cursor-pointer mb-4">
                  <FaUpload className="mx-auto text-2xl text-neutral-400 mb-3" />
                  <p className="text-neutral-600 text-sm">Upload image</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden" 
                  />
                </label>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-900 mb-4">Status</h2>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <p className="text-xs text-neutral-500 mt-3 font-mono">
                Current: <strong>{formData.status}</strong>
              </p>
            </div>

            {/* Actions */}
            <div className="bg-white border border-neutral-200 p-6 space-y-3">
              <button
                type="submit"
                className="w-full h-9 flex items-center justify-center gap-2 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                <FaSave size={12} />
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="w-full h-9 px-4 border border-neutral-200 text-neutral-700 text-xs font-mono uppercase tracking-wider hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProduct