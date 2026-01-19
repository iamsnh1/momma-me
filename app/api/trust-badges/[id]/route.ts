import { NextRequest, NextResponse } from 'next/server'
import { updateTrustBadge, deleteTrustBadge } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const badge = await updateTrustBadge(params.id, body)
    return NextResponse.json({ success: true, badge })
  } catch (error: any) {
    console.error('Error updating trust badge:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update trust badge' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteTrustBadge(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting trust badge:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete trust badge' },
      { status: 500 }
    )
  }
}
