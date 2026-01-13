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
}

const STORAGE_KEY = 'momma-me-footer-settings'

const defaultSettings: FooterSettings = {
  companyDescription: 'Your trusted destination for premium baby essentials from birth to 3 years. We offer a comprehensive collection of safe, high-quality products including feeding supplies, clothing, toys, nursery furniture, strollers, car seats, baby care items, and developmental toys.',
  quickLinks: [
    { label: 'Home', url: '/' },
    { label: 'About Us', url: '#about' },
    { label: 'Gallery', url: '#gallery' },
    { label: 'Contact Us', url: '#contact' }
  ],
  socialMedia: {
    facebook: '#',
    instagram: '#',
    twitter: '#',
    pinterest: '#'
  },
  contactInfo: {
    phone: '+1 (555) 123-4567',
    email: 'Momma&Me@example.com',
    address: '123 Baby Street, City, State 12345',
    hours: 'Mon-Fri: 9AM-6PM EST'
  },
  copyright: 'Copyright © 2024 Momma & Me. All rights reserved.'
}

const loadSettings = (): FooterSettings => {
  if (typeof window === 'undefined') return defaultSettings
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...defaultSettings, ...parsed }
    }
  } catch (e) {
    console.error('Error loading footer settings from localStorage:', e)
  }
  return defaultSettings
}

const saveSettings = (settings: FooterSettings) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error('Error saving footer settings to localStorage:', e)
  }
}

interface FooterSettingsStore {
  settings: FooterSettings
  initialize: () => void
  updateSettings: (settings: Partial<FooterSettings>) => void
  resetSettings: () => void
}

export const useFooterSettingsStore = create<FooterSettingsStore>((set, get) => ({
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
}))


