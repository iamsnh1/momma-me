import { NextRequest, NextResponse } from 'next/server'
import { getCategories, createCategory } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const categories = await getCategories()
    return NextResponse.json({ success: true, categories })
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const category = await createCategory(body)
    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    )
  }
}
