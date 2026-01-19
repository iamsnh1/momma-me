import { NextRequest, NextResponse } from 'next/server'
import { getPages, createPage } from '@/lib/db'

// GET: Get all pages
export async function GET(request: NextRequest) {
  try {
    const pages = await getPages()
    return NextResponse.json({ success: true, pages })
  } catch (error: any) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

// POST: Create a new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, path, description, content } = body

    if (!title || !path) {
      return NextResponse.json(
        { success: false, error: 'Title and path are required' },
        { status: 400 }
      )
    }

    const newPage = await createPage({
      title,
      path,
      description: description || '',
      content: content || ''
    })

    return NextResponse.json({ success: true, page: newPage })
  } catch (error: any) {
    console.error('Error creating page:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create page' },
      { status: 500 }
    )
  }
}
