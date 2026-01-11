'use client'

import { useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi'
import { Product } from '@/store/cartStore'
import { products as initialProducts, categories } from '@/data/products'

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    image: '',
    category: categories[0].name,
    rating: 5,
    description: ''
  })

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setFormData(product)
    setIsAdding(false)
  }

  const handleSave = () => {
    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...formData, id: editingId } as Product : p))
      setEditingId(null)
    } else if (isAdding) {
      const newProduct: Product = {
        ...formData as Product,
        id: Date.now().toString()
      }
      setProducts([...products, newProduct])
      setIsAdding(false)
    }
    setFormData({
      name: '',
      price: 0,
      image: '',
      category: categories[0].name,
      rating: 5,
      description: ''
    })
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsAdding(false)
    setFormData({
      name: '',
      price: 0,
      image: '',
      category: categories[0].name,
      rating: 5,
      description: ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-primary-pink-dark flex items-center justify-center text-white text-lg font-bold">
              M
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-purple">
              Admin Panel
            </h1>
          </div>
          <a
            href="/"
            className="text-gray-600 hover:text-purple transition-colors"
          >
            ← Back to Store
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-purple">Product Management</h2>
          <button
            onClick={() => {
              setIsAdding(true)
              setEditingId(null)
              setFormData({
                name: '',
                price: 0,
                image: '',
                category: categories[0].name,
                rating: 5,
                description: ''
              })
            }}
            className="bg-primary-pink-dark hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-purple mb-4">
              {isAdding ? 'Add New Product' : 'Edit Product'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  rows={3}
                  placeholder="Enter product description"
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <FiSave className="w-5 h-5" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <FiX className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-primary-pink-dark">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < product.rating ? 'text-yellow-400' : 'text-gray-300'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          aria-label="Edit product"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          aria-label="Delete product"
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

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-purple">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Value</h3>
            <p className="text-3xl font-bold text-primary-pink-dark">
              ${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Categories</h3>
            <p className="text-3xl font-bold text-purple">{categories.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

