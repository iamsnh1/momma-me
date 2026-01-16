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
}

const STORAGE_KEY = 'momma-me-app-settings'

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

const loadSettings = (): AppSettings => {
  if (typeof window === 'undefined') return defaultSettings
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...defaultSettings, ...parsed }
    }
  } catch (e) {
    console.error('Error loading settings from localStorage:', e)
  }
  return defaultSettings
}

const saveSettings = (settings: AppSettings) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error('Error saving settings to localStorage:', e)
  }
}

interface SettingsStore {
  settings: AppSettings
  initialize: () => void
  updateSettings: (settings: Partial<AppSettings>) => void
  resetSettings: () => void
  getSetting: <K extends keyof AppSettings>(key: K) => AppSettings[K]
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: loadSettings(),

  initialize: () => {
    const loaded = loadSettings()
    set({ settings: loaded })
  },

  updateSettings: (newSettings) => {
    const updated = { ...get().settings, ...newSettings }
    set({ settings: updated })
    saveSettings(updated)
  },

  resetSettings: () => {
    set({ settings: defaultSettings })
    saveSettings(defaultSettings)
  },

  getSetting: (key) => {
    return get().settings[key]
  },
}))




