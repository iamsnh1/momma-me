import { create } from 'zustand'

export interface Category {
  id: string
  name: string
  slug?: string
  description?: string
  image?: string
  icon?: string
  parentId?: string
  parentCategory?: string
  active: boolean
  position?: number
  displayOrder?: number
  createdAt?: string
  updatedAt?: string
}

interface CategoryStore {
  categories: Category[]
  isLoading: boolean
  error: string | null
  initialize: () => Promise<void>
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  getActiveCategories: () => Category[]
  getCategory: (id: string) => Category | undefined
}

// Fetch categories from API
async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/api/categories')
    const data = await response.json()
    if (data.success && data.categories) {
      return data.categories
    }
    return []
  } catch (error) {
    console.error('Error fetching categories from API:', error)
    return []
  }
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null })
    try {
      const categories = await fetchCategories()
      set({ categories, isLoading: false })
    } catch (error: any) {
      console.error('Error initializing categories:', error)
      set({ error: error.message, isLoading: false })
    }
  },

  addCategory: async (category) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      })
      const data = await response.json()
      if (data.success && data.category) {
        set((state) => ({ categories: [...state.categories, data.category] }))
        // Dispatch event for other tabs/windows
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('categoriesUpdated'))
        }
      } else {
        throw new Error(data.error || 'Failed to create category')
      }
    } catch (error: any) {
      console.error('Error adding category:', error)
      throw error
    }
  },

  updateCategory: async (id, updates) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const data = await response.json()
      if (data.success && data.category) {
        set((state) => ({
          categories: state.categories.map(c => c.id === id ? data.category : c)
        }))
        // Dispatch event for other tabs/windows
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('categoriesUpdated'))
        }
      } else {
        throw new Error(data.error || 'Failed to update category')
      }
    } catch (error: any) {
      console.error('Error updating category:', error)
      throw error
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        set((state) => ({
          categories: state.categories.filter(c => c.id !== id)
        }))
        // Dispatch event for other tabs/windows
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('categoriesUpdated'))
        }
      } else {
        throw new Error(data.error || 'Failed to delete category')
      }
    } catch (error: any) {
      console.error('Error deleting category:', error)
      throw error
    }
  },

  getActiveCategories: () => {
    return get().categories.filter(c => c.active).sort((a, b) => (a.position || 0) - (b.position || 0))
  },

  getCategory: (id) => {
    return get().categories.find(c => c.id === id)
  }
}))
