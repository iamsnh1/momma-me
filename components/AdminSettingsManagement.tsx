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

  const handleSave = async () => {
    try {
      await updateSettings(formData)
      // Re-initialize to get the latest from database
      await initialize()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      alert('✅ Settings saved successfully to database! All users will see these changes.')
    } catch (error: any) {
      alert(`❌ Error saving settings: ${error.message || 'Unknown error'}`)
      console.error('Error saving settings:', error)
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple mb-2">Application Settings</h1>
          <p className="text-gray-600">Manage store configuration and preferences</p>
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
          Settings saved successfully!
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* General Settings */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('general')}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
            {expandedSections.has('general') ? (
              <FiChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections.has('general') && (
            <div className="mt-4 space-y-4">
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Store Description</label>
                <textarea
                  value={formData.storeDescription}
                  onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          )}
        </div>

        {/* E-commerce Settings */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('ecommerce')}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-xl font-bold text-gray-900">E-commerce Settings</h2>
            {expandedSections.has('ecommerce') ? (
              <FiChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections.has('ecommerce') && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  />
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Free Shipping Threshold</label>
                  <input
                    type="number"
                    value={formData.freeShippingThreshold}
                    onChange={(e) => setFormData({ ...formData, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Shipping Costs</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Standard</label>
                    <input
                      type="number"
                      value={formData.shippingCosts.standard}
                      onChange={(e) => updateShippingCost('standard', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Express</label>
                    <input
                      type="number"
                      value={formData.shippingCosts.express}
                      onChange={(e) => updateShippingCost('express', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Overnight</label>
                    <input
                      type="number"
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
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('payment')}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-xl font-bold text-gray-900">Payment Settings</h2>
            {expandedSections.has('payment') ? (
              <FiChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections.has('payment') && (
            <div className="mt-4 space-y-2">
              {Object.entries(formData.paymentMethods).map(([method, enabled]) => (
                <label key={method} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => updatePaymentMethod(method as keyof AppSettings['paymentMethods'], e.target.checked)}
                    className="w-4 h-4 text-purple focus:ring-purple rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700 capitalize">{method.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Email Settings */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('email')}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-xl font-bold text-gray-900">Email Settings</h2>
            {expandedSections.has('email') ? (
              <FiChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections.has('email') && (
            <div className="mt-4 space-y-4">
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Notifications</label>
                <div className="space-y-2">
                  {Object.entries(formData.emailNotifications).map(([notification, enabled]) => (
                    <label key={notification} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => updateEmailNotification(notification as keyof AppSettings['emailNotifications'], e.target.checked)}
                        className="w-4 h-4 text-purple focus:ring-purple rounded"
                      />
                      <span className="text-sm font-semibold text-gray-700 capitalize">{notification.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Display Settings */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('display')}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-xl font-bold text-gray-900">Display Settings</h2>
            {expandedSections.has('display') ? (
              <FiChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections.has('display') && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Products Per Page</label>
                <input
                  type="number"
                  value={formData.productsPerPage}
                  onChange={(e) => setFormData({ ...formData, productsPerPage: parseInt(e.target.value) || 12 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableReviews}
                    onChange={(e) => setFormData({ ...formData, enableReviews: e.target.checked })}
                    className="w-4 h-4 text-purple focus:ring-purple rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700">Enable Reviews</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableWishlist}
                    onChange={(e) => setFormData({ ...formData, enableWishlist: e.target.checked })}
                    className="w-4 h-4 text-purple focus:ring-purple rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700">Enable Wishlist</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableNewsletter}
                    onChange={(e) => setFormData({ ...formData, enableNewsletter: e.target.checked })}
                    className="w-4 h-4 text-purple focus:ring-purple rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700">Enable Newsletter</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Maintenance Mode */}
        <div>
          <button
            onClick={() => toggleSection('maintenance')}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-xl font-bold text-gray-900">Maintenance Mode</h2>
            {expandedSections.has('maintenance') ? (
              <FiChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections.has('maintenance') && (
            <div className="mt-4 space-y-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode}
                  onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 text-purple focus:ring-purple rounded"
                />
                <span className="text-sm font-semibold text-gray-700">Enable Maintenance Mode</span>
              </label>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Maintenance Message</label>
                <textarea
                  value={formData.maintenanceMessage}
                  onChange={(e) => setFormData({ ...formData, maintenanceMessage: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
