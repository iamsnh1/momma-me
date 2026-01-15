'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiUpload, FiEye } from 'react-icons/fi'
import { Product } from '@/store/cartStore'
import { useProductStore } from '@/store/productStore'
import { useCategoryStore } from '@/store/categoryStore'
import { uploadImage, isImageURL } from '@/utils/spacesUpload'

export default function AdminProductsManagement() {
  const { products, addProduct, updateProduct, deleteProduct, initialize } = useProductStore()
  const { getActiveCategories, initialize: initializeCategories } = useCategoryStore()
  
  useEffect(() => {
    initialize()
    initializeCategories()
  }, [initialize, initializeCategories])
  
  const categories = getActiveCategories()
  
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState<any>({
    name: '',
    sku: '',
    price: 0,
    salePrice: '',
    images: [],
    category: categories.length > 0 ? categories[0].name : '',
    ageRange: [],
    shortDescription: '',
    fullDescription: '',
    features: [],
    stock: 0,
    lowStockAlert: 5,
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    color: [],
    material: '',
    certifications: [],
    status: 'draft',
    featured: false,
    visibility: 'public',
    metaTitle: '',
    metaDescription: '',
    slug: '',
    tags: []
  })
  
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      console.log('No files selected')
      return
    }
    
    const fileArray = Array.from(files)
    console.log(`Processing ${fileArray.length} file(s)`)
    
    // Check file sizes
    const oversizedFiles = fileArray.filter(f => f.size > 5 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      alert(`Some images exceed 5MB limit. Please select smaller files.`)
      return
    }
    
    setIsUploading(true)
    
    // Upload all files - FORCE Spaces upload, don't allow base64 fallback
    try {
      console.log('Starting upload to DigitalOcean Spaces...')
      const uploadedImages = await Promise.all(
        fileArray.map(async (file, index) => {
          try {
            console.log(`Uploading file ${index + 1}/${fileArray.length}: ${file.name}`)
            const imageUrl = await uploadImage(file)
            console.log(`✅ Upload successful: ${imageUrl}`)
            
            // If it's not a URL (base64), throw error
            if (!isImageURL(imageUrl)) {
              throw new Error('Image must be uploaded to Spaces. Base64 images are not allowed due to storage limits.')
            }
            return imageUrl
          } catch (error: any) {
            console.error(`❌ Failed to upload ${file.name}:`, error)
            const errorMsg = error.message || 'Unknown error'
            throw new Error(`Failed to upload ${file.name}: ${errorMsg}`)
          }
        })
      )
      
      console.log('All uploads completed:', uploadedImages)
      alert(`✅ ${uploadedImages.length} image(s) uploaded to DigitalOcean Spaces!\n\nURLs:\n${uploadedImages.join('\n')}\n\nThese will be visible to all users.`)
      
      setFormData((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedImages]
      }))
    } catch (error: any) {
      console.error('Error processing files:', error)
      const errorDetails = error.message || 'Unknown error'
      alert(`❌ Upload Failed!\n\n${errorDetails}\n\nTroubleshooting:\n1. Check browser console for details (F12)\n2. Verify DigitalOcean Spaces environment variables are set\n3. Check DigitalOcean App logs for API errors\n4. Try using image URLs instead of file uploads`)
    } finally {
      setIsUploading(false)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    })
  }

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_: any, i: number) => i !== index)
    })
  }

  const handleSave = () => {
    // Parse sale price properly
    const salePriceStr = formData.salePrice?.toString().trim() || ''
    const salePriceNum = salePriceStr ? parseFloat(salePriceStr) : 0
    const originalPriceNum = Number(formData.price) || 0
    
    // Determine if we have a valid sale price
    const hasSalePrice = salePriceNum > 0 && originalPriceNum > 0 && salePriceNum < originalPriceNum
    
    // The display price (what customer sees) should be salePrice if available, otherwise original price
    const displayPrice = hasSalePrice ? salePriceNum : originalPriceNum
    
    // Build the product update object
    const productUpdate: Partial<Product> = {
      name: formData.name,
      price: displayPrice, // This is what customers pay
      originalPrice: originalPriceNum, // Always save the original price
      salePrice: hasSalePrice ? salePriceNum : undefined, // Only set if valid sale
      image: formData.images[0] || '',
      category: formData.category,
      rating: 5,
      description: formData.shortDescription
    }
    
    try {
      if (editingId) {
        updateProduct(editingId, productUpdate)
        console.log('✅ Product updated:', editingId, productUpdate)
        setEditingId(null)
      } else if (isAdding) {
        const newProduct: Product = {
          id: Date.now().toString(),
          ...productUpdate
        } as Product
        addProduct(newProduct)
        console.log('✅ Product added:', newProduct.id, productUpdate)
        setIsAdding(false)
      }
      
      // Re-initialize to refresh the store
      initialize()
      
      // Dispatch event to refresh frontend
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('productsUpdated'))
      }
      
      // Verify it was saved
      const savedProducts = typeof window !== 'undefined' ? localStorage.getItem('momma-me-products') : null
      console.log('Products saved to localStorage:', savedProducts ? 'Yes' : 'No')
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts)
        console.log(`Saved ${parsed.length} products`)
      }
      
      alert('✅ Product saved successfully! Changes will appear on the site. Refresh the page to see updates.')
      resetForm()
    } catch (error: any) {
      alert(`❌ Error saving product: ${error.message || 'Unknown error'}`)
      console.error('Error saving product:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      price: 0,
      salePrice: '',
      images: [],
      category: categories.length > 0 ? categories[0].name : '',
      ageRange: [],
      shortDescription: '',
      fullDescription: '',
      features: [],
      stock: 0,
      lowStockAlert: 5,
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      color: [],
      material: '',
      certifications: [],
      status: 'draft',
      featured: false,
      visibility: 'public',
      metaTitle: '',
      metaDescription: '',
      slug: '',
      tags: []
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple mb-2">Products Management</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true)
            setEditingId(null)
            resetForm()
          }}
          className="bg-primary-pink-dark hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
        >
          <option value="all">All Products</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="outofstock">Out of Stock</option>
        </select>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-purple mb-6">
            {isAdding ? 'Add New Product' : 'Edit Product'}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Main Form */}
            <div className="md:col-span-2 space-y-6">
              {/* Product Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Images *
                </label>
                
                {/* File Input - Made more accessible */}
                <div className="relative">
                  <input
                    type="file"
                    id="product-image-upload"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      console.log('File input changed:', e.target.files?.length)
                      handleFileUpload(e.target.files)
                      // Reset to allow selecting same file again
                      setTimeout(() => {
                        if (e.target) e.target.value = ''
                      }, 100)
                    }}
                  />
                  
                  {/* Upload Area with Drag and Drop */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setIsDragging(true)
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setIsDragging(false)
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setIsDragging(false)
                      console.log('Files dropped:', e.dataTransfer.files.length)
                      handleFileUpload(e.dataTransfer.files)
                    }}
                    onClick={() => {
                      // Trigger file input click
                      const fileInput = document.getElementById('product-image-upload') as HTMLInputElement
                      if (fileInput) {
                        fileInput.click()
                      }
                    }}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                      isDragging
                        ? 'border-purple bg-purple-100'
                        : 'border-gray-300 bg-gray-50 hover:border-purple hover:bg-purple-50'
                    }`}
                  >
                    <FiUpload className={`w-12 h-12 mx-auto mb-2 ${isDragging ? 'text-purple' : 'text-gray-400'}`} />
                    <p className="text-gray-600 font-medium">
                      {isDragging ? 'Drop images here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG, WEBP (Max 5MB per image)</p>
                    <p className="text-xs text-gray-400 mt-1">You can select multiple images</p>
                  </div>
                </div>
                
                {/* Image Preview Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {formData.images.map((img: string, i: number) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border-2 border-purple">
                        <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => {
                            setFormData({
                              ...formData,
                              images: formData.images.filter((_: string, idx: number) => idx !== i)
                            })
                          }}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                          title="Remove image"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-purple">Basic Information</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                    placeholder="e.g., Organic Cotton Onesie"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">SKU</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                        placeholder="AUTO-GENERATED"
                      />
                      <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm">
                        Auto
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Age Range</label>
                  <div className="flex flex-wrap gap-2">
                    {['0-3m', '3-6m', '6-12m', '1-2y', '2-3y', '3y+'].map((age) => (
                      <label key={age} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.ageRange.includes(age)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, ageRange: [...formData.ageRange, age] })
                            } else {
                              setFormData({ ...formData, ageRange: formData.ageRange.filter((a: string) => a !== age) })
                            }
                          }}
                          className="w-4 h-4 text-purple focus:ring-purple rounded"
                        />
                        <span className="text-sm">{age}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-purple">Description</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Short Description (200 chars max)
                  </label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    maxLength={200}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/200</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Description</label>
                  <textarea
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Features</label>
                  <div className="space-y-2">
                    {formData.features.map((feature: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...formData.features]
                            newFeatures[index] = e.target.value
                            setFormData({ ...formData, features: newFeatures })
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                          placeholder="Enter feature"
                        />
                        <button
                          onClick={() => handleRemoveFeature(index)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddFeature}
                      className="text-purple hover:text-purple-light font-semibold text-sm flex items-center space-x-1"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add Feature</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-purple">Pricing & Inventory</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Original Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        setFormData({ ...formData, price: value })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Regular price before discount</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sale Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.salePrice}
                      onChange={(e) => {
                        const value = e.target.value
                        setFormData({ ...formData, salePrice: value })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                      placeholder="Leave empty for no sale"
                    />
                    {(() => {
                      // Parse values - handle empty strings and ensure numbers
                      const salePriceStr = formData.salePrice?.toString().trim() || ''
                      const salePriceNum = salePriceStr ? parseFloat(salePriceStr) : 0
                      const originalPriceNum = Number(formData.price) || 0
                      
                      // Validate: sale price must be less than original price and both must be positive
                      const isValidSale = salePriceNum > 0 && 
                                         originalPriceNum > 0 && 
                                         salePriceNum < originalPriceNum &&
                                         !isNaN(salePriceNum) &&
                                         !isNaN(originalPriceNum)
                      
                      if (isValidSale) {
                        const discountPercent = Math.round(((1 - salePriceNum / originalPriceNum) * 100))
                        const savingsAmount = (originalPriceNum - salePriceNum).toFixed(2)
                        return (
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-green-600 font-semibold">
                              💰 Save {discountPercent}% (₹{savingsAmount})
                            </p>
                            <p className="text-xs text-gray-500">
                              Original: ₹{originalPriceNum.toFixed(2)} → Sale: ₹{salePriceNum.toFixed(2)}
                            </p>
                          </div>
                        )
                      } else if (salePriceStr && salePriceNum > 0 && originalPriceNum > 0 && salePriceNum >= originalPriceNum) {
                        return (
                          <p className="text-sm text-red-600 mt-1">
                            ⚠️ Sale price must be less than original price
                          </p>
                        )
                      }
                      return null
                    })()}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Low Stock Alert</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.lowStockAlert}
                      onChange={(e) => setFormData({ ...formData, lowStockAlert: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                    />
                    <p className="text-xs text-gray-500 mt-1">Send notification when stock falls below this number</p>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-purple">Product Specifications</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Weight</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                      />
                      <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple">
                        <option>oz</option>
                        <option>lb</option>
                        <option>g</option>
                        <option>kg</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Dimensions</label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="L" className="flex-1 px-2 py-2 border border-gray-300 rounded-lg" />
                      <span className="py-2">x</span>
                      <input type="number" placeholder="W" className="flex-1 px-2 py-2 border border-gray-300 rounded-lg" />
                      <span className="py-2">x</span>
                      <input type="number" placeholder="H" className="flex-1 px-2 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Color</label>
                    <div className="flex flex-wrap gap-2">
                      {['White', 'Pink', 'Blue', 'Yellow', 'Green', 'Purple'].map((color) => (
                        <label key={color} className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-purple focus:ring-purple rounded" />
                          <span className="text-sm">{color}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Material</label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                      placeholder="Cotton, Polyester, Wood, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Safety & Certifications */}
              <div>
                <h3 className="text-lg font-bold text-purple mb-4">Safety & Certifications</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {['CPSIA Compliant', 'ASTM Certified', 'Non-toxic Materials', 'BPA Free', 'Phthalate Free', 'Lead-free Paint'].map((cert) => (
                    <label key={cert} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-purple focus:ring-purple rounded" />
                      <span className="text-sm">✓ {cert}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="md:col-span-1 space-y-6">
              {/* Publishing */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h3 className="font-bold text-purple">Publishing</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <div className="space-y-2">
                    {['draft', 'active', 'inactive'].map((status) => (
                      <label key={status} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value={status}
                          checked={formData.status === status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-4 h-4 text-purple focus:ring-purple"
                        />
                        <span className="text-sm capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-purple focus:ring-purple rounded"
                  />
                  <span className="text-sm">Show on homepage</span>
                </label>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Visibility</label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  >
                    <option value="public">Public</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h3 className="font-bold text-purple">SEO Settings</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Title (60 chars)</label>
                  <input
                    type="text"
                    maxLength={60}
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/60</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Description (160 chars)</label>
                  <textarea
                    maxLength={160}
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple text-sm"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple text-sm"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-purple mb-2">Tags</h3>
                <input
                  type="text"
                  placeholder="organic, cotton, newborn..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              onClick={handleSave}
              className="bg-primary-pink-dark hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
            >
              <FiSave className="w-5 h-5" />
              <span>Save & Publish</span>
            </button>
            <button
              onClick={() => {
                setFormData({ ...formData, status: 'draft' })
                handleSave()
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Save as Draft
            </button>
            <button className="bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2">
              <FiEye className="w-5 h-5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => {
                setIsAdding(false)
                setEditingId(null)
                resetForm()
              }}
              className="text-gray-600 hover:text-gray-800 font-semibold py-3 px-6"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  <input type="checkbox" className="w-4 h-4" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-4 py-3 text-left text-sm font-semibold cursor-pointer" onClick={() => setSortBy('name')}>
                  Product Name {sortBy === 'name' && '▼'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold cursor-pointer" onClick={() => setSortBy('price')}>
                  Price {sortBy === 'price' && '▼'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="w-4 h-4" />
                  </td>
                  <td className="px-4 py-3">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <a href={`/products/${product.id}`} className="font-medium text-purple hover:underline">
                      {product.name}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">{product.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    {product.salePrice && product.salePrice < (product.originalPrice || product.price) ? (
                      <div className="flex flex-col">
                        <span className="font-semibold text-primary-pink-dark">₹{product.salePrice.toFixed(2)}</span>
                        <span className="text-xs text-gray-500 line-through">₹{(product.originalPrice || product.price).toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="font-semibold text-primary-pink-dark">₹{product.price.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {mounted ? (
                      <span className="text-gray-600">N/A</span>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-pink-dark"></div>
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(product.id)
                          setIsAdding(false)
                          // Load product data into form - preserve originalPrice and salePrice
                          const originalPrice = product.originalPrice || product.price
                          const salePrice = product.salePrice && product.salePrice < originalPrice 
                            ? product.salePrice.toString() 
                            : ''
                          setFormData({ 
                            ...formData, 
                            name: product.name, 
                            price: originalPrice,
                            salePrice: salePrice,
                            category: product.category,
                            shortDescription: product.description || '',
                            images: product.image ? [product.image] : []
                          })
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this product?')) {
                            deleteProduct(product.id)
                            // Dispatch event to refresh frontend
                            if (typeof window !== 'undefined') {
                              window.dispatchEvent(new Event('productsUpdated'))
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select className="px-2 py-1 border border-gray-300 rounded text-sm">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Previous</button>
            {[1, 2, 3].map((page) => (
              <button key={page} className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-purple hover:text-white">
                {page}
              </button>
            ))}
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

