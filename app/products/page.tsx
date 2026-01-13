import { Suspense } from 'react'
import ProductsPage from '@/components/ProductsPage'

export default function Products() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-purple text-xl">Loading products...</div>
    </div>}>
      <ProductsPage />
    </Suspense>
  )
}

