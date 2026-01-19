import { NextRequest, NextResponse } from 'next/server'
import { getTrustBadges, createTrustBadge } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const badges = await getTrustBadges()
    return NextResponse.json({ success: true, badges })
  } catch (error: any) {
    console.error('Error fetching trust badges:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch trust badges' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const badge = await createTrustBadge(body)
    return NextResponse.json({ success: true, badge })
  } catch (error: any) {
    console.error('Error creating trust badge:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create trust badge' },
      { status: 500 }
    )
  }
}
