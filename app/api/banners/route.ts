import { NextRequest, NextResponse } from 'next/server'
import { getBanners, createBanner } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const banners = await getBanners()
    return NextResponse.json({ success: true, banners })
  } catch (error: any) {
    console.error('Error fetching banners:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch banners' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const banner = await createBanner(body)
    return NextResponse.json({ success: true, banner })
  } catch (error: any) {
    console.error('Error creating banner:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create banner' },
      { status: 500 }
    )
  }
}
