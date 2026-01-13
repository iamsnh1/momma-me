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

// Save products to localStorage
const saveProducts = (products: Product[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    // Mark that we've saved data
    localStorage.setItem(`${STORAGE_KEY}_initialized`, 'true')
    console.log(`✅ Saved ${products.length} products to localStorage`)
  } catch (e) {
    console.error('Error saving products to localStorage:', e)
    // Check if it's a quota error
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please clear some space or contact support.')
    }
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
    // Only initialize if we don't already have products loaded
    // This prevents overwriting current state
    const currentProducts = get().products
    if (currentProducts.length === 0) {
      const loaded = loadProducts()
      set({ products: loaded })
    } else {
      // Refresh from localStorage to get latest saved data
      const loaded = loadProducts()
      if (loaded.length > 0) {
        set({ products: loaded })
      }
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

