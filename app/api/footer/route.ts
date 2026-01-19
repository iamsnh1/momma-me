import { NextRequest, NextResponse } from 'next/server'
import { getFooterSettings, updateFooterSettings } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const settings = await getFooterSettings()
    // Always return success, even if settings is null (means no settings saved yet)
    return NextResponse.json({ success: true, settings: settings || null })
  } catch (error: any) {
    console.error('Error fetching footer settings:', error)
    // Return success with null settings instead of error
    // This allows the frontend to use default settings
    return NextResponse.json({ success: true, settings: null })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const settings = await updateFooterSettings(body)
    return NextResponse.json({ success: true, settings })
  } catch (error: any) {
    console.error('Error updating footer settings:', error)
    // Return proper JSON even on error
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update footer settings' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
