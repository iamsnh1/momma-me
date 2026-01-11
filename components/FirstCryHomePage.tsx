'use client'

import { useState, useEffect } from 'react'
import { FiHeart, FiShoppingCart, FiChevronRight, FiTag, FiTruck, FiChevronLeft, FiChevronDown } from 'react-icons/fi'
import { useCartStore, Product } from '@/store/cartStore'
import { useProductStore } from '@/store/productStore'
import { useBannerStore } from '@/store/bannerStore'
import { useTrustBadgeStore } from '@/store/trustBadgeStore'
import { useCategoryStore } from '@/store/categoryStore'
import Link from 'next/link'

export default function FirstCryHomePage() {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)
  const addToCart = useCartStore((state) => state.addToCart)
  const [notification, setNotification] = useState<string | null>(null)
  const { products, getAllProducts, initialize } = useProductStore()
  const { getBannersByType, initialize: initializeBanners } = useBannerStore()
  const { getActiveBadges, initialize: initializeBadges } = useTrustBadgeStore()
  const { getActiveCategories, initialize: initializeCategories } = useCategoryStore()
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // INR currency formatter
  const formatINR = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value)
  
  useEffect(() => {
    setMounted(true)
    initialize()
    initializeBanners()
    initializeBadges()
    initializeCategories()
  }, [initialize, initializeBanners, initializeBadges, initializeCategories])
  
  // Get boutique banners for Premium Boutiques section
  const boutiqueBanners = mounted ? getBannersByType('boutique').sort((a, b) => a.position - b.position).slice(0, 3) : []
  
  // Get active trust badges
  const trustBadges = mounted ? getActiveBadges() : []
  
  // Get active categories
  const categories = mounted ? getActiveCategories() : []

  // Get hero banners from store
  const heroSlides = mounted ? getBannersByType('hero').sort((a, b) => a.position - b.position) : []
  
  useEffect(() => {
    if (mounted && heroSlides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [mounted, heroSlides.length])
  
  // Get all products from the store
  const allProducts = mounted ? getAllProducts() : []

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

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    setNotification(`Added ${product.name} to cart!`)
    setTimeout(() => setNotification(null), 3000)
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const originalPrice = product.price * 1.3
    const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100)

    return (
      <div className="bg-cotton-white rounded-xl shadow-md border border-blush-pink/20 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-warm-cream to-blush-pink/30">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {discount > 0 && (
              <div className="absolute top-3 left-3 bg-terracotta text-cotton-white px-3 py-1.5 rounded-full text-xs font-header font-bold shadow-lg">
                {discount}% OFF
              </div>
            )}
            <button
              onClick={(e) => {
                e.preventDefault()
                toggleWishlist(product.id)
              }}
              className="absolute top-3 right-3 p-2.5 bg-cotton-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-blush-pink transition-all duration-300 opacity-0 group-hover:opacity-100 transform hover:scale-110"
            >
              <FiHeart
                className={`w-5 h-5 transition-colors ${
                  wishlist.has(product.id)
                    ? 'fill-dusty-rose text-dusty-rose'
                    : 'text-warm-gray'
                }`}
              />
            </button>
          </div>
        </Link>

        <div className="p-4 space-y-2.5">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-header font-semibold text-sm text-warm-gray line-clamp-2 min-h-[2.5rem] hover:text-dusty-rose transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-sm">★</span>
              ))}
            </div>
            <span className="font-body text-xs text-warm-gray ml-1 font-medium">({(product.id.charCodeAt(0) % 50) + 50})</span>
          </div>

          <div className="flex items-baseline space-x-2 pt-1">
            <span className="font-header text-xl font-bold text-dusty-rose">{formatINR(product.price)}</span>
            {discount > 0 && (
              <>
                <span className="font-body text-sm text-warm-gray/60 line-through font-medium">{formatINR(originalPrice)}</span>
                <span className="font-body text-xs text-mint-green font-semibold bg-mint-green/20 px-2 py-0.5 rounded">Save {formatINR(originalPrice - product.price)}</span>
              </>
            )}
          </div>

          <button
            onClick={() => handleAddToCart(product)}
            className="w-full bg-terracotta hover:bg-dusty-rose text-cotton-white font-header font-semibold py-3 px-4 rounded-lg text-sm transition-all duration-300 mt-3 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            <FiShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    )
  }

  // Price-based sections - using ALL products from admin panel
  const under399 = allProducts.filter(p => p.price < 40).slice(0, 4)
  const under599 = allProducts.filter(p => p.price >= 40 && p.price < 60).slice(0, 4)
  const under799 = allProducts.filter(p => p.price >= 60 && p.price < 80).slice(0, 4)
  const under999 = allProducts.filter(p => p.price >= 80 && p.price < 100).slice(0, 4)

  // Featured deals - using ALL products
  const featuredDeals = allProducts.slice(0, Math.min(6, allProducts.length))
  const bestSellers = allProducts.slice(6, Math.min(14, allProducts.length))
  const newArrivals = allProducts.slice(14, Math.min(22, allProducts.length))
  
  // Group products by category - using ALL products
  const productsByCategory = categories.map(cat => ({
    category: cat,
    products: allProducts.filter(p => p.category === cat.name)
  })).filter(item => item.products.length > 0)

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section - Full-width Carousel */}
      <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
        {/* Carousel Container */}
        <div className="relative w-full h-full">
          {heroSlides.length > 0 ? (
            heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="relative w-full h-full">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {/* Soft overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blush-pink/40 via-powder-blue/30 to-mint-green/40"></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4 md:px-8 max-w-4xl">
                      <h1 className="font-header text-5xl md:text-7xl lg:text-8xl font-bold text-warm-gray mb-4 drop-shadow-lg">
                        {slide.title}
                      </h1>
                      {slide.subtitle && (
                        <p className="font-script text-3xl md:text-4xl lg:text-5xl text-dusty-rose mb-8 drop-shadow-md">
                          {slide.subtitle}
                        </p>
                      )}
                      {slide.buttonText && (
                        <Link
                          href={slide.link || '/products'}
                          className="inline-block bg-terracotta hover:bg-dusty-rose text-cotton-white px-10 py-4 rounded-full font-header text-xl md:text-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                          {slide.buttonText}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blush-pink/40 via-powder-blue/30 to-mint-green/40">
              <div className="text-center px-4 md:px-8 max-w-4xl">
                <h1 className="font-header text-5xl md:text-7xl lg:text-8xl font-bold text-warm-gray mb-4 drop-shadow-lg">
                  Where Comfort Meets Cuteness
                </h1>
                <p className="font-script text-3xl md:text-4xl lg:text-5xl text-dusty-rose mb-8 drop-shadow-md">
                  100% Pure Cotton Love
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-terracotta hover:bg-dusty-rose text-cotton-white px-10 py-4 rounded-full font-header text-xl md:text-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Shop New Arrivals
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Carousel Controls */}
        {heroSlides.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-warm-gray p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
              aria-label="Previous slide"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-warm-gray p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
              aria-label="Next slide"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-terracotta w-8'
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Trust Badges - Controlled by Admin */}
        {trustBadges.length > 0 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform translate-y-16 md:translate-y-20 flex flex-wrap justify-center gap-4 md:gap-6 px-4 z-10">
            {trustBadges.map((badge) => {
              const borderColorMap: Record<string, string> = {
                'blush-pink': 'border-blush-pink/30',
                'powder-blue': 'border-powder-blue/30',
                'mint-green': 'border-mint-green/30',
                'warm-cream': 'border-warm-cream/30',
                'dusty-rose': 'border-dusty-rose/30',
              }
              const borderColorClass = borderColorMap[badge.borderColor] || 'border-blush-pink/30'
              return (
                <div 
                  key={badge.id}
                  className={`bg-cotton-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border ${borderColorClass}`}
                >
                  <span className="font-header text-sm md:text-base font-semibold text-warm-gray">
                    {badge.icon && <span className="mr-2">{badge.icon}</span>}
                    {badge.text}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Premium Boutiques Section - Controlled by Admin */}
      {boutiqueBanners.length > 0 && (
        <section className="bg-warm-cream py-12 px-4 md:px-8 border-b border-blush-pink/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-header text-4xl md:text-5xl font-bold text-warm-gray mb-8 text-center md:text-left">
              <span className="text-dusty-rose">Premium Boutiques</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {boutiqueBanners.map((boutique) => (
                <Link 
                  key={boutique.id}
                  href={boutique.link || '/products'} 
                  className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-pink-100 relative overflow-hidden">
                    <img
                      src={boutique.image}
                      alt={boutique.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      {boutique.subtitle && (
                        <div className="text-xs mb-2 bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full inline-block font-bold">
                          {boutique.subtitle}
                        </div>
                      )}
                      <h3 className="text-3xl font-black mb-2 drop-shadow-lg mt-2">{boutique.title}</h3>
                      {boutique.buttonText && (
                        <p className="text-xl font-black bg-gradient-to-r from-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                          {boutique.buttonText}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* More For Less Section */}
      <section className="bg-cotton-white py-8 px-4 md:px-8 border-b border-blush-pink/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-header text-3xl md:text-4xl font-bold text-warm-gray mb-6">More For Less</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* UNDER 399 */}
            {under399.length > 0 && (
              <Link href="/products" className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 aspect-[3/4] transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 opacity-95 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white z-10">
                  <div className="text-5xl md:text-6xl font-black mb-2 drop-shadow-2xl">UNDER</div>
                  <div className="text-7xl md:text-9xl font-black drop-shadow-2xl">399</div>
                </div>
                <img
                  src={under399[0]?.image || 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=400&h=600&fit=crop'}
                  alt="Under 399"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                />
              </Link>
            )}

            {/* UNDER 599 */}
            {under599.length > 0 && (
              <Link href="/products" className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 aspect-[3/4] transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 opacity-95 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white z-10">
                  <div className="text-5xl md:text-6xl font-black mb-2 drop-shadow-2xl">UNDER</div>
                  <div className="text-7xl md:text-9xl font-black drop-shadow-2xl">599</div>
                </div>
                <img
                  src={under599[0]?.image || 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=400&h=600&fit=crop'}
                  alt="Under 599"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                />
              </Link>
            )}

            {/* UNDER 799 */}
            {under799.length > 0 && (
              <Link href="/products" className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 aspect-[3/4] transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 opacity-95 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white z-10">
                  <div className="text-5xl md:text-6xl font-black mb-2 drop-shadow-2xl">UNDER</div>
                  <div className="text-7xl md:text-9xl font-black drop-shadow-2xl">799</div>
                </div>
                <img
                  src={under799[0]?.image || 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=400&h=600&fit=crop'}
                  alt="Under 799"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                />
              </Link>
            )}

            {/* UNDER 999 */}
            {under999.length > 0 && (
              <Link href="/products" className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 aspect-[3/4] transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-green-600 to-emerald-600 opacity-95 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white z-10">
                  <div className="text-5xl md:text-6xl font-black mb-2 drop-shadow-2xl">UNDER</div>
                  <div className="text-7xl md:text-9xl font-black drop-shadow-2xl">999</div>
                </div>
                <img
                  src={under999[0]?.image || 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=400&h=600&fit=crop'}
                  alt="Under 999"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="bg-gradient-to-b from-cotton-white to-warm-cream py-12 px-4 md:px-8 border-b border-blush-pink/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-header text-4xl md:text-5xl font-bold text-warm-gray mb-3">
              <span className="text-dusty-rose">All Products</span>
            </h2>
            <p className="font-body text-xl text-warm-gray font-medium">Browse our complete collection</p>
            <div className="inline-block mt-2 bg-blush-pink/30 px-6 py-2 rounded-full border border-blush-pink/50">
              <span className="font-header text-dusty-rose font-bold text-lg">{allProducts.length} Products Available</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/products" className="bg-terracotta hover:bg-dusty-rose text-cotton-white font-header font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Category-wise Product Sections */}
      {productsByCategory.map(({ category, products: categoryProducts }) => (
        <section key={category.id} className="bg-cotton-white py-12 px-4 md:px-8 border-b border-blush-pink/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blush-pink/40 to-powder-blue/40 rounded-2xl flex items-center justify-center text-4xl shadow-md">
                  {category.icon}
                </div>
                <div>
                  <h2 className="font-header text-3xl md:text-4xl font-bold text-warm-gray">{category.name}</h2>
                  <span className="font-body text-sm text-warm-gray font-medium">{categoryProducts.length} products available</span>
                </div>
              </div>
              <Link href={`/products?category=${category.id}`} className="bg-terracotta hover:bg-dusty-rose text-cotton-white font-header font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105">
                <span>View All</span>
                <FiChevronRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}

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
