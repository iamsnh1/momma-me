import { NextRequest, NextResponse } from 'next/server'
import { updateBanner, deleteBanner } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const banner = await updateBanner(params.id, body)
    return NextResponse.json({ success: true, banner })
  } catch (error: any) {
    console.error('Error updating banner:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update banner' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteBanner(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting banner:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete banner' },
      { status: 500 }
    )
  }
}
