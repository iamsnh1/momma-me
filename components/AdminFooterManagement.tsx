'use client'

import { useState, useEffect } from 'react'
import { FiSave, FiRotateCcw, FiPlus } from 'react-icons/fi'
import { useFooterSettingsStore, FooterSettings } from '@/store/footerSettingsStore'

export default function AdminFooterManagement() {
  const { settings, initialize, updateSettings, resetSettings } = useFooterSettingsStore()
  const [formData, setFormData] = useState<FooterSettings>(settings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    setFormData(settings)
  }, [settings])

  const handleSave = async () => {
    try {
      await updateSettings(formData)
      // Re-initialize to get the latest from database
      await initialize()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      alert('✅ Footer settings saved successfully to database! All users will see these changes.')
    } catch (error: any) {
      alert(`❌ Error saving footer settings: ${error.message || 'Unknown error'}`)
      console.error('Error saving footer settings:', error)
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all footer settings to default?')) {
      resetSettings()
      setFormData(settings)
    }
  }

  const updateQuickLink = (index: number, field: 'label' | 'url', value: string) => {
    const updated = [...formData.quickLinks]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, quickLinks: updated })
  }

  const addQuickLink = () => {
    setFormData({
      ...formData,
      quickLinks: [...formData.quickLinks, { label: '', url: '' }]
    })
  }

  const removeQuickLink = (index: number) => {
    setFormData({
      ...formData,
      quickLinks: formData.quickLinks.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple mb-2">Footer Settings</h1>
          <p className="text-gray-600">Manage footer content and contact information</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            <FiRotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            className="bg-primary-pink-dark hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            <FiSave className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Footer settings saved successfully!
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Company Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Company Description
          </label>
          <textarea
            value={formData.companyDescription}
            onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
            placeholder="Enter company description..."
          />
        </div>

        {/* Quick Links */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700">Quick Links</label>
            <button
              onClick={addQuickLink}
              className="text-purple hover:text-purple-light text-sm font-semibold flex items-center space-x-1"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Link</span>
            </button>
          </div>
          <div className="space-y-3">
            {formData.quickLinks.map((link, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                  placeholder="Link Label"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateQuickLink(index, 'url', e.target.value)}
                  placeholder="URL"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
                <button
                  onClick={() => removeQuickLink(index)}
                  className="text-red-600 hover:text-red-700 px-3 py-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook</label>
              <input
                type="url"
                value={formData.socialMedia.facebook}
                onChange={(e) => setFormData({
                  ...formData,
                  socialMedia: { ...formData.socialMedia, facebook: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram</label>
              <input
                type="url"
                value={formData.socialMedia.instagram}
                onChange={(e) => setFormData({
                  ...formData,
                  socialMedia: { ...formData.socialMedia, instagram: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter</label>
              <input
                type="url"
                value={formData.socialMedia.twitter}
                onChange={(e) => setFormData({
                  ...formData,
                  socialMedia: { ...formData.socialMedia, twitter: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pinterest (Optional)</label>
              <input
                type="url"
                value={formData.socialMedia.pinterest || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  socialMedia: { ...formData.socialMedia, pinterest: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                placeholder="https://pinterest.com/..."
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.contactInfo.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, phone: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, email: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={formData.contactInfo.address}
                onChange={(e) => setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, address: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                placeholder="123 Baby Street, City, State 12345"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Hours</label>
              <input
                type="text"
                value={formData.contactInfo.hours}
                onChange={(e) => setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, hours: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                placeholder="Mon-Fri: 9AM-6PM EST"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Copyright Text
          </label>
          <input
            type="text"
            value={formData.copyright}
            onChange={(e) => setFormData({ ...formData, copyright: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
            placeholder="Copyright © 2024 Momma & Me. All rights reserved."
          />
        </div>
      </div>
    </div>
  )
}
