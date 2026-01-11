'use client'

import { useState, useEffect } from 'react'
import { FiSave, FiRotateCcw, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { useSettingsStore, AppSettings } from '@/store/settingsStore'

export default function AdminSettingsManagement() {
  const { settings, initialize, updateSettings, resetSettings } = useSettingsStore()
  const [formData, setFormData] = useState<AppSettings>(settings)
  const [saved, setSaved] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general']))

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    setFormData(settings)
  }, [settings])

  const handleSave = () => {
    updateSettings(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
      resetSettings()
      setFormData(settings)
    }
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const updateShippingCost = (type: 'standard' | 'express' | 'overnight', value: number) => {
    setFormData({
      ...formData,
      shippingCosts: { ...formData.shippingCosts, [type]: value }
    })
  }

  const updatePaymentMethod = (method: keyof AppSettings['paymentMethods'], enabled: boolean) => {
    setFormData({
      ...formData,
      paymentMethods: { ...formData.paymentMethods, [method]: enabled }
    })
  }

  const updateEmailNotification = (notification: keyof AppSettings['emailNotifications'], enabled: boolean) => {
    setFormData({
      ...formData,
      emailNotifications: { ...formData.emailNotifications, [notification]: enabled }
    })
  }

  const addImageDomain = (domain: string) => {
    if (domain && !formData.allowedImageDomains.includes(domain)) {
      setFormData({
        ...formData,
        allowedImageDomains: [...formData.allowedImageDomains, domain]
      })
    }
  }

  const removeImageDomain = (domain: string) => {
    setFormData({
      ...formData,
      allowedImageDomains: formData.allowedImageDomains.filter(d => d !== domain)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple mb-2">Settings</h1>
          <p className="text-gray-600">Manage store configuration and preferences</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            <FiRotateCcw className="w-5 h-5" />
            <span>Reset to Default</span>
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
          Settings saved successfully!
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => toggleSection('general')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h2 className="text-xl font-bold text-purple">General Settings</h2>
          {expandedSections.has('general') ? (
            <FiChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
        {expandedSections.has('general') && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Store Name</label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Store Email</label>
                <input
                  type="email"
                  value={formData.storeEmail}
                  onChange={(e) => setFormData({ ...formData, storeEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Store Phone</label>
                <input
                  type="tel"
                  value={formData.storePhone}
                  onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Store Address</label>
                <input
                  type="text"
                  value={formData.storeAddress}
                  onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Store Description</label>
              <textarea
                value={formData.storeDescription}
                onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
              />
            </div>
          </div>
        )}
      </div>

      {/* E-commerce Settings */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => toggleSection('ecommerce')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h2 className="text-xl font-bold text-purple">E-commerce Settings</h2>
          {expandedSections.has('ecommerce') ? (
            <FiChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
        {expandedSections.has('ecommerce') && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Currency Symbol</label>
                <input
                  type="text"
                  value={formData.currencySymbol}
                  onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Free Shipping Threshold</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.freeShippingThreshold}
                  onChange={(e) => setFormData({ ...formData, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Shipping Costs</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Standard Shipping</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.shippingCosts.standard}
                    onChange={(e) => updateShippingCost('standard', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Express Shipping</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.shippingCosts.express}
                    onChange={(e) => updateShippingCost('express', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Overnight Shipping</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.shippingCosts.overnight}
                    onChange={(e) => updateShippingCost('overnight', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Settings */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => toggleSection('payment')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h2 className="text-xl font-bold text-purple">Payment Methods</h2>
          {expandedSections.has('payment') ? (
            <FiChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
        {expandedSections.has('payment') && (
          <div className="p-6 space-y-3">
            {Object.entries(formData.paymentMethods).map(([method, enabled]) => (
              <label key={method} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => updatePaymentMethod(method as keyof AppSettings['paymentMethods'], e.target.checked)}
                  className="w-5 h-5 text-purple focus:ring-purple rounded"
                />
                <span className="text-gray-700 capitalize">{method.replace(/([A-Z])/g, ' $1').trim()}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Email Settings */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => toggleSection('email')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h2 className="text-xl font-bold text-purple">Email Settings</h2>
          {expandedSections.has('email') ? (
            <FiChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
        {expandedSections.has('email') && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email</label>
              <input
                type="email"
                value={formData.adminEmail}
                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Email Notifications</h3>
              <div className="space-y-3">
                {Object.entries(formData.emailNotifications).map(([notification, enabled]) => (
                  <label key={notification} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => updateEmailNotification(notification as keyof AppSettings['emailNotifications'], e.target.checked)}
                      className="w-5 h-5 text-purple focus:ring-purple rounded"
                    />
                    <span className="text-gray-700 capitalize">{notification.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Settings */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => toggleSection('images')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h2 className="text-xl font-bold text-purple">Image Settings</h2>
          {expandedSections.has('images') ? (
            <FiChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
        {expandedSections.has('images') && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Allowed Image Domains</label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g., example.com"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addImageDomain(e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    if (input) {
                      addImageDomain(input.value)
                      input.value = ''
                    }
                  }}
                  className="px-4 py-2 bg-purple text-white rounded-lg hover:bg-purple-light transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.allowedImageDomains.map((domain) => (
                  <span
                    key={domain}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{domain}</span>
                    <button
                      onClick={() => removeImageDomain(domain)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Display Settings */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => toggleSection('display')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h2 className="text-xl font-bold text-purple">Display Settings</h2>
          {expandedSections.has('display') ? (
            <FiChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
        {expandedSections.has('display') && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Products Per Page</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.productsPerPage}
                  onChange={(e) => setFormData({ ...formData, productsPerPage: parseInt(e.target.value) || 12 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableReviews}
                  onChange={(e) => setFormData({ ...formData, enableReviews: e.target.checked })}
                  className="w-5 h-5 text-purple focus:ring-purple rounded"
                />
                <span className="text-gray-700">Enable Product Reviews</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableWishlist}
                  onChange={(e) => setFormData({ ...formData, enableWishlist: e.target.checked })}
                  className="w-5 h-5 text-purple focus:ring-purple rounded"
                />
                <span className="text-gray-700">Enable Wishlist</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableNewsletter}
                  onChange={(e) => setFormData({ ...formData, enableNewsletter: e.target.checked })}
                  className="w-5 h-5 text-purple focus:ring-purple rounded"
                />
                <span className="text-gray-700">Enable Newsletter</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Maintenance Mode */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => toggleSection('maintenance')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h2 className="text-xl font-bold text-purple">Maintenance Mode</h2>
          {expandedSections.has('maintenance') ? (
            <FiChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
        {expandedSections.has('maintenance') && (
          <div className="p-6 space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.maintenanceMode}
                onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                className="w-5 h-5 text-purple focus:ring-purple rounded"
              />
              <span className="text-gray-700 font-semibold">Enable Maintenance Mode</span>
            </label>
            {formData.maintenanceMode && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Maintenance Message</label>
                <textarea
                  value={formData.maintenanceMessage}
                  onChange={(e) => setFormData({ ...formData, maintenanceMessage: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="Enter maintenance message..."
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => toggleSection('security')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h2 className="text-xl font-bold text-purple">Security Settings</h2>
          {expandedSections.has('security') ? (
            <FiChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
        {expandedSections.has('security') && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  min="5"
                  value={formData.sessionTimeout}
                  onChange={(e) => setFormData({ ...formData, sessionTimeout: parseInt(e.target.value) || 60 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Login Attempts</label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={formData.maxLoginAttempts}
                  onChange={(e) => setFormData({ ...formData, maxLoginAttempts: parseInt(e.target.value) || 5 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Lockout Duration (minutes)</label>
                <input
                  type="number"
                  min="5"
                  value={formData.lockoutDuration}
                  onChange={(e) => setFormData({ ...formData, lockoutDuration: parseInt(e.target.value) || 30 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

