'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiEye, FiEyeOff, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import { useTrustBadgeStore, TrustBadge } from '@/store/trustBadgeStore'

const borderColorOptions = [
  { value: 'blush-pink', label: 'Blush Pink' },
  { value: 'powder-blue', label: 'Powder Blue' },
  { value: 'mint-green', label: 'Mint Green' },
  { value: 'warm-cream', label: 'Warm Cream' },
  { value: 'dusty-rose', label: 'Dusty Rose' },
]

export default function AdminTrustBadgesManagement() {
  const { badges, addBadge, updateBadge, deleteBadge, initialize } = useTrustBadgeStore()
  
  useEffect(() => {
    initialize()
  }, [initialize])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [formData, setFormData] = useState<Partial<TrustBadge>>({
    text: '',
    icon: '',
    borderColor: 'blush-pink',
    position: badges.length + 1,
    isActive: true,
  })

  const filteredBadges = badges.filter(b => 
    b.text.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.position - b.position)

  const handleEdit = (badge: TrustBadge) => {
    setEditingId(badge.id)
    setFormData(badge)
    setIsAdding(false)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingId(null)
    setFormData({
      text: '',
      icon: '',
      borderColor: 'blush-pink',
      position: badges.length + 1,
      isActive: true,
    })
  }

  const handleSave = () => {
    if (!formData.text) {
      alert('Please fill in the badge text')
      return
    }

    if (editingId) {
      updateBadge(editingId, formData)
    } else {
      addBadge(formData as Omit<TrustBadge, 'id' | 'createdAt' | 'updatedAt'>)
    }

    setEditingId(null)
    setIsAdding(false)
    setFormData({
      text: '',
      icon: '',
      borderColor: 'blush-pink',
      position: badges.length + 1,
      isActive: true,
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsAdding(false)
    setFormData({
      text: '',
      icon: '',
      borderColor: 'blush-pink',
      position: badges.length + 1,
      isActive: true,
    })
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this trust badge?')) {
      deleteBadge(id)
    }
  }

  const toggleActive = (id: string) => {
    const badge = badges.find(b => b.id === id)
    if (badge) {
      updateBadge(id, { isActive: !badge.isActive })
    }
  }

  const movePosition = (id: string, direction: 'up' | 'down') => {
    const badge = badges.find(b => b.id === id)
    if (!badge) return

    const sortedBadges = [...badges].sort((a, b) => a.position - b.position)
    const currentIndex = sortedBadges.findIndex(b => b.id === id)
    
    if (direction === 'up' && currentIndex > 0) {
      const prevBadge = sortedBadges[currentIndex - 1]
      updateBadge(id, { position: prevBadge.position })
      updateBadge(prevBadge.id, { position: badge.position })
    } else if (direction === 'down' && currentIndex < sortedBadges.length - 1) {
      const nextBadge = sortedBadges[currentIndex + 1]
      updateBadge(id, { position: nextBadge.position })
      updateBadge(nextBadge.id, { position: badge.position })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trust Badges</h1>
          <p className="text-gray-600 mt-1">Manage trust badges displayed on homepage hero section</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-primary-pink-dark hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add New Badge</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          placeholder="Search badges..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
        />
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? 'Edit Trust Badge' : 'Add New Trust Badge'}
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
                  Badge Text <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.text || ''}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="e.g., 100% Pure Cotton"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="e.g., 🛡️ or leave empty"
                />
                <p className="text-xs text-gray-500 mt-1">Optional emoji or icon to display before text</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Border Color <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.borderColor || 'blush-pink'}
                  onChange={(e) => setFormData({ ...formData, borderColor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                >
                  {borderColorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
              <span>Save Badge</span>
            </button>
          </div>
        </div>
      )}

      {/* Badges Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Text
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Border Color
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
              {filteredBadges.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No trust badges found. Click "Add New Badge" to create one.
                  </td>
                </tr>
              ) : (
                filteredBadges.map((badge) => {
                  const borderColorClass = `border-${badge.borderColor}/30`
                  return (
                    <tr key={badge.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className={`bg-cotton-white px-4 py-2 rounded-full border ${borderColorClass} inline-block`}>
                          <span className="font-header text-sm font-semibold text-warm-gray">
                            {badge.icon && <span className="mr-1">{badge.icon}</span>}
                            {badge.text}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{badge.text}</div>
                        {badge.icon && (
                          <div className="text-xs text-gray-500">Icon: {badge.icon}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {badge.borderColor}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => movePosition(badge.id, 'up')}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FiChevronUp className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium text-gray-900">{badge.position}</span>
                          <button
                            onClick={() => movePosition(badge.id, 'down')}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FiChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActive(badge.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            badge.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {badge.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(badge)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => toggleActive(badge.id)}
                            className="text-gray-600 hover:text-gray-800"
                            title={badge.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {badge.isActive ? (
                              <FiEyeOff className="w-5 h-5" />
                            ) : (
                              <FiEye className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(badge.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

