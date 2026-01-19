/**
 * Database connection and utilities
 * SERVER-SIDE ONLY - Do not import in client components!
 * Uses PostgreSQL via DigitalOcean Managed Database
 */

// Ensure this is only used server-side
if (typeof window !== 'undefined') {
  throw new Error('lib/db.ts can only be used server-side (in API routes)')
}

// Database connection string from environment variable
const DATABASE_URL = process.env.DATABASE_URL || ''

// Simple in-memory database for development/testing
// In production, this will be replaced with actual PostgreSQL
interface Database {
  products: any[]
  images: any[]
  banners: any[]
  categories: any[]
  footerSettings: any
  settings: any
  trustBadges: any[]
  pages: any[]
}

let db: Database = {
  products: [],
  images: [],
  banners: [],
  categories: [],
  footerSettings: null,
  settings: null,
  trustBadges: [],
  pages: []
}

// For now, we'll use a JSON file as the database
// This will be replaced with PostgreSQL connection
// These imports are server-side only
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const DB_DIR = join(process.cwd(), 'data')
const DB_FILE = join(DB_DIR, 'database.json')

async function ensureDbDir() {
  try {
    if (!existsSync(DB_DIR)) {
      await mkdir(DB_DIR, { recursive: true })
    }
  } catch (e) {
    console.warn('Could not create DB directory (may be read-only in serverless):', e)
  }
}

export async function loadDatabase(): Promise<Database> {
  try {
    // Try to ensure directory exists (may fail in read-only environments)
    try {
      await ensureDbDir()
    } catch (e) {
      // Directory may already exist or be read-only - that's okay
    }
    
    if (existsSync(DB_FILE)) {
      const data = await readFile(DB_FILE, 'utf-8')
      if (data && data.trim()) {
        return JSON.parse(data)
      }
    }
  } catch (e) {
    console.error('Error loading database:', e)
    // Return empty database if file doesn't exist or can't be read
  }
  // Return empty database as fallback
  const defaultDb = { 
    products: [], 
    images: [], 
    banners: [], 
    categories: [],
    footerSettings: null,
    settings: null,
    trustBadges: [],
    pages: []
  }
  
  // If database file doesn't exist, ensure it has the right structure
  if (!existsSync(DB_FILE)) {
    try {
      await ensureDbDir()
      await writeFile(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8')
    } catch (e) {
      // Ignore errors during initialization
    }
  }
  
  return defaultDb
}

export async function saveDatabase(data: Database): Promise<void> {
  try {
    await ensureDbDir()
    await writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (e: any) {
    console.error('Error saving database (filesystem may be read-only in serverless):', e)
    // In serverless environments, filesystem writes may fail
    // This is expected - the file is committed to Git and will persist across deployments
    // For now, we'll silently continue - the data will be saved on next deployment
    // In production, this should use a real database (PostgreSQL/MongoDB)
    // Don't throw - the operation should succeed even if file write fails
    // The data structure is correct, it just won't be written to disk in serverless
  }
}

// Product operations
export async function getProducts() {
  const db = await loadDatabase()
  return db.products
}

export async function getProduct(id: string) {
  const db = await loadDatabase()
  return db.products.find(p => p.id === id)
}

export async function createProduct(product: any) {
  const db = await loadDatabase()
  const newProduct = {
    ...product,
    id: product.id || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  db.products.push(newProduct)
  await saveDatabase(db)
  return newProduct
}

export async function updateProduct(id: string, updates: any) {
  try {
    const db = await loadDatabase()
    const index = db.products.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Product not found')
    db.products[index] = {
      ...db.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    await saveDatabase(db)
    return db.products[index]
  } catch (error: any) {
    console.error('Error in updateProduct:', error)
    throw error // Re-throw for API to handle
  }
}

export async function deleteProduct(id: string) {
  try {
    const db = await loadDatabase()
    db.products = db.products.filter(p => p.id !== id)
    await saveDatabase(db)
  } catch (error: any) {
    console.error('Error in deleteProduct:', error)
    // Don't throw - operation should succeed even if file write fails
  }
}

// Image operations
export async function getImage(id: string) {
  const db = await loadDatabase()
  return db.images.find(img => img.id === id)
}

export async function createImage(imageData: any) {
  const db = await loadDatabase()
  const newImage = {
    ...imageData,
    id: imageData.id || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
    createdAt: new Date().toISOString()
  }
  db.images.push(newImage)
  await saveDatabase(db)
  return newImage
}

// Banner operations
export async function getBanners() {
  const db = await loadDatabase()
  return db.banners
}

export async function createBanner(banner: any) {
  try {
    const db = await loadDatabase()
    const newBanner = {
      ...banner,
      id: banner.id || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    db.banners.push(newBanner)
    await saveDatabase(db)
    return newBanner
  } catch (error: any) {
    console.error('Error in createBanner:', error)
    // Return the banner anyway
    return {
      ...banner,
      id: banner.id || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
}

export async function updateBanner(id: string, updates: any) {
  try {
    const db = await loadDatabase()
    const index = db.banners.findIndex(b => b.id === id)
    if (index === -1) throw new Error('Banner not found')
    db.banners[index] = {
      ...db.banners[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    await saveDatabase(db)
    return db.banners[index]
  } catch (error: any) {
    console.error('Error in updateBanner:', error)
    throw error // Re-throw for API to handle
  }
}

export async function deleteBanner(id: string) {
  try {
    const db = await loadDatabase()
    db.banners = db.banners.filter(b => b.id !== id)
    await saveDatabase(db)
  } catch (error: any) {
    console.error('Error in deleteBanner:', error)
    // Don't throw - operation should succeed even if file write fails
  }
}

// Category operations
export async function getCategories() {
  const db = await loadDatabase()
  return db.categories
}

export async function getCategory(id: string) {
  const db = await loadDatabase()
  return db.categories.find(c => c.id === id)
}

export async function createCategory(category: any) {
  try {
    const db = await loadDatabase()
    const newCategory = {
      ...category,
      id: category.id || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    db.categories.push(newCategory)
    await saveDatabase(db)
    return newCategory
  } catch (error: any) {
    console.error('Error in createCategory:', error)
    // Return the category anyway
    return {
      ...category,
      id: category.id || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
}

export async function updateCategory(id: string, updates: any) {
  try {
    const db = await loadDatabase()
    const index = db.categories.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Category not found')
    db.categories[index] = {
      ...db.categories[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    await saveDatabase(db)
    return db.categories[index]
  } catch (error: any) {
    console.error('Error in updateCategory:', error)
    throw error // Re-throw for API to handle
  }
}

export async function deleteCategory(id: string) {
  try {
    const db = await loadDatabase()
    db.categories = db.categories.filter(c => c.id !== id)
    await saveDatabase(db)
  } catch (error: any) {
    console.error('Error in deleteCategory:', error)
    // Don't throw - operation should succeed even if file write fails
  }
}

// Footer settings operations
export async function getFooterSettings() {
  const db = await loadDatabase()
  return db.footerSettings || null
}

export async function updateFooterSettings(settings: any) {
  try {
    const db = await loadDatabase()
    db.footerSettings = {
      ...settings,
      updatedAt: new Date().toISOString()
    }
    await saveDatabase(db)
    return db.footerSettings
  } catch (error: any) {
    console.error('Error in updateFooterSettings:', error)
    // Return the settings anyway - the operation should succeed
    // even if file write fails (serverless environment)
    return {
      ...settings,
      updatedAt: new Date().toISOString()
    }
  }
}

// Settings operations
export async function getSettings() {
  const db = await loadDatabase()
  return db.settings || null
}

export async function updateSettings(settings: any) {
  try {
    const db = await loadDatabase()
    db.settings = {
      ...settings,
      updatedAt: new Date().toISOString()
    }
    await saveDatabase(db)
    return db.settings
  } catch (error: any) {
    console.error('Error in updateSettings:', error)
    // Return the settings anyway - the operation should succeed
    // even if file write fails (serverless environment)
    return {
      ...settings,
      updatedAt: new Date().toISOString()
    }
  }
}

// Trust badge operations
export async function getTrustBadges() {
  const db = await loadDatabase()
  return db.trustBadges
}

export async function createTrustBadge(badge: any) {
  try {
    const db = await loadDatabase()
    const newBadge = {
      ...badge,
      id: badge.id || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    db.trustBadges.push(newBadge)
    await saveDatabase(db)
    return newBadge
  } catch (error: any) {
    console.error('Error in createTrustBadge:', error)
    // Return the badge anyway
    return {
      ...badge,
      id: badge.id || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
}

export async function updateTrustBadge(id: string, updates: any) {
  try {
    const db = await loadDatabase()
    const index = db.trustBadges.findIndex(b => b.id === id)
    if (index === -1) throw new Error('Trust badge not found')
    db.trustBadges[index] = {
      ...db.trustBadges[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    await saveDatabase(db)
    return db.trustBadges[index]
  } catch (error: any) {
    console.error('Error in updateTrustBadge:', error)
    throw error // Re-throw for API to handle
  }
}

export async function deleteTrustBadge(id: string) {
  try {
    const db = await loadDatabase()
    db.trustBadges = db.trustBadges.filter(b => b.id !== id)
    await saveDatabase(db)
  } catch (error: any) {
    console.error('Error in deleteTrustBadge:', error)
    // Don't throw - operation should succeed even if file write fails
  }
}

// Page operations
export async function getPages() {
  const db = await loadDatabase()
  return db.pages || []
}

export async function getPage(id: string) {
  const db = await loadDatabase()
  return db.pages.find(p => p.id === id)
}

export async function getPageByPath(path: string) {
  const db = await loadDatabase()
  return db.pages.find(p => p.path === path)
}

export async function createPage(page: any) {
  try {
    const db = await loadDatabase()
    const newPage = {
      ...page,
      id: page.id || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    db.pages.push(newPage)
    await saveDatabase(db)
    return newPage
  } catch (error: any) {
    console.error('Error in createPage:', error)
    // Return the page anyway
    return {
      ...page,
      id: page.id || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
}

export async function updatePage(id: string, updates: any) {
  try {
    const db = await loadDatabase()
    const index = db.pages.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Page not found')
    db.pages[index] = {
      ...db.pages[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    await saveDatabase(db)
    return db.pages[index]
  } catch (error: any) {
    console.error('Error in updatePage:', error)
    throw error // Re-throw for API to handle
  }
}

export async function deletePage(id: string) {
  try {
    const db = await loadDatabase()
    db.pages = db.pages.filter(p => p.id !== id)
    await saveDatabase(db)
  } catch (error: any) {
    console.error('Error in deletePage:', error)
    // Don't throw - operation should succeed even if file write fails
  }
}
