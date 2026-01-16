/**
 * Database connection and utilities
 * Uses PostgreSQL via DigitalOcean Managed Database
 */

// Database connection string from environment variable
const DATABASE_URL = process.env.DATABASE_URL || ''

// Simple in-memory database for development/testing
// In production, this will be replaced with actual PostgreSQL
interface Database {
  products: any[]
  images: any[]
  banners: any[]
  categories: any[]
}

let db: Database = {
  products: [],
  images: [],
  banners: [],
  categories: []
}

// For now, we'll use a JSON file as the database
// This will be replaced with PostgreSQL connection
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const DB_DIR = join(process.cwd(), 'data')
const DB_FILE = join(DB_DIR, 'database.json')

async function ensureDbDir() {
  if (!existsSync(DB_DIR)) {
    await mkdir(DB_DIR, { recursive: true })
  }
}

export async function loadDatabase(): Promise<Database> {
  await ensureDbDir()
  try {
    if (existsSync(DB_FILE)) {
      const data = await readFile(DB_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (e) {
    console.error('Error loading database:', e)
  }
  return { products: [], images: [], banners: [], categories: [] }
}

export async function saveDatabase(data: Database): Promise<void> {
  await ensureDbDir()
  await writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
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
}

export async function deleteProduct(id: string) {
  const db = await loadDatabase()
  db.products = db.products.filter(p => p.id !== id)
  await saveDatabase(db)
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
}

export async function updateBanner(id: string, updates: any) {
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
}

export async function deleteBanner(id: string) {
  const db = await loadDatabase()
  db.banners = db.banners.filter(b => b.id !== id)
  await saveDatabase(db)
}

