import { create } from 'zustand'

export interface Banner {
  id: string
  title: string
  subtitle?: string
  image: string
  link?: string
  type: 'hero' | 'promotional' | 'boutique' | 'advertisement'
  position: number
  isActive: boolean
  startDate?: string
  endDate?: string
  buttonText?: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'momma-me-banners'

// Initial banners for homepage display
const initialBanners: Banner[] = [
  {
    id: 'hero-1',
    title: 'Where Comfort Meets Cuteness',
    subtitle: '100% Pure Cotton Love',
    image: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=1920&h=800&fit=crop',
    link: '/products',
    type: 'hero',
    position: 1,
    isActive: true,
    buttonText: 'Shop New Arrivals',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'hero-2',
    title: 'Made for Your Little One',
    subtitle: 'Soft, Safe, and Simply Perfect',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1920&h=800&fit=crop',
    link: '/products',
    type: 'hero',
    position: 2,
    isActive: true,
    buttonText: 'Shop New Arrivals',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'hero-3',
    title: 'Every Moment is Precious',
    subtitle: 'Premium Quality for Your Baby',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1920&h=800&fit=crop',
    link: '/products',
    type: 'hero',
    position: 3,
    isActive: true,
    buttonText: 'Shop New Arrivals',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'boutique-1',
    title: 'Winter WONDERLAND',
    subtitle: 'Launching Winter 25 Collection',
    image: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=600&h=450&fit=crop',
    link: '/products?category=fashion',
    type: 'boutique',
    position: 1,
    isActive: true,
    buttonText: 'FLAT 40% OFF',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'boutique-2',
    title: 'Turn Up the WARMTH',
    subtitle: 'Jeans, Jackets & More',
    image: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=600&h=450&fit=crop',
    link: '/products?category=fashion',
    type: 'boutique',
    position: 2,
    isActive: true,
    buttonText: 'UPTO 50% OFF',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'boutique-3',
    title: 'That Feel Like a Hug!',
    subtitle: 'Powered By babyhug',
    image: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=600&h=450&fit=crop',
    link: '/products',
    type: 'boutique',
    position: 3,
    isActive: true,
    buttonText: 'MIN 20% OFF',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Track if we've ever saved data to localStorage
const hasSavedBanners = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(`${STORAGE_KEY}_initialized`) === 'true'
}

// Load banners from localStorage or use initial banners
const loadBanners = (): Banner[] => {
  if (typeof window === 'undefined') return initialBanners
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
    // Only return initial banners if we've NEVER saved data before
    if (!hasSavedBanners()) {
      return initialBanners
    }
    return []
  } catch (e) {
    console.error('Error loading banners from localStorage:', e)
    if (hasSavedBanners()) {
      return []
    }
    return initialBanners
  }
}

// Save banners to localStorage with automatic size management
const saveBanners = (banners: Banner[]): boolean => {
  if (typeof window === 'undefined') return false
  try {
    // Calculate total size
    const data = JSON.stringify(banners)
    const dataSize = data.length
    const dataSizeMB = (dataSize / (1024 * 1024)).toFixed(2)
    
    console.log(`Saving banners: ${banners.length} banners, Total size: ${dataSizeMB} MB`)
    
    // Check if data is too large (localStorage limit is usually 5-10MB, we use 3MB to be safe)
    const MAX_SIZE = 3 * 1024 * 1024 // 3MB limit to be safe
    if (dataSize > MAX_SIZE) {
      console.error(`Banner data too large: ${dataSizeMB} MB (limit: 3 MB)`)
      
      // Try to compress by removing oldest inactive banners
      const activeBanners = banners.filter(b => b.isActive)
      const inactiveBanners = banners.filter(b => !b.isActive).sort((a, b) => 
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      )
      
      // Remove oldest inactive banners until we're under limit
      let compressedBanners = [...activeBanners, ...inactiveBanners]
      let compressedData = JSON.stringify(compressedBanners)
      
      while (compressedData.length > MAX_SIZE && inactiveBanners.length > 0) {
        inactiveBanners.shift() // Remove oldest inactive
        compressedBanners = [...activeBanners, ...inactiveBanners]
        compressedData = JSON.stringify(compressedBanners)
      }
      
      if (compressedData.length <= MAX_SIZE) {
        console.log(`Compressed by removing ${banners.length - compressedBanners.length} inactive banners`)
        localStorage.setItem(STORAGE_KEY, compressedData)
        return true
      }
      
      return false
    }
    
    localStorage.setItem(STORAGE_KEY, data)
    localStorage.setItem(`${STORAGE_KEY}_initialized`, 'true')
    console.log(`✅ Saved ${banners.length} banners to localStorage`)
    return true
  } catch (e: any) {
    console.error('Error saving banners to localStorage:', e)
    // Check if it's a quota exceeded error
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      console.error('localStorage quota exceeded. Please use smaller images or remove some banners.')
      
      // Try to save only active banners as fallback
      try {
        const activeBanners = banners.filter(b => b.isActive)
        const fallbackData = JSON.stringify(activeBanners)
        if (fallbackData.length < 3 * 1024 * 1024) {
          localStorage.setItem(STORAGE_KEY, fallbackData)
          console.log('Saved only active banners as fallback')
          return true
        }
      } catch (fallbackError) {
        console.error('Fallback save also failed:', fallbackError)
      }
    }
    return false
  }
}

interface BannerStore {
  banners: Banner[]
  initialize: () => void
  addBanner: (banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBanner: (id: string, banner: Partial<Banner>) => void
  deleteBanner: (id: string) => void
  getBanner: (id: string) => Banner | undefined
  getBannersByType: (type: Banner['type']) => Banner[]
  getActiveBanners: () => Banner[]
  getAllBanners: () => Banner[]
}

export const useBannerStore = create<BannerStore>((set, get) => ({
  banners: loadBanners(),

  initialize: () => {
    const currentBanners = get().banners
    if (currentBanners.length === 0) {
      const loaded = loadBanners()
      set({ banners: loaded })
    } else {
      const loaded = loadBanners()
      if (loaded.length > 0) {
        set({ banners: loaded })
      }
    }
  },

  addBanner: (bannerData) => {
    const newBanner: Banner = {
      ...bannerData,
      id: `banner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const newBanners = [...get().banners, newBanner]
    const saved = saveBanners(newBanners)
    if (saved) {
      set({ banners: newBanners })
    } else {
      throw new Error('Failed to save banner. Image may be too large. Please use a smaller image or compress it.')
    }
  },

  updateBanner: (id, updatedBanner) => {
    const newBanners = get().banners.map(b =>
      b.id === id ? { ...b, ...updatedBanner, updatedAt: new Date().toISOString() } : b
    )
    const saved = saveBanners(newBanners)
    if (saved) {
      set({ banners: newBanners })
    } else {
      throw new Error('Failed to save banner. Image may be too large. Please use a smaller image or compress it.')
    }
  },

  deleteBanner: (id) => {
    const newBanners = get().banners.filter(b => b.id !== id)
    const saved = saveBanners(newBanners)
    if (saved) {
      set({ banners: newBanners })
    } else {
      throw new Error('Failed to delete banner. Please try again.')
    }
  },

  getBanner: (id) => {
    return get().banners.find(b => b.id === id)
  },

  getBannersByType: (type) => {
    return get().banners.filter(b => b.type === type && b.isActive)
  },

  getActiveBanners: () => {
    return get().banners.filter(b => b.isActive)
  },

  getAllBanners: () => {
    return get().banners
  },
}))

