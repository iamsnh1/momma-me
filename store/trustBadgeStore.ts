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

const STORAGE_KEY = 'momma-me-trust-badges'

// Initial trust badges
const initialBadges: TrustBadge[] = [
  {
    id: 'badge-1',
    text: '100% Pure Cotton',
    borderColor: 'blush-pink',
    position: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'badge-2',
    text: 'Made for Comfort',
    borderColor: 'powder-blue',
    position: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'badge-3',
    text: 'Mother-Founded',
    borderColor: 'mint-green',
    position: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Load badges from localStorage
const loadBadges = (): TrustBadge[] => {
  if (typeof window === 'undefined') return initialBadges
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Error loading trust badges from localStorage:', e)
  }
  return initialBadges
}

// Save badges to localStorage
const saveBadges = (badges: TrustBadge[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(badges))
  } catch (e) {
    console.error('Error saving trust badges to localStorage:', e)
  }
}

interface TrustBadgeStore {
  badges: TrustBadge[]
  initialize: () => void
  addBadge: (badge: Omit<TrustBadge, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBadge: (id: string, badge: Partial<TrustBadge>) => void
  deleteBadge: (id: string) => void
  getBadge: (id: string) => TrustBadge | undefined
  getActiveBadges: () => TrustBadge[]
  getAllBadges: () => TrustBadge[]
}

export const useTrustBadgeStore = create<TrustBadgeStore>((set, get) => ({
  badges: loadBadges(),

  initialize: () => {
    const loaded = loadBadges()
    set({ badges: loaded })
  },

  addBadge: (badgeData) => {
    const newBadge: TrustBadge = {
      ...badgeData,
      id: `badge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const newBadges = [...get().badges, newBadge]
    set({ badges: newBadges })
    saveBadges(newBadges)
  },

  updateBadge: (id, updatedBadge) => {
    const newBadges = get().badges.map(b =>
      b.id === id ? { ...b, ...updatedBadge, updatedAt: new Date().toISOString() } : b
    )
    set({ badges: newBadges })
    saveBadges(newBadges)
  },

  deleteBadge: (id) => {
    const newBadges = get().badges.filter(b => b.id !== id)
    set({ badges: newBadges })
    saveBadges(newBadges)
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

