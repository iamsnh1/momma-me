import { create } from 'zustand'

export interface Banner {
  id: string
  title: string
  subtitle?: string
  image: string
  link?: string
  type: 'hero' | 'boutique' | 'promotional' | 'advertisement'
  position: number
  active: boolean
  isActive?: boolean
  buttonText?: string
  startDate?: string
  endDate?: string
  createdAt?: string
  updatedAt?: string
}

interface BannerStore {
  banners: Banner[]
  isLoading: boolean
  error: string | null
  initialize: () => Promise<void>
  addBanner: (banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateBanner: (id: string, banner: Partial<Banner>) => Promise<void>
  deleteBanner: (id: string) => Promise<void>
  getBannersByType: (type: Banner['type']) => Banner[]
  getBanner: (id: string) => Banner | undefined
}

// Fetch banners from API
async function fetchBanners(): Promise<Banner[]> {
  try {
    const response = await fetch('/api/banners')
    const data = await response.json()
    if (data.success && data.banners) {
      return data.banners
    }
    return []
  } catch (error) {
    console.error('Error fetching banners from API:', error)
    return []
  }
}

export const useBannerStore = create<BannerStore>((set, get) => ({
  banners: [],
  isLoading: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null })
    try {
      const banners = await fetchBanners()
      set({ banners, isLoading: false })
    } catch (error: any) {
      console.error('Error initializing banners:', error)
      set({ error: error.message, isLoading: false })
    }
  },

  addBanner: async (banner) => {
    try {
      const response = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner)
      })
      const data = await response.json()
      if (data.success && data.banner) {
        set((state) => ({ banners: [...state.banners, data.banner] }))
        // Dispatch event for other tabs/windows
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('bannerUpdated'))
        }
      } else {
        throw new Error(data.error || 'Failed to create banner')
      }
    } catch (error: any) {
      console.error('Error adding banner:', error)
      throw error
    }
  },

  updateBanner: async (id, updates) => {
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const data = await response.json()
      if (data.success && data.banner) {
        set((state) => ({
          banners: state.banners.map(b => b.id === id ? data.banner : b)
        }))
        // Dispatch event for other tabs/windows
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('bannerUpdated'))
        }
      } else {
        throw new Error(data.error || 'Failed to update banner')
      }
    } catch (error: any) {
      console.error('Error updating banner:', error)
      throw error
    }
  },

  deleteBanner: async (id) => {
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        set((state) => ({
          banners: state.banners.filter(b => b.id !== id)
        }))
        // Dispatch event for other tabs/windows
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('bannerUpdated'))
        }
      } else {
        throw new Error(data.error || 'Failed to delete banner')
      }
    } catch (error: any) {
      console.error('Error deleting banner:', error)
      throw error
    }
  },

  getBannersByType: (type) => {
    return get().banners.filter(b => b.type === type && (b.active || b.isActive))
  },

  getBanner: (id) => {
    return get().banners.find(b => b.id === id)
  }
}))
