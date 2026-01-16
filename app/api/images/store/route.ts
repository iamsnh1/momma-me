import { NextRequest, NextResponse } from 'next/server'
import { createImage } from '@/lib/db'

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

    // Validate file size (max 2MB for database storage)
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

    // Store in database
    const imageRecord = await createImage({
      id,
      filename,
      data: dataUrl,
      mimeType: file.type,
      size: file.size,
    })

    // Return API URL
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
