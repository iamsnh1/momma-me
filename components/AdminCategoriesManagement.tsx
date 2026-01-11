'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiMenu, FiEye, FiEyeOff, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import { useCategoryStore, Category } from '@/store/categoryStore'
import { useProductStore } from '@/store/productStore'

export default function AdminCategoriesManagement() {
  const { categories, addCategory, updateCategory, deleteCategory, initialize } = useCategoryStore()
  const { getAllProducts } = useProductStore()
  
  useEffect(() => {
    initialize()
  }, [initialize])

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    icon: '🌱',
    description: '',
    displayOrder: categories.length + 1,
    active: true,
    parentCategory: ''
  })

  const allProducts = getAllProducts()
  
  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999))

  const getProductCount = (categoryName: string) => {
    if (!mounted) return 0
    return allProducts.filter(p => p.category === categoryName).length
  }

  const handleSave = () => {
    if (!formData.name) {
      alert('Please fill in the category name')
      return
    }

    if (editingId) {
      updateCategory(editingId, formData)
      setEditingId(null)
    } else if (isAdding) {
      const newCategory: Category = {
        id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name!,
        icon: formData.icon || '🌱',
        description: formData.description || '',
        displayOrder: formData.displayOrder || categories.length + 1,
        active: formData.active !== false,
        parentCategory: formData.parentCategory || ''
      }
      addCategory(newCategory)
      setIsAdding(false)
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      icon: '🌱',
      description: '',
      displayOrder: categories.length + 1,
      active: true,
      parentCategory: ''
    })
  }

  const handleDelete = (id: string) => {
    const category = categories.find(c => c.id === id)
    const productCount = category ? getProductCount(category.name) : 0
    
    if (productCount > 0) {
      alert(`Cannot delete category. There are ${productCount} products in this category. Please reassign or delete those products first.`)
      return
    }
    
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id)
    }
  }

  const toggleActive = (id: string) => {
    const category = categories.find(c => c.id === id)
    if (category) {
      updateCategory(id, { active: !category.active })
    }
  }

  const movePosition = (id: string, direction: 'up' | 'down') => {
    const category = categories.find(c => c.id === id)
    if (!category) return

    const sortedCategories = [...categories].sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999))
    const currentIndex = sortedCategories.findIndex(c => c.id === id)
    
    if (direction === 'up' && currentIndex > 0) {
      const prevCategory = sortedCategories[currentIndex - 1]
      updateCategory(id, { displayOrder: prevCategory.displayOrder })
      updateCategory(prevCategory.id, { displayOrder: category.displayOrder })
    } else if (direction === 'down' && currentIndex < sortedCategories.length - 1) {
      const nextCategory = sortedCategories[currentIndex + 1]
      updateCategory(id, { displayOrder: nextCategory.displayOrder })
      updateCategory(nextCategory.id, { displayOrder: category.displayOrder })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple mb-2">Categories Management</h1>
          <p className="text-gray-600">Organize your product categories</p>
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
          <span>Add Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
        />
      </div>

      {/* Add/Edit Modal */}
      {(isAdding || editingId) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-purple">
                {isAdding ? 'Add New Category' : 'Edit Category'}
              </h2>
              <button
                onClick={() => {
                  setIsAdding(false)
                  setEditingId(null)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Icon</label>
                <div className="grid grid-cols-8 gap-2">
                  {['🌱', '👶', '🎮', '👕', '🚗', '💗', '🎁', '🧸'].map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-3 border-2 rounded-lg text-2xl hover:border-purple transition-colors ${
                        formData.icon === icon ? 'border-purple bg-purple/10' : 'border-gray-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="Or enter emoji/icon"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Category</label>
                  <select
                    value={formData.parentCategory}
                    onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  >
                    <option value="">None (Top Level)</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-purple focus:ring-purple rounded"
                />
                <span className="text-sm font-semibold text-gray-700">Active</span>
              </label>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsAdding(false)
                  setEditingId(null)
                  resetForm()
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-pink-dark hover:bg-pink-600 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <FiSave className="w-5 h-5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold w-12"></th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Icon</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Category Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Products</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Order</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <FiMenu className="w-5 h-5 text-gray-400 cursor-move" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 bg-primary-pink rounded-lg flex items-center justify-center text-2xl">
                      {category.icon}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{category.name}</td>
                  <td className="px-4 py-3 text-gray-600 text-sm max-w-xs truncate">{category.description}</td>
                  <td className="px-4 py-3 text-gray-600 font-semibold">{getProductCount(category.name)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => movePosition(category.id, 'up')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiChevronUp className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium text-gray-900">{category.displayOrder || categories.indexOf(category) + 1}</span>
                      <button
                        onClick={() => movePosition(category.id, 'down')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(category.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        category.active !== false
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {category.active !== false ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(category.id)
                          setIsAdding(false)
                          setFormData({
                            name: category.name,
                            icon: category.icon,
                            description: category.description,
                            displayOrder: category.displayOrder || categories.indexOf(category) + 1,
                            active: category.active !== false,
                            parentCategory: category.parentCategory || ''
                          })
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => toggleActive(category.id)}
                        className="text-gray-600 hover:text-gray-800"
                        title={category.active !== false ? 'Deactivate' : 'Activate'}
                      >
                        {category.active !== false ? (
                          <FiEyeOff className="w-5 h-5" />
                        ) : (
                          <FiEye className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
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
      </div>
    </div>
  )
}

