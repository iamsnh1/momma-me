import { NextRequest, NextResponse } from 'next/server'
import { getSettings, updateSettings } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const settings = await getSettings()
    return NextResponse.json({ success: true, settings })
  } catch (error: any) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const settings = await updateSettings(body)
    return NextResponse.json({ success: true, settings })
  } catch (error: any) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update settings' },
      { status: 500 }
    )
  }
}
