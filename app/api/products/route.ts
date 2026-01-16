import { NextRequest, NextResponse } from 'next/server'
import { getProducts, createProduct } from '@/lib/db'

// GET: Get all products
export async function GET(request: NextRequest) {
  try {
    const products = await getProducts()
    return NextResponse.json({ success: true, products })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST: Create a new product
export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()
    const product = await createProduct(productData)
    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

