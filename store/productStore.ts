import { create } from 'zustand'
import { Product } from './cartStore'
import { products as initialProducts } from '@/data/products'

interface ProductStore {
  products: Product[]
  isLoading: boolean
  error: string | null
  initialize: () => Promise<void>
  addProduct: (product: Product) => Promise<void>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  getProduct: (id: string) => Product | undefined
  getProductsByCategory: (category: string) => Product[]
  getAllProducts: () => Product[]
}

// Fetch products from API
async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products')
    const data = await response.json()
    if (data.success && data.products) {
      return data.products
    }
    // Fallback to initial products if API fails
    return initialProducts
  } catch (error) {
    console.error('Error fetching products from API:', error)
    // Fallback to initial products
    return initialProducts
  }
}

// Save product via API
async function saveProductToAPI(product: Product): Promise<Product> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to save product')
  }
  return data.product
}

// Update product via API
async function updateProductInAPI(id: string, updates: Partial<Product>): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to update product')
  }
  return data.product
}

// Delete product via API
async function deleteProductFromAPI(id: string): Promise<void> {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  })
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to delete product')
  }
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  
  initialize: async () => {
    set({ isLoading: true, error: null })
    try {
      const products = await fetchProducts()
      set({ products, isLoading: false })
      console.log(`🔄 Product store initialized with ${products.length} products from database`)
    } catch (error: any) {
      console.error('Error initializing products:', error)
      set({ error: error.message, isLoading: false })
    }
  },
  
  addProduct: async (product) => {
    try {
      set({ isLoading: true, error: null })
      const newProduct = await saveProductToAPI(product)
      const newProducts = [...get().products, newProduct]
      set({ products: newProducts, isLoading: false })
      console.log('✅ Product added to database:', newProduct.name)
    } catch (error: any) {
      console.error('Error adding product:', error)
      set({ error: error.message, isLoading: false })
      throw error
    }
  },
  
  updateProduct: async (id, updatedProduct) => {
    try {
      set({ isLoading: true, error: null })
      const updated = await updateProductInAPI(id, updatedProduct)
      const newProducts = get().products.map(p => 
        p.id === id ? updated : p
      )
      set({ products: newProducts, isLoading: false })
      console.log('✅ Product updated in database:', id)
    } catch (error: any) {
      console.error('Error updating product:', error)
      set({ error: error.message, isLoading: false })
      throw error
    }
  },
  
  deleteProduct: async (id) => {
    try {
      set({ isLoading: true, error: null })
      await deleteProductFromAPI(id)
      const newProducts = get().products.filter(p => p.id !== id)
      set({ products: newProducts, isLoading: false })
      console.log('✅ Product deleted from database:', id)
    } catch (error: any) {
      console.error('Error deleting product:', error)
      set({ error: error.message, isLoading: false })
      throw error
    }
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
