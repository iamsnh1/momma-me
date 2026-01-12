'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiEye, FiEyeOff, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import { useBannerStore, Banner } from '@/store/bannerStore'

export default function AdminBannersManagement() {
  const { banners, addBanner, updateBanner, deleteBanner, initialize } = useBannerStore()
  
  useEffect(() => {
    initialize()
  }, [initialize])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  
  const [formData, setFormData] = useState<Partial<Banner>>({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    type: 'hero',
    position: banners.length + 1,
    isActive: true,
    buttonText: 'Shop Now',
    startDate: '',
    endDate: '',
  })

  const filteredBanners = banners.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || b.type === filterType
    return matchesSearch && matchesType
  }).sort((a, b) => a.position - b.position)

  const handleEdit = (banner: Banner) => {
    setEditingId(banner.id)
    setFormData(banner)
    setIsAdding(false)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingId(null)
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      link: '',
      type: 'hero',
      position: banners.length + 1,
      isActive: true,
      buttonText: 'Shop Now',
      startDate: '',
      endDate: '',
    })
  }

  const handleSave = () => {
    if (!formData.title || !formData.image) {
      alert('Please fill in required fields (Title and Image)')
      return
    }

    // Verify image is set
    if (!formData.image || formData.image.trim() === '') {
      alert('Please upload an image or enter an image URL')
      return
    }

    try {
      // Verify image is actually set
      console.log('Saving banner with image:', formData.image ? (formData.image.substring(0, 50) + '...') : 'NO IMAGE')
      
      if (editingId) {
        updateBanner(editingId, formData)
        console.log('Banner updated:', editingId)
      } else {
        addBanner(formData as Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>)
        console.log('Banner added')
      }

      // Re-initialize to refresh the store
      initialize()
      
      // Verify it was saved
      const savedBanners = typeof window !== 'undefined' ? localStorage.getItem('momma-me-banners') : null
      console.log('Banners saved to localStorage:', savedBanners ? 'Yes' : 'No')
      
      // Dispatch custom event to notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('bannerUpdated'))
      }

      setEditingId(null)
      setIsAdding(false)
      setFormData({
        title: '',
        subtitle: '',
        image: '',
        link: '',
        type: 'hero',
        position: banners.length + 1,
        isActive: true,
        buttonText: 'Shop Now',
        startDate: '',
        endDate: '',
      })
      
      // Show success message
      alert('✅ Banner saved successfully! Changes will appear on the homepage. Refresh the homepage to see updates.')
    } catch (error: any) {
      alert(`❌ Error saving banner: ${error.message || 'Unknown error'}\n\nPlease try:\n- Using a smaller image\n- Compressing the image before uploading\n- Using an image URL instead`)
      console.error('Error saving banner:', error)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsAdding(false)
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      link: '',
      type: 'hero',
      position: banners.length + 1,
      isActive: true,
      buttonText: 'Shop Now',
      startDate: '',
      endDate: '',
    })
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        deleteBanner(id)
        initialize()
        // Dispatch custom event to notify other components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('bannerUpdated'))
        }
        alert('✅ Banner deleted successfully!')
      } catch (error: any) {
        alert(`❌ Error deleting banner: ${error.message || 'Unknown error'}`)
        console.error('Error deleting banner:', error)
      }
    }
  }

  const toggleActive = (id: string) => {
    const banner = banners.find(b => b.id === id)
    if (banner) {
      try {
        updateBanner(id, { isActive: !banner.isActive })
        initialize()
        // Dispatch custom event to notify other components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('bannerUpdated'))
        }
      } catch (error: any) {
        alert(`❌ Error updating banner: ${error.message || 'Unknown error'}`)
        console.error('Error updating banner:', error)
      }
    }
  }

  const movePosition = (id: string, direction: 'up' | 'down') => {
    const banner = banners.find(b => b.id === id)
    if (!banner) return

    const sortedBanners = [...banners].sort((a, b) => a.position - b.position)
    const currentIndex = sortedBanners.findIndex(b => b.id === id)
    
    if (direction === 'up' && currentIndex > 0) {
      const prevBanner = sortedBanners[currentIndex - 1]
      updateBanner(id, { position: prevBanner.position })
      updateBanner(prevBanner.id, { position: banner.position })
    } else if (direction === 'down' && currentIndex < sortedBanners.length - 1) {
      const nextBanner = sortedBanners[currentIndex + 1]
      updateBanner(id, { position: nextBanner.position })
      updateBanner(nextBanner.id, { position: banner.position })
    }
    
    initialize()
    // Dispatch custom event to notify other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('bannerUpdated'))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banners & Advertisements</h1>
          <p className="text-gray-600 mt-1">Manage homepage banners and promotional content</p>
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-semibold mb-1">📍 Banner Locations:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• <strong>Hero:</strong> Main carousel at top of homepage</li>
              <li>• <strong>Boutique:</strong> "Premium Boutiques" section on homepage</li>
              <li>• <strong>Promotional/Advertisement:</strong> Other sections</li>
            </ul>
            <p className="text-xs text-blue-600 mt-2">💡 Tip: Refresh the homepage after saving to see changes</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <button
            onClick={handleAdd}
            className="bg-primary-pink-dark hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add New Banner</span>
          </button>
          <a
            href="/"
            target="_blank"
            className="text-sm text-purple hover:text-purple-dark font-semibold underline"
          >
            View Homepage →
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search banners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
        >
          <option value="all">All Types</option>
          <option value="hero">Hero</option>
          <option value="promotional">Promotional</option>
          <option value="boutique">Boutique</option>
          <option value="advertisement">Advertisement</option>
        </select>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? 'Edit Banner' : 'Add New Banner'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="Banner title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="Banner subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Image <span className="text-red-500">*</span>
                </label>
                
                {/* File Upload Option - More Prominent */}
                <div className="mb-4 p-4 border-2 border-dashed border-purple rounded-lg bg-purple-50">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📁 Upload Image from Computer
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setIsProcessingImage(true)
                        // Check file size (max 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          alert('Image size must be less than 5MB')
                          e.target.value = '' // Reset input
                          setIsProcessingImage(false)
                          return
                        }
                        
                        // Compress image before converting to base64
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          const img = new Image()
                          img.onload = () => {
                            // Create canvas for compression
                            const canvas = document.createElement('canvas')
                            const MAX_WIDTH = 1920
                            const MAX_HEIGHT = 1080
                            let width = img.width
                            let height = img.height
                            
                            // Calculate new dimensions
                            if (width > height) {
                              if (width > MAX_WIDTH) {
                                height = (height * MAX_WIDTH) / width
                                width = MAX_WIDTH
                              }
                            } else {
                              if (height > MAX_HEIGHT) {
                                width = (width * MAX_HEIGHT) / height
                                height = MAX_HEIGHT
                              }
                            }
                            
                            canvas.width = width
                            canvas.height = height
                            
                            // Draw and compress
                            const ctx = canvas.getContext('2d')
                            if (ctx) {
                              ctx.drawImage(img, 0, 0, width, height)
                              // Convert to base64 with quality compression (0.8 = 80% quality)
                              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8)
                              console.log('Image compressed. Original size:', file.size, 'bytes. Base64 length:', compressedBase64.length)
                              setFormData({ ...formData, image: compressedBase64 })
                              setIsProcessingImage(false)
                            } else {
                              // Fallback to original if canvas not available
                              setFormData({ ...formData, image: reader.result as string })
                              setIsProcessingImage(false)
                            }
                          }
                          img.onerror = () => {
                            // Fallback to original if image load fails
                            setFormData({ ...formData, image: reader.result as string })
                            setIsProcessingImage(false)
                          }
                          img.src = reader.result as string
                        }
                        reader.onerror = () => {
                          alert('Error reading file. Please try again.')
                          e.target.value = ''
                          setIsProcessingImage(false)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-purple rounded-lg focus:outline-none focus:ring-2 focus:ring-purple bg-white cursor-pointer hover:bg-purple-50 transition-colors"
                  />
                  <p className="text-xs text-gray-600 mt-2">Supported formats: JPG, PNG, WEBP | Maximum size: 5MB</p>
                  {isProcessingImage && (
                    <p className="text-xs text-blue-600 mt-1 animate-pulse">⏳ Processing and compressing image...</p>
                  )}
                  {formData.image && formData.image.startsWith('data:') && !isProcessingImage && (
                    <p className="text-xs text-green-600 mt-1">✅ Image loaded and ready to save</p>
                  )}
                </div>

                {/* Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-3 text-sm text-gray-500">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Or Enter URL Option */}
                <div className="mb-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🔗 Enter Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image?.startsWith('data:') ? '' : (formData.image || '')}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Paste an image URL from the web</p>
                </div>

                {/* Image Preview */}
                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link URL
                </label>
                <input
                  type="url"
                  value={formData.link || ''}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="/products or https://example.com"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Banner Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type || 'hero'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Banner['type'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                >
                  <option value="hero">Hero (Carousel) - Top of homepage</option>
                  <option value="boutique">Boutique - Premium Boutiques section</option>
                  <option value="promotional">Promotional - Promotional section</option>
                  <option value="advertisement">Advertisement - Advertisement section</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.type === 'hero' && '📍 Appears in the main carousel at the top of the homepage'}
                  {formData.type === 'boutique' && '📍 Appears in the "Premium Boutiques" section on homepage'}
                  {formData.type === 'promotional' && '📍 Appears in promotional sections'}
                  {formData.type === 'advertisement' && '📍 Appears in advertisement sections'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position
                </label>
                <input
                  type="number"
                  value={formData.position || 1}
                  onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={formData.buttonText || ''}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="Shop Now"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive || false}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-purple focus:ring-purple rounded"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                  Active
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 mt-6">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary-pink-dark hover:bg-pink-600 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <FiSave className="w-5 h-5" />
              <span>Save Banner</span>
            </button>
          </div>
        </div>
      )}

      {/* Banners Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBanners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No banners found. Click "Add New Banner" to create one.
                  </td>
                </tr>
              ) : (
                filteredBanners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{banner.title}</div>
                      {banner.subtitle && (
                        <div className="text-sm text-gray-500">{banner.subtitle}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {banner.type}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {banner.type === 'hero' && '📍 Top carousel on homepage'}
                          {banner.type === 'boutique' && '📍 Premium Boutiques section'}
                          {banner.type === 'promotional' && '📍 Promotional section'}
                          {banner.type === 'advertisement' && '📍 Advertisement section'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => movePosition(banner.id, 'up')}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FiChevronUp className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-gray-900">{banner.position}</span>
                        <button
                          onClick={() => movePosition(banner.id, 'down')}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FiChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(banner.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          banner.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => toggleActive(banner.id)}
                          className="text-gray-600 hover:text-gray-800"
                          title={banner.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {banner.isActive ? (
                            <FiEyeOff className="w-5 h-5" />
                          ) : (
                            <FiEye className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

