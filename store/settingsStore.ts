import { create } from 'zustand'

export interface AppSettings {
  // General Settings
  storeName: string
  storeDescription: string
  storeEmail: string
  storePhone: string
  storeAddress: string
  
  // E-commerce Settings
  currency: string
  currencySymbol: string
  taxRate: number
  freeShippingThreshold: number
  shippingCosts: {
    standard: number
    express: number
    overnight: number
  }
  
  // Payment Settings
  paymentMethods: {
    creditCard: boolean
    paypal: boolean
    bankTransfer: boolean
    cashOnDelivery: boolean
  }
  
  // Email Settings
  emailNotifications: {
    newOrder: boolean
    orderStatusChange: boolean
    newCustomer: boolean
    lowStock: boolean
  }
  adminEmail: string
  
  // Image Settings
  allowedImageDomains: string[]
  
  // Maintenance Mode
  maintenanceMode: boolean
  maintenanceMessage: string
  
  // Security Settings
  sessionTimeout: number // in minutes
  maxLoginAttempts: number
  lockoutDuration: number // in minutes
  
  // Display Settings
  productsPerPage: number
  enableReviews: boolean
  enableWishlist: boolean
  enableNewsletter: boolean
  updatedAt?: string
}

const defaultSettings: AppSettings = {
  // General
  storeName: 'M💗mma & Me',
  storeDescription: 'Premium Baby Products',
  storeEmail: 'Momma&Me@example.com',
  storePhone: '+1 (555) 123-4567',
  storeAddress: '123 Baby Street, City, State 12345',
  
  // E-commerce
  currency: 'INR',
  currencySymbol: '₹',
  taxRate: 8,
  freeShippingThreshold: 50,
  shippingCosts: {
    standard: 0,
    express: 9.99,
    overnight: 19.99
  },
  
  // Payment
  paymentMethods: {
    creditCard: true,
    paypal: true,
    bankTransfer: false,
    cashOnDelivery: false
  },
  
  // Email
  emailNotifications: {
    newOrder: true,
    orderStatusChange: true,
    newCustomer: true,
    lowStock: true
  },
  adminEmail: 'admin@mommaandme.com',
  
  // Image
  allowedImageDomains: ['images.unsplash.com', 'via.placeholder.com'],
  
  // Maintenance
  maintenanceMode: false,
  maintenanceMessage: 'We are currently performing maintenance. Please check back soon.',
  
  // Security
  sessionTimeout: 60,
  maxLoginAttempts: 5,
  lockoutDuration: 30,
  
  // Display
  productsPerPage: 12,
  enableReviews: true,
  enableWishlist: true,
  enableNewsletter: true
}

// Fetch settings from API
async function fetchSettings(): Promise<AppSettings | null> {
  try {
    const response = await fetch('/api/settings')
    const data = await response.json()
    if (data.success && data.settings) {
      return data.settings
    }
    return null
  } catch (error) {
    console.error('Error fetching settings from API:', error)
    return null
  }
}

interface SettingsStore {
  settings: AppSettings
  isLoading: boolean
  error: string | null
  initialize: () => Promise<void>
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>
  resetSettings: () => void
  getSetting: <K extends keyof AppSettings>(key: K) => AppSettings[K]
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: defaultSettings,
  isLoading: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null })
    try {
      const settings = await fetchSettings()
      if (settings) {
        set({ settings, isLoading: false })
      } else {
        set({ settings: defaultSettings, isLoading: false })
      }
    } catch (error: any) {
      console.error('Error initializing settings:', error)
      set({ error: error.message, isLoading: false, settings: defaultSettings })
    }
  },

  updateSettings: async (updates) => {
    try {
      const currentSettings = get().settings
      const newSettings = { ...currentSettings, ...updates }
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      })
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response from API:', text.substring(0, 200))
        throw new Error('Server returned an error page instead of JSON. Check server logs.')
      }
      
      const data = await response.json()
      if (data.success && data.settings) {
        set({ settings: data.settings })
        // Dispatch event for other tabs/windows
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('settingsUpdated'))
        }
      } else {
        throw new Error(data.error || 'Failed to update settings')
      }
    } catch (error: any) {
      console.error('Error updating settings:', error)
      throw error
    }
  },

  resetSettings: () => {
    set({ settings: defaultSettings })
  },

  getSetting: (key) => {
    return get().settings[key]
  },
}))
