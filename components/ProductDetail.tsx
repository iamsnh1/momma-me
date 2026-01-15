'use client'

import { useState, useEffect } from 'react'
import { FiHeart, FiChevronLeft, FiChevronDown, FiChevronUp, FiShoppingCart } from 'react-icons/fi'
import { useCartStore, Product } from '@/store/cartStore'
import { useProductStore } from '@/store/productStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProductDetail({ productId }: { productId: string }) {
  const { getProduct, getAllProducts, initialize } = useProductStore()
  const router = useRouter()
  
  useEffect(() => {
    initialize()
  }, [initialize])

  // Listen for updates from admin panel
  useEffect(() => {
    const handleProductsUpdate = () => {
      initialize()
    }
    
    window.addEventListener('productsUpdated', handleProductsUpdate)
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate)
    }
  }, [initialize])
  
  const product = getProduct(productId) || getAllProducts()[0]
  const allProducts = getAllProducts()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [expandedSection, setExpandedSection] = useState<string | null>('description')
  const addToCart = useCartStore((state) => state.addToCart)
  const [inWishlist, setInWishlist] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image,
    product.image
  ]

  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setNotification(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`)
    setTimeout(() => setNotification(null), 3000)
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <a 
              href="/" 
              className="hover:text-purple transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                router.push('/')
              }}
            >
              Home
            </a>
            <span>/</span>
            <a 
              href="/products" 
              className="hover:text-purple transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                router.push('/products')
              }}
            >
              Products
            </a>
            <span>/</span>
            <span className="text-purple font-semibold">{product.name}</span>
          </div>
        </nav>

        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Left Column - Images (60%) */}
          <div className="md:col-span-3">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg shadow-lg overflow-hidden mb-4 group cursor-zoom-in">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-purple' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details (40%) */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-purple mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <span className="text-gray-600">No reviews yet</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                {product.salePrice && product.salePrice < (product.originalPrice || product.price) ? (
                  <>
                    <p className="text-4xl font-bold text-primary-pink-dark">₹{product.salePrice.toFixed(2)}</p>
                    <p className="text-lg text-gray-500 line-through">₹{(product.originalPrice || product.price).toFixed(2)}</p>
                    <span className="text-green-600 font-semibold">
                      Save {Math.round(((1 - product.salePrice / (product.originalPrice || product.price)) * 100))}% 
                      ({((product.originalPrice || product.price) - product.salePrice).toFixed(2)} ₹)
                    </span>
                  </>
                ) : (
                  <>
                    <p className="text-4xl font-bold text-primary-pink-dark">₹{product.price.toFixed(2)}</p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <>
                        <p className="text-lg text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</p>
                        <span className="text-green-600 font-semibold">
                          Save {Math.round(((1 - product.price / product.originalPrice) * 100))}%
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description || 'Premium quality baby product designed with love and care. Safe, comfortable, and perfect for your little one.'}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary-pink-dark hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setInWishlist(!inWishlist)}
                  className={`w-full border-2 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                    inWishlist
                      ? 'border-primary-pink-dark text-primary-pink-dark bg-pink-50'
                      : 'border-gray-300 text-gray-700 hover:border-purple'
                  }`}
                >
                  <FiHeart className={`w-5 h-5 ${inWishlist ? 'fill-primary-pink-dark' : ''}`} />
                  <span>{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl mb-2">🛡️</div>
                  <p className="text-xs text-gray-600">Safe Materials</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🚚</div>
                  <p className="text-xs text-gray-600">Fast Shipping</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <p className="text-xs text-gray-600">Money-Back</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Accordion */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-purple mb-6">Product Details</h2>
          
          {[
            { id: 'description', title: 'Description', content: 'Detailed product description goes here...' },
            { id: 'specifications', title: 'Specifications', content: 'Weight: 0.5 lbs\nDimensions: 10" x 8" x 2"\nMaterial: Organic Cotton' },
            { id: 'safety', title: 'Safety Information', content: 'CPSIA Compliant\nNon-toxic Materials\nBPA Free' },
            { id: 'shipping', title: 'Shipping & Returns', content: 'Free shipping on orders over ₹50\n30-day return policy' }
          ].map((section) => (
            <div key={section.id} className="border-b border-gray-200 last:border-0">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between py-4 text-left hover:text-purple transition-colors"
              >
                <span className="font-semibold text-lg">{section.title}</span>
                {expandedSection === section.id ? (
                  <FiChevronUp className="w-5 h-5" />
                ) : (
                  <FiChevronDown className="w-5 h-5" />
                )}
              </button>
              {expandedSection === section.id && (
                <div className="pb-4 text-gray-600 whitespace-pre-line">{section.content}</div>
              )}
            </div>
          ))}
        </div>

        {/* Related Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-purple mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all transform hover:scale-105 hover:shadow-lg cursor-pointer">
                  <div className="aspect-square">
                    <img src={relatedProduct.image} alt={relatedProduct.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-purple mb-2">{relatedProduct.name}</h3>
                    <p className="text-xl font-bold text-primary-pink-dark">₹{relatedProduct.price.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-purple mb-6">Customer Reviews</h2>
          <div className="text-center py-8 text-gray-500">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
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
    </div>
  )
}

