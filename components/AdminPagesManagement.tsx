'use client'

import { useState, useEffect } from 'react'
import { FiEdit, FiExternalLink, FiCheck, FiX } from 'react-icons/fi'
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
  const [pages, setPages] = useState<Page[]>(defaultPages)
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [editedContent, setEditedContent] = useState('')

  useEffect(() => {
    // Load pages from localStorage or use defaults
    const savedPages = localStorage.getItem('momma-me-pages')
    if (savedPages) {
      try {
        const parsed = JSON.parse(savedPages)
        setPages(parsed)
      } catch (e) {
        console.error('Error loading pages:', e)
      }
    }
  }, [])

  const handleEdit = (page: Page) => {
    setEditingPage(page)
    setEditedContent(page.content)
  }

  const handleSave = () => {
    if (!editingPage) return

    const updatedPages = pages.map(p =>
      p.id === editingPage.id ? { ...p, content: editedContent } : p
    )
    setPages(updatedPages)
    localStorage.setItem('momma-me-pages', JSON.stringify(updatedPages))
    setEditingPage(null)
    setEditedContent('')
  }

  const handleCancel = () => {
    setEditingPage(null)
    setEditedContent('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages Management</h1>
          <p className="text-gray-600 mt-2">Manage your website pages content</p>
        </div>
      </div>

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
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <FiX className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple text-white rounded-lg hover:bg-purple-dark flex items-center space-x-2"
              >
                <FiCheck className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
