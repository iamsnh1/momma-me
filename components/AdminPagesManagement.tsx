'use client'

import { useState, useEffect } from 'react'
import { FiEdit, FiExternalLink, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi'
import Link from 'next/link'

interface Page {
  id: string
  title: string
  path: string
  description: string
  content: string
}

const defaultPages: Page[] = [
  {
    id: 'about',
    title: 'About Us',
    path: '/about',
    description: 'Learn more about our company and mission',
    content: 'Welcome to M💗mma & Me, your trusted partner for premium baby and mom products.'
  },
  {
    id: 'contact',
    title: 'Contact',
    path: '/contact',
    description: 'Get in touch with our team',
    content: 'We\'d love to hear from you! Send us a message and we\'ll respond as soon as possible.'
  },
  {
    id: 'shipping',
    title: 'Shipping',
    path: '/shipping',
    description: 'Shipping information and policies',
    content: 'We offer various shipping options to meet your needs.'
  },
  {
    id: 'returns',
    title: 'Returns',
    path: '/returns',
    description: 'Returns and exchanges policy',
    content: 'We want you to be completely satisfied with your purchase.'
  }
]

export default function AdminPagesManagement() {
  const [pages, setPages] = useState<Page[]>([])
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [editedContent, setEditedContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load pages from API
  const loadPages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pages')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Pages API response:', data)
      
      if (data.success && data.pages && data.pages.length > 0) {
        console.log(`Loaded ${data.pages.length} pages from database`)
        setPages(data.pages)
      } else {
        console.log('No pages in database, initializing defaults...')
        // Initialize with default pages if database is empty
        await initializeDefaultPages()
      }
    } catch (error) {
      console.error('Error loading pages:', error)
      // Show default pages immediately, then try to initialize
      setPages(defaultPages)
      await initializeDefaultPages()
    } finally {
      setLoading(false)
    }
  }

  // Initialize default pages in database
  const initializeDefaultPages = async () => {
    try {
      console.log('Initializing default pages...')
      const results = await Promise.allSettled(
        defaultPages.map(page =>
          fetch('/api/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(page)
          }).then(res => res.json())
        )
      )
      
      console.log('Initialization results:', results)
      
      // Reload pages after initialization
      const response = await fetch('/api/pages')
      const data = await response.json()
      
      if (data.success && data.pages && data.pages.length > 0) {
        setPages(data.pages)
      } else {
        // Fallback to default pages in state
        setPages(defaultPages)
      }
    } catch (error) {
      console.error('Error initializing pages:', error)
      // Fallback to default pages in state
      setPages(defaultPages)
    }
  }

  useEffect(() => {
    loadPages()
  }, [])

  const handleEdit = (page: Page) => {
    setEditingPage(page)
    setEditedContent(page.content)
  }

  const handleSave = async () => {
    if (!editingPage) return

    try {
      setSaving(true)
      const response = await fetch(`/api/pages/${editingPage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingPage.title,
          path: editingPage.path,
          description: editingPage.description,
          content: editedContent
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Update local state
        const updatedPages = pages.map(p =>
          p.id === editingPage.id ? { ...p, content: editedContent } : p
        )
        setPages(updatedPages)
        setEditingPage(null)
        setEditedContent('')
        alert('✅ Page updated successfully!')
      } else {
        alert(`❌ Error: ${data.error || 'Failed to update page'}`)
      }
    } catch (error: any) {
      console.error('Error saving page:', error)
      alert(`❌ Error: ${error.message || 'Failed to save page'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingPage(null)
    setEditedContent('')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pages Management</h1>
            <p className="text-gray-600 mt-2">Manage your website pages content</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FiRefreshCw className="w-8 h-8 mx-auto mb-4 text-purple animate-spin" />
          <p className="text-gray-600">Loading pages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages Management</h1>
          <p className="text-gray-600 mt-2">Manage your website pages content</p>
        </div>
        <button
          onClick={loadPages}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 flex items-center space-x-2"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {pages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">No pages found. Initializing default pages...</p>
          <button
            onClick={initializeDefaultPages}
            className="px-4 py-2 bg-purple text-white rounded-lg hover:bg-purple-dark"
          >
            Initialize Default Pages
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Path
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{page.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {page.path}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{page.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={page.path}
                          target="_blank"
                          className="text-purple hover:text-purple-dark flex items-center space-x-1"
                        >
                          <FiExternalLink className="w-4 h-4" />
                          <span>View</span>
                        </Link>
                        <button
                          onClick={() => handleEdit(page)}
                          className="text-primary-pink-dark hover:text-primary-pink flex items-center space-x-1"
                        >
                          <FiEdit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Edit {editingPage.title}
              </h2>
              <p className="text-gray-600 mt-1">Update the content for this page</p>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Page Content
                  </label>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={15}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple font-mono text-sm"
                    placeholder="Enter page content (HTML supported)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can use HTML tags for formatting
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50"
              >
                <FiX className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-purple text-white rounded-lg hover:bg-purple-dark flex items-center space-x-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
