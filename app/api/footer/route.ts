import { NextRequest, NextResponse } from 'next/server'
import { getFooterSettings, updateFooterSettings } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const settings = await getFooterSettings()
    return NextResponse.json({ success: true, settings })
  } catch (error: any) {
    console.error('Error fetching footer settings:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch footer settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const settings = await updateFooterSettings(body)
    return NextResponse.json({ success: true, settings })
  } catch (error: any) {
    console.error('Error updating footer settings:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update footer settings' },
      { status: 500 }
    )
  }
}
