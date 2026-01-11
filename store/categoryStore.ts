import { create } from 'zustand'
import { categories as initialCategories } from '@/data/products'

export interface Category {
  id: string
  name: string
  icon: string
  description: string
  displayOrder?: number
  active?: boolean
  parentCategory?: string
}

const STORAGE_KEY = 'momma-me-categories'

// Load categories from localStorage or use initial categories
const loadCategories = (): Category[] => {
  if (typeof window === 'undefined') return initialCategories
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Error loading categories from localStorage:', e)
  }
  return initialCategories
}

// Save categories to localStorage
const saveCategories = (categories: Category[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
  } catch (e) {
    console.error('Error saving categories to localStorage:', e)
  }
}

interface CategoryStore {
  categories: Category[]
  initialize: () => void
  addCategory: (category: Category) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
  getCategory: (id: string) => Category | undefined
  getCategoryByName: (name: string) => Category | undefined
  getActiveCategories: () => Category[]
  getAllCategories: () => Category[]
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: loadCategories(),

  initialize: () => {
    const loaded = loadCategories()
    set({ categories: loaded })
  },

  addCategory: (category) => {
    const newCategories = [...get().categories, category]
    set({ categories: newCategories })
    saveCategories(newCategories)
  },

  updateCategory: (id, updatedCategory) => {
    const newCategories = get().categories.map(c =>
      c.id === id ? { ...c, ...updatedCategory } : c
    )
    set({ categories: newCategories })
    saveCategories(newCategories)
  },

  deleteCategory: (id) => {
    const newCategories = get().categories.filter(c => c.id !== id)
    set({ categories: newCategories })
    saveCategories(newCategories)
  },

  getCategory: (id) => {
    return get().categories.find(c => c.id === id)
  },

  getCategoryByName: (name) => {
    return get().categories.find(c => c.name === name)
  },

  getActiveCategories: () => {
    return get().categories.filter(c => c.active !== false).sort((a, b) => 
      (a.displayOrder || 999) - (b.displayOrder || 999)
    )
  },

  getAllCategories: () => {
    return get().categories
  },
}))

