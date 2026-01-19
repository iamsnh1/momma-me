import { NextRequest, NextResponse } from 'next/server'
import { getPage, updatePage, deletePage } from '@/lib/db'

// GET: Get a single page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const page = await getPage(id)
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, page })
  } catch (error: any) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT: Update a page
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, path, description, content } = body

    const updatedPage = await updatePage(id, {
      title,
      path,
      description,
      content
    })

    return NextResponse.json({ success: true, page: updatedPage })
  } catch (error: any) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update page' },
      { status: 500 }
    )
  }
}

// DELETE: Delete a page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    await deletePage(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting page:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete page' },
      { status: 500 }
    )
  }
}
