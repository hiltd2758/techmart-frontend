import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaSave, FaImage, FaTimes } from 'react-icons/fa'
import useAdminMeta from '../../../hooks/useAdminMeta'

const API_BASE_URL = 'http://localhost:8080/api/v1'

const AddProduct = () => {
  const navigate = useNavigate()
  useAdminMeta(
    'Add New Product - TechMart Admin',
    'Add new products to TechMart inventory. Configure product details, pricing, and specifications'
  );

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryIds: [],
    brandId: '',
    price: '',
    cost: '',
    stockQuantity: '',
    description: '',
    status: 'draft',
    attributes: []
  })

  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [attributes, setAttributes] = useState([])
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [uploadingImage, setUploadingImage] = useState(false)

  // Load dropdowns and attributes on mount
  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      try {
        const token = localStorage.getItem('accessToken')
        
        if (!token) {
          console.error('No access token found')
          navigate('/admin/login')
          return
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }

        const [categoriesRes, brandsRes, attributesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/categories`, { headers }),
          fetch(`${API_BASE_URL}/brands`, { headers }),
          fetch(`${API_BASE_URL}/products/attributes`, { headers })
        ])

        // Categories - pagination response
        if (categoriesRes.ok) {
          const result = await categoriesRes.json()
          console.log('Categories response:', result)
          setCategories(result.data?.content || [])
        } else {
          console.error('Categories fetch failed:', categoriesRes.status)
          setCategories([])
        }
        
        // Brands - pagination response
        if (brandsRes.ok) {
          const result = await brandsRes.json()
          console.log('Brands response:', result)
          setBrands(result.data?.content || [])
        } else {
          console.error('Brands fetch failed:', brandsRes.status)
          setBrands([])
        }
        
        // Attributes
        if (attributesRes.ok) {
          const result = await attributesRes.json()
          console.log('Attributes response:', result)
          setAttributes(result.data?.content || result.data || [])
        } else {
          console.error('Attributes fetch failed:', attributesRes.status)
          setAttributes([])
        }
      } catch (error) {
        console.error('Error loading data:', error)
        setCategories([])
        setBrands([])
        setAttributes([])
      } finally {
        setDataLoading(false)
      }
    }

    loadData()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...formData.attributes]
    newAttributes[index][field] = value
    setFormData({ ...formData, attributes: newAttributes })
  }

  const addAttribute = () => {
    setFormData({
      ...formData,
      attributes: [...formData.attributes, { attributeId: '', value: '' }]
    })
  }

  const removeAttribute = (index) => {
    setFormData({
      ...formData,
      attributes: formData.attributes.filter((_, i) => i !== index)
    })
  }

const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files)
  setUploadingImage(true)
  
  try {
    const token = localStorage.getItem('accessToken')

    for (const file of files) {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      // ✅ Upload qua backend
      const response = await fetch(`${API_BASE_URL}/products/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Image uploaded:', result)
        
        setImages(prev => [...prev, {
          imageUrl: result.data.imageUrl, // ✅ URL từ Cloudinary
          cloudinaryPublicId: result.data.cloudinaryPublicId,
          altText: file.name,
          isPrimary: prev.length === 0,
          displayOrder: prev.length
        }])
      } else {
        console.error('Image upload failed:', response.statusText)
        setErrors({ ...errors, images: 'Failed to upload image' })
      }
    }
  } catch (error) {
    console.error('Image upload error:', error)
    setErrors({ ...errors, images: 'Failed to upload image' })
  } finally {
    setUploadingImage(false)
  }
}

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  setErrors({})
  setLoading(true)

  try {
    const token = localStorage.getItem('accessToken')
    
    const productData = {
      name: formData.name,
      sku: formData.sku.toUpperCase(),
      price: parseFloat(formData.price),
      cost: formData.cost ? parseFloat(formData.cost) : null,
      description: formData.description,
      stockQuantity: parseInt(formData.stockQuantity) || 0,
      isPublished: formData.status === 'published' || formData.status === 'featured',
      isFeatured: formData.status === 'featured',
      brandId: formData.brandId ? parseInt(formData.brandId) : null,
      categoryIds: formData.categoryIds,
      attributes: formData.attributes.map(attr => ({
        attributeId: parseInt(attr.attributeId),
        value: attr.value
      })),
      images: images.map(img => ({ // ✅ Gửi images với URL từ Cloudinary
        imageUrl: img.imageUrl,
        cloudinaryPublicId: img.cloudinaryPublicId,
        altText: img.altText,
        isPrimary: img.isPrimary,
        displayOrder: img.displayOrder
      }))
    }

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })

    const result = await response.json()

    if (!response.ok) {
      setErrors(result.message || 'Failed to create product')
      return
    }

    navigate('/admin/products', { state: { message: 'Product created successfully' } })
  } catch (error) {
    setErrors({ submit: error.message })
  } finally {
    setLoading(false)
  }
}

  // Loading state
  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories, brands and attributes...</p>
        </div>
      </div>
    )
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
              <h1 className="text-3xl font-light tracking-tight text-neutral-900">Add New Product</h1>
            </div>
            <p className="text-neutral-500 mt-1 text-sm font-mono">Create a new product in your inventory</p>
          </div>
        </div>

        {/* Error Alert */}
        {typeof errors === 'string' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs">
            {errors}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-900 mb-6">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900"
                    placeholder="e.g. PROD-001"
                    pattern="[A-Z0-9\-]{6,20}"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Categories - Checkboxes */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                      Categories *
                    </label>
                    <div className="border border-neutral-200 p-3 max-h-40 overflow-y-auto space-y-2">
                      {Array.isArray(categories) && categories.length > 0 ? (
                        categories.map(cat => (
                          <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-1 rounded text-sm">
                            <input
                              type="checkbox"
                              value={cat.id}
                              checked={formData.categoryIds.includes(cat.id)}
                              onChange={(e) => {
                                const value = parseInt(e.target.value)
                                const newCategoryIds = e.target.checked
                                  ? [...formData.categoryIds, value]
                                  : formData.categoryIds.filter(id => id !== value)
                                setFormData({ ...formData, categoryIds: newCategoryIds })
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-neutral-700">{cat.name}</span>
                          </label>
                        ))
                      ) : (
                        <p className="text-xs text-neutral-500">No categories available</p>
                      )}
                    </div>
                  </div>

                  {/* Brands - Radio buttons */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                      Brand
                    </label>
                    <div className="border border-neutral-200 p-3 max-h-40 overflow-y-auto space-y-2">
                      {Array.isArray(brands) && brands.length > 0 ? (
                        <>
                          <label className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-1 rounded text-sm">
                            <input
                              type="radio"
                              name="brandId"
                              value=""
                              checked={formData.brandId === ''}
                              onChange={handleChange}
                              className="w-4 h-4"
                            />
                            <span className="text-neutral-500 italic">No brand</span>
                          </label>
                          {brands.map(brand => (
                            <label key={brand.id} className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-1 rounded text-sm">
                              <input
                                type="radio"
                                name="brandId"
                                value={brand.id}
                                checked={formData.brandId === brand.id.toString()}
                                onChange={handleChange}
                                className="w-4 h-4"
                              />
                              <span className="text-neutral-700">{brand.name}</span>
                            </label>
                          ))}
                        </>
                      ) : (
                        <p className="text-xs text-neutral-500">No brands available</p>
                      )}
                    </div>
                  </div>
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
                    placeholder="Enter product description"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-900 mb-6">Pricing & Inventory</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Attributes */}
            <div className="bg-white border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-900">Attributes</h2>
                <button
                  type="button"
                  onClick={addAttribute}
                  className="h-8 px-3 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-3">
                {formData.attributes.map((attr, index) => (
                  <div key={index} className="flex gap-2">
                    <select
                      value={attr.attributeId}
                      onChange={(e) => handleAttributeChange(index, 'attributeId', e.target.value)}
                      className="flex-1 px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900 text-sm"
                    >
                      <option value="">Select attribute</option>
                      {Array.isArray(attributes) && attributes.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                      className="flex-1 px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900 text-sm"
                      placeholder="Attribute value"
                    />
                    <button
                      type="button"
                      onClick={() => removeAttribute(index)}
                      className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-900 mb-6">Product Images</h2>
              
              {/* Image Upload Area */}
              <label className="block border border-dashed border-neutral-300 p-8 text-center hover:border-neutral-900 transition-colors cursor-pointer mb-4">
                <FaImage className="mx-auto text-3xl text-neutral-400 mb-3" />
                <p className="text-neutral-600 text-sm mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-neutral-500">PNG, JPG up to 10MB</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>

              {/* Uploaded Images */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.imageUrl}
                        alt={img.altText}
                        className="w-full h-32 object-cover border border-neutral-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes size={12} />
                      </button>
                      {img.isPrimary && (
                        <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-1">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="featured">Featured</option>
              </select>
              <p className="text-xs text-neutral-500 mt-3 font-mono leading-relaxed">
                Draft • Not visible<br/>
                Published • Visible<br/>
                Featured • Homepage
              </p>
            </div>

            {/* Actions */}
            <div className="bg-white border border-neutral-200 p-6 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-9 flex items-center justify-center gap-2 px-4 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                <FaSave size={12} />
                {loading ? 'Creating...' : 'Create Product'}
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

export default AddProduct