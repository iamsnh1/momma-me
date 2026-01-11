import { create } from 'zustand'
import { Product } from './cartStore'
import { products as initialProducts } from '@/data/products'

const STORAGE_KEY = 'momma-me-products'

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
        return parsed
      }
    }
  } catch (e) {
    console.error('Error loading products from localStorage:', e)
  }
  // Return initial products if localStorage is empty
  return initialProducts
}

// Save products to localStorage
const saveProducts = (products: Product[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  } catch (e) {
    console.error('Error saving products to localStorage:', e)
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
    const loaded = loadProducts()
    set({ products: loaded })
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

