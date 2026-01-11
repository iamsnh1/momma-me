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
  } catch (e) {
    console.error('Error loading banners from localStorage:', e)
  }
  // Return initial banners if localStorage is empty
  return initialBanners
}

// Save banners to localStorage
const saveBanners = (banners: Banner[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banners))
  } catch (e) {
    console.error('Error saving banners to localStorage:', e)
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
    const loaded = loadBanners()
    set({ banners: loaded })
  },

  addBanner: (bannerData) => {
    const newBanner: Banner = {
      ...bannerData,
      id: `banner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const newBanners = [...get().banners, newBanner]
    set({ banners: newBanners })
    saveBanners(newBanners)
  },

  updateBanner: (id, updatedBanner) => {
    const newBanners = get().banners.map(b =>
      b.id === id ? { ...b, ...updatedBanner, updatedAt: new Date().toISOString() } : b
    )
    set({ banners: newBanners })
    saveBanners(newBanners)
  },

  deleteBanner: (id) => {
    const newBanners = get().banners.filter(b => b.id !== id)
    set({ banners: newBanners })
    saveBanners(newBanners)
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

