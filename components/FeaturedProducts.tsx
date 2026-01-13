'use client'

import { useState } from 'react'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { products } from '@/data/products'

export default function FeaturedProducts() {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const addToCart = useCartStore((state) => state.addToCart)
  const [notification, setNotification] = useState<string | null>(null)

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product)
    setNotification(`Added ${product.name} to cart!`)
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-gradient-to-br from-bg-pink to-bg-purple">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-purple text-center mb-8 md:mb-12">
          Trending Products
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all transform hover:scale-105 hover:shadow-lg"
            >
              {/* Product Image */}
              <div className="relative aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Wishlist Icon */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-primary-pink transition-colors"
                  aria-label="Add to wishlist"
                >
                  <FiHeart
                    className={`w-5 h-5 ${
                      wishlist.has(product.id)
                        ? 'fill-primary-pink-dark text-primary-pink-dark'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-base text-purple">{product.name}</h3>
                
                {/* Star Rating */}
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-baseline space-x-2">
                  <p className="text-xl font-bold text-primary-pink-dark">
                    ₹{product.salePrice && product.salePrice < (product.originalPrice || product.price) ? product.salePrice.toFixed(2) : product.price.toFixed(2)}
                  </p>
                  {product.salePrice && product.salePrice < (product.originalPrice || product.price) && (
                    <p className="text-sm text-gray-500 line-through">
                      ₹{(product.originalPrice || product.price).toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-primary-pink-dark hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl shadow-2xl z-50 animate-slide-up border-2 border-white/20 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <FiShoppingCart className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">{notification}</span>
          </div>
        </div>
      )}
    </section>
  )
}

