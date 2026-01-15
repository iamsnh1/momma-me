import { create } from 'zustand'
import { Product } from './cartStore'
import { products as initialProducts } from '@/data/products'

const STORAGE_KEY = 'momma-me-products'

// Track if we've ever saved data to localStorage
const hasSavedData = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(`${STORAGE_KEY}_initialized`) === 'true'
}

// Load products from localStorage or use initial products
const loadProducts = (): Product[] => {
  if (typeof window === 'undefined') {
    return initialProducts
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        // If we have saved data, always use it (don't fall back to initial)
        return parsed
      }
    }
    // Only return initial products if we've NEVER saved data before
    // This prevents overwriting admin changes
    if (!hasSavedData()) {
      return initialProducts
    }
    // If we had saved data but it's now empty/corrupted, return empty array
    // This preserves the fact that admin has made changes
    return []
  } catch (e) {
    console.error('Error loading products from localStorage:', e)
    // If we've saved data before, don't overwrite with initial
    if (hasSavedData()) {
      return []
    }
    return initialProducts
  }
}

// Save products to localStorage with backup and base64 image removal
const saveProducts = (products: Product[]) => {
  if (typeof window === 'undefined') return
  try {
    // Remove base64 images to save space (they should be URLs from Spaces)
    const productsWithoutBase64 = products.map(p => {
      // If image is base64 (starts with data:), remove it or keep URL
      if (p.image && p.image.startsWith('data:image/')) {
        console.warn(`⚠️ Product "${p.name}" has base64 image. Removing to save space. Please upload to Spaces.`)
        return { ...p, image: '' } // Remove base64 image
      }
      return p
    })
    
    // Clean up old backups FIRST to free space
    try {
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(`${STORAGE_KEY}_backup_`))
        .sort()
        .reverse()
        .slice(2) // Keep only last 2 (reduced from 3)
      backupKeys.forEach(key => {
        try {
          localStorage.removeItem(key)
        } catch (e) {
          console.warn('Failed to remove backup:', key)
        }
      })
    } catch (e) {
      console.warn('Failed to clean up backups:', e)
    }
    
    // Try to create backup (but don't fail if it doesn't work)
    try {
      const currentData = localStorage.getItem(STORAGE_KEY)
      if (currentData && currentData.length < 500 * 1024) { // Only backup if < 500KB
        const backupKey = `${STORAGE_KEY}_backup_${Date.now()}`
        localStorage.setItem(backupKey, currentData)
      }
    } catch (e) {
      console.warn('Could not create backup (quota may be full):', e)
    }
    
    // Calculate size before saving
    const dataToSave = JSON.stringify(productsWithoutBase64)
    const dataSize = dataToSave.length
    const dataSizeMB = (dataSize / (1024 * 1024)).toFixed(2)
    
    // Check if data is too large
    const MAX_SIZE = 2 * 1024 * 1024 // 2MB limit (reduced from default)
    if (dataSize > MAX_SIZE) {
      console.error(`Product data too large: ${dataSizeMB} MB (limit: 2 MB)`)
      // Remove products with base64 images first
      const cleanedProducts = productsWithoutBase64.filter(p => {
        // Keep products with URLs or no images
        return !p.image || (!p.image.startsWith('data:') && p.image.startsWith('http'))
      })
      
      const cleanedData = JSON.stringify(cleanedProducts)
      if (cleanedData.length > MAX_SIZE) {
        throw new Error(`Product data still too large after cleanup (${(cleanedData.length / 1024 / 1024).toFixed(2)} MB). Please remove products with large images or use image URLs from Spaces.`)
      }
      
      // Save cleaned products
      localStorage.setItem(STORAGE_KEY, cleanedData)
      localStorage.setItem(`${STORAGE_KEY}_initialized`, 'true')
      localStorage.setItem(`${STORAGE_KEY}_lastSaved`, new Date().toISOString())
      console.log(`✅ Saved ${cleanedProducts.length} products (removed ${productsWithoutBase64.length - cleanedProducts.length} with base64 images)`)
      return
    }
    
    // Save new data
    localStorage.setItem(STORAGE_KEY, dataToSave)
    // Mark that we've saved data with timestamp
    localStorage.setItem(`${STORAGE_KEY}_initialized`, 'true')
    localStorage.setItem(`${STORAGE_KEY}_lastSaved`, new Date().toISOString())
    console.log(`✅ Saved ${productsWithoutBase64.length} products to localStorage (${dataSizeMB} MB)`)
  } catch (e: any) {
    console.error('Error saving products to localStorage:', e)
    // Check if it's a quota error
    if (e instanceof DOMException && e.name === 'QuotaExceededError' || e.name === 'QuotaExceededError') {
      const errorMsg = '❌ Storage quota exceeded!\n\n' +
        'Solutions:\n' +
        '1. Use image URLs from DigitalOcean Spaces (not base64)\n' +
        '2. Clear browser cache/localStorage\n' +
        '3. Remove products with large images\n' +
        '4. Make sure Spaces environment variables are set'
      alert(errorMsg)
      throw new Error('Storage quota exceeded. Please use image URLs from Spaces instead of uploading files.')
    }
    throw e // Re-throw to prevent silent failures
  }
}

interface ProductStore {
  products: Product[]
  initialize: () => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProduct: (id: string) => Product | undefined
  getProductsByCategory: (category: string) => Product[]
  getAllProducts: () => Product[]
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: loadProducts(),
  
  initialize: () => {
    // Always reload from localStorage to get latest changes
    // This ensures admin changes are reflected immediately
    const loaded = loadProducts()
    if (loaded.length > 0 || get().products.length === 0) {
      set({ products: loaded })
      console.log(`🔄 Product store initialized with ${loaded.length} products`)
    }
  },
  
  addProduct: (product) => {
    const newProducts = [...get().products, product]
    set({ products: newProducts })
    saveProducts(newProducts)
  },
  
  updateProduct: (id, updatedProduct) => {
    const newProducts = get().products.map(p => 
      p.id === id ? { ...p, ...updatedProduct } : p
    )
    set({ products: newProducts })
    saveProducts(newProducts)
  },
  
  deleteProduct: (id) => {
    const newProducts = get().products.filter(p => p.id !== id)
    set({ products: newProducts })
    saveProducts(newProducts)
  },
  
  getProduct: (id) => {
    return get().products.find(p => p.id === id)
  },
  
  getProductsByCategory: (category) => {
    return get().products.filter(p => p.category === category)
  },
  
  getAllProducts: () => {
    return get().products
  }
}))

