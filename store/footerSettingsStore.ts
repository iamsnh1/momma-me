import { create } from 'zustand'

export interface FooterSettings {
  companyDescription: string
  quickLinks: Array<{ label: string; url: string }>
  socialMedia: {
    facebook: string
    instagram: string
    twitter: string
    pinterest?: string
  }
  contactInfo: {
    phone: string
    email: string
    address: string
    hours: string
  }
  copyright: string
  updatedAt?: string
}

interface FooterSettingsStore {
  settings: FooterSettings
  isLoading: boolean
  error: string | null
  initialize: () => Promise<void>
  updateSettings: (settings: Partial<FooterSettings>) => Promise<void>
  resetSettings: () => void
}

// Default footer settings
const defaultSettings: FooterSettings = {
  companyDescription: 'Your trusted partner for premium baby and mom products.',
  quickLinks: [
    { label: 'About Us', url: '/about' },
    { label: 'Contact', url: '/contact' },
    { label: 'Shipping', url: '/shipping' },
    { label: 'Returns', url: '/returns' }
  ],
  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: '',
    pinterest: ''
  },
  contactInfo: {
    phone: '',
    email: '',
    address: '',
    hours: 'Mon-Fri: 9AM-6PM EST'
  },
  copyright: 'Copyright © 2024 Momma & Me. All rights reserved.'
}

// Fetch footer settings from API
async function fetchFooterSettings(): Promise<FooterSettings | null> {
  try {
    const response = await fetch('/api/footer')
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('Non-JSON response from footer API:', text.substring(0, 200))
      return null
    }
    
    const data = await response.json()
    if (data.success && data.settings) {
      return data.settings
    }
    // If settings is null, that's okay - means no settings saved yet
    return null
  } catch (error) {
    console.error('Error fetching footer settings from API:', error)
    return null
  }
}

export const useFooterSettingsStore = create<FooterSettingsStore>((set, get) => ({
  settings: defaultSettings,
  isLoading: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null })
    try {
      const settings = await fetchFooterSettings()
      if (settings) {
        set({ settings, isLoading: false })
      } else {
        set({ settings: defaultSettings, isLoading: false })
      }
    } catch (error: any) {
      console.error('Error initializing footer settings:', error)
      set({ error: error.message, isLoading: false, settings: defaultSettings })
    }
  },

  updateSettings: async (updates) => {
    try {
      const currentSettings = get().settings
      const newSettings = { ...currentSettings, ...updates }
      
      const response = await fetch('/api/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      })
      const data = await response.json()
      if (data.success && data.settings) {
        set({ settings: data.settings })
        // Dispatch event for other tabs/windows
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('footerSettingsUpdated'))
        }
      } else {
        throw new Error(data.error || 'Failed to update footer settings')
      }
    } catch (error: any) {
      console.error('Error updating footer settings:', error)
      throw error
    }
  },

  resetSettings: () => {
    set({ settings: defaultSettings })
  }
}))
