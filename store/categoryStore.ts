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

// Track if we've ever saved data to localStorage
const hasSavedCategories = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(`${STORAGE_KEY}_initialized`) === 'true'
}

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
    // Only return initial categories if we've NEVER saved data before
    if (!hasSavedCategories()) {
      return initialCategories
    }
    return []
  } catch (e) {
    console.error('Error loading categories from localStorage:', e)
    if (hasSavedCategories()) {
      return []
    }
    return initialCategories
  }
}

// Save categories to localStorage with backup
const saveCategories = (categories: Category[]) => {
  if (typeof window === 'undefined') return
  try {
    // Create backup before saving
    const backupKey = `${STORAGE_KEY}_backup_${Date.now()}`
    const currentData = localStorage.getItem(STORAGE_KEY)
    if (currentData) {
      localStorage.setItem(backupKey, currentData)
      // Clean up old backups (keep only last 3)
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(`${STORAGE_KEY}_backup_`))
        .sort()
        .reverse()
        .slice(3)
      backupKeys.forEach(key => localStorage.removeItem(key))
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
    localStorage.setItem(`${STORAGE_KEY}_initialized`, 'true')
    localStorage.setItem(`${STORAGE_KEY}_lastSaved`, new Date().toISOString())
    console.log(`✅ Saved ${categories.length} categories to localStorage at ${new Date().toLocaleString()}`)
  } catch (e) {
    console.error('Error saving categories to localStorage:', e)
    throw e
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
    // NEVER overwrite existing data - only load if store is empty
    const currentCategories = get().categories
    if (currentCategories.length === 0) {
      const loaded = loadCategories()
      if (loaded.length > 0) {
        set({ categories: loaded })
      }
    }
    // If we already have categories, keep them - don't reload
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

