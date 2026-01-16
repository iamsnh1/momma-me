import { NextRequest, NextResponse } from 'next/server'
import { getImage } from '@/lib/db'

// GET: Retrieve image from database
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get image from database
    const image = await getImage(id)
    
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
