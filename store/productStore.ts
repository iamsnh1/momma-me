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
    // Remove base64 images - only store URLs (images are in database, not localStorage)
    const productsWithoutBase64 = products.map(p => {
      // If image is base64 (starts with data:), remove it - images must be in database
      if (p.image && p.image.startsWith('data:image/')) {
        console.warn(`⚠️ Product "${p.name}" has base64 image. Removing - images must be stored in database, not localStorage.`)
        return { ...p, image: '' } // Remove base64 image
      }
      // Keep URLs (like /api/images/123) - these reference images in the database
      return p
    })
    
    // Clean up ALL old backups FIRST to free maximum space
    try {
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(`${STORAGE_KEY}_backup_`))
      // Remove ALL backups to free space
      backupKeys.forEach(key => {
        try {
          localStorage.removeItem(key)
          console.log('Removed old backup:', key)
        } catch (e) {
          console.warn('Failed to remove backup:', key)
        }
      })
      console.log(`Cleaned up ${backupKeys.length} old backups`)
    } catch (e) {
      console.warn('Failed to clean up backups:', e)
    }
    
    // DON'T create backups if we're near quota limit - it causes errors
    // Backups are optional and not worth failing the save operation
    
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
    
    // Try to save - if it fails due to quota, try cleaning more
    try {
      localStorage.setItem(STORAGE_KEY, dataToSave)
      localStorage.setItem(`${STORAGE_KEY}_initialized`, 'true')
      localStorage.setItem(`${STORAGE_KEY}_lastSaved`, new Date().toISOString())
      console.log(`✅ Saved ${productsWithoutBase64.length} products to localStorage (${dataSizeMB} MB)`)
    } catch (saveError: any) {
      if (saveError.name === 'QuotaExceededError' || saveError instanceof DOMException && saveError.name === 'QuotaExceededError') {
        console.warn('Quota exceeded, trying to clean more...')
        // Remove all products with any images (keep only products without images)
        const minimalProducts = productsWithoutBase64.map(p => ({
          ...p,
          image: '' // Remove all images to save space
        }))
        const minimalData = JSON.stringify(minimalProducts)
        try {
          localStorage.setItem(STORAGE_KEY, minimalData)
          localStorage.setItem(`${STORAGE_KEY}_initialized`, 'true')
          localStorage.setItem(`${STORAGE_KEY}_lastSaved`, new Date().toISOString())
          console.log(`✅ Saved ${minimalProducts.length} products without images (quota was full)`)
          const errorMsg = '⚠️ Storage quota was full!\n\n' +
            'Images were removed to save space.\n\n' +
            'To fix this:\n' +
            '1. Add DigitalOcean Spaces environment variables\n' +
            '2. Use image URLs from Spaces (not base64)\n' +
            '3. Clear browser cache: localStorage.clear()'
          alert(errorMsg)
          throw new Error('Storage quota exceeded. Images were removed. Please use image URLs from Spaces.')
        } catch (minimalError: any) {
          // Even minimal save failed - localStorage is completely full
          const errorMsg = '❌ Storage quota completely full!\n\n' +
            'Please:\n' +
            '1. Open browser console (F12)\n' +
            '2. Run: localStorage.clear()\n' +
            '3. Refresh the page\n' +
            '4. Add DigitalOcean Spaces environment variables\n' +
            '5. Use image URLs instead of uploading files'
          alert(errorMsg)
          throw new Error('Storage quota completely full. Please clear localStorage and use Spaces for images.')
        }
      }
      throw saveError
    }
  } catch (e: any) {
    console.error('Error saving products to localStorage:', e)
    // Re-throw with helpful message
    if (e.message && !e.message.includes('quota')) {
      throw new Error(`Failed to save products: ${e.message}`)
    }
    throw e
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

