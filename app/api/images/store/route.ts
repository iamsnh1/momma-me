import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Database file to store images
const DB_DIR = join(process.cwd(), 'data')
const IMAGES_DB_FILE = join(DB_DIR, 'images.json')

interface StoredImage {
  id: string
  filename: string
  data: string // base64 data
  mimeType: string
  size: number
  uploadedAt: string
}

interface ImagesDatabase {
  images: StoredImage[]
}

// Ensure database directory exists
async function ensureDbDir() {
  if (!existsSync(DB_DIR)) {
    await mkdir(DB_DIR, { recursive: true })
  }
}

// Load images database
async function loadImagesDb(): Promise<ImagesDatabase> {
  await ensureDbDir()
  try {
    if (existsSync(IMAGES_DB_FILE)) {
      const data = await readFile(IMAGES_DB_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (e) {
    console.error('Error loading images DB:', e)
  }
  return { images: [] }
}

// Save images database
async function saveImagesDb(db: ImagesDatabase): Promise<void> {
  await ensureDbDir()
  await writeFile(IMAGES_DB_FILE, JSON.stringify(db, null, 2), 'utf-8')
}

// POST: Upload and store image in database
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 2MB for base64 storage)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 2MB for database storage' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Data = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64Data}`

    // Generate unique ID
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    const filename = file.name || `image-${id}`

    // Create image record
    const imageRecord: StoredImage = {
      id,
      filename,
      data: dataUrl,
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }

    // Load database
    const db = await loadImagesDb()
    
    // Add image
    db.images.push(imageRecord)
    
    // Save database
    await saveImagesDb(db)

    // Return API URL (not base64 data)
    const imageUrl = `/api/images/${id}`
    
    console.log(`✅ Image stored in database: ${id} (${(file.size / 1024).toFixed(2)} KB)`)

    return NextResponse.json({
      success: true,
      url: imageUrl,
      id: id,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    )
  }
}

