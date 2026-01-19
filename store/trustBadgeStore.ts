import { create } from 'zustand'

export interface TrustBadge {
  id: string
  text: string
  icon?: string
  borderColor: string
  position: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface TrustBadgeStore {
  badges: TrustBadge[]
  isLoading: boolean
  error: string | null
  initialize: () => Promise<void>
  addBadge: (badge: Omit<TrustBadge, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateBadge: (id: string, badge: Partial<TrustBadge>) => Promise<void>
  deleteBadge: (id: string) => Promise<void>
  getBadge: (id: string) => TrustBadge | undefined
  getActiveBadges: () => TrustBadge[]
  getAllBadges: () => TrustBadge[]
}

// Fetch trust badges from API
async function fetchTrustBadges(): Promise<TrustBadge[]> {
  try {
    const response = await fetch('/api/trust-badges')
    const data = await response.json()
    if (data.success && data.badges) {
      return data.badges
    }
    return []
  } catch (error) {
    console.error('Error fetching trust badges from API:', error)
    return []
  }
}

export const useTrustBadgeStore = create<TrustBadgeStore>((set, get) => ({
  badges: [],
  isLoading: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null })
    try {
      const badges = await fetchTrustBadges()
      set({ badges, isLoading: false })
    } catch (error: any) {
      console.error('Error initializing trust badges:', error)
      set({ error: error.message, isLoading: false })
    }
  },

  addBadge: async (badgeData) => {
    try {
      const response = await fetch('/api/trust-badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(badgeData)
      })
      const data = await response.json()
      if (data.success && data.badge) {
        set((state) => ({ badges: [...state.badges, data.badge] }))
        // Dispatch event for other tabs/windows
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('trustBadgesUpdated'))
        }
      } else {
        throw new Error(data.error || 'Failed to create trust badge')
      }
    } catch (error: any) {
      console.error('Error adding trust badge:', error)
      throw error
    }
  },

  updateBadge: async (id, updates) => {
    try {
      const response = await fetch(`/api/trust-badges/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const data = await response.json()
      if (data.success && data.badge) {
        set((state) => ({
          badges: state.badges.map(b => b.id === id ? data.badge : b)
        }))
        // Dispatch event for other tabs/windows
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('trustBadgesUpdated'))
        }
      } else {
        throw new Error(data.error || 'Failed to update trust badge')
      }
    } catch (error: any) {
      console.error('Error updating trust badge:', error)
      throw error
    }
  },

  deleteBadge: async (id) => {
    try {
      const response = await fetch(`/api/trust-badges/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        set((state) => ({
          badges: state.badges.filter(b => b.id !== id)
        }))
        // Dispatch event for other tabs/windows
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('trustBadgesUpdated'))
        }
      } else {
        throw new Error(data.error || 'Failed to delete trust badge')
      }
    } catch (error: any) {
      console.error('Error deleting trust badge:', error)
      throw error
    }
  },

  getBadge: (id) => {
    return get().badges.find(b => b.id === id)
  },

  getActiveBadges: () => {
    return get().badges.filter(b => b.isActive).sort((a, b) => a.position - b.position)
  },

  getAllBadges: () => {
    return get().badges
  },
}))
