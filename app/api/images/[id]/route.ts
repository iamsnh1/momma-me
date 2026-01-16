import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Database file
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

// Load images database
async function loadImagesDb(): Promise<ImagesDatabase> {
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

// GET: Retrieve image from database
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Load database
    const db = await loadImagesDb()
    
    // Find image
    const image = db.images.find(img => img.id === id)
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Extract base64 data (remove data:image/...;base64, prefix if present)
    let base64Data = image.data
    if (base64Data.includes(',')) {
      base64Data = base64Data.split(',')[1]
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64')

    // Return image with proper content type
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': image.mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error: any) {
    console.error('Error retrieving image:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve image' },
      { status: 500 }
    )
  }
}

