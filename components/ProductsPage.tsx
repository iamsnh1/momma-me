'use client'

import { useState, useMemo, useEffect } from 'react'
import { FiGrid, FiList, FiChevronRight, FiX, FiShoppingCart } from 'react-icons/fi'
import { useCartStore, Product } from '@/store/cartStore'
import { useProductStore } from '@/store/productStore'
import { useCategoryStore } from '@/store/categoryStore'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

const brands = ['Momma & Me', 'BabySafe', 'TinyTot', 'LittleOne', 'PureBaby']
const ageRanges = ['0-3 months', '3-6 months', '6-12 months', '1-2 years', '2-3 years']

export default function ProductsPage() {
  const { getAllProducts, initialize } = useProductStore()
  const { getActiveCategories, initialize: initializeCategories } = useCategoryStore()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  useEffect(() => {
    initialize()
    initializeCategories()
  }, [initialize, initializeCategories])

  // Listen for updates from admin panel
  useEffect(() => {
    const handleProductsUpdate = () => {
      console.log('🔄 Products update event received, refreshing...')
      initialize()
      initializeCategories()
      // Force a re-render
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'))
      }
    }
    const handleCategoriesUpdate = () => {
      console.log('🔄 Categories update event received, refreshing...')
      initializeCategories()
    }
    
    window.addEventListener('productsUpdated', handleProductsUpdate)
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate)
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate)
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate)
    }
  }, [initialize, initializeCategories])
  
  const allProducts = getAllProducts()
  const categories = getActiveCategories()
  
  // Get search query from URL
  const searchQuery = searchParams.get('search') || ''
  const categoryParam = searchParams.get('category')
  
  // Debug: Verify search query is being read
  useEffect(() => {
    if (searchQuery) {
      console.log('🔍 Search query detected:', searchQuery)
      console.log('📦 Total products:', allProducts.length)
    }
  }, [searchQuery, allProducts.length])
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAges, setSelectedAges] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const addToCart = useCartStore((state) => state.addToCart)

  // Calculate max price from products for price range slider
  const maxProductPrice = useMemo(() => {
    if (allProducts.length === 0) return 500
    const prices = allProducts.map(p => {
      const price = p.salePrice && p.salePrice < (p.originalPrice || p.price) 
        ? p.salePrice 
        : (p.originalPrice || p.price)
      return price
    })
    const maxPrice = Math.max(...prices)
    return Math.ceil(maxPrice / 50) * 50 // Round up to nearest 50
  }, [allProducts])
  
  // Initialize price range with maxProductPrice
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  
  // Update price range max when products are loaded
  useEffect(() => {
    if (maxProductPrice > 0) {
      setPriceRange([0, maxProductPrice])
    }
  }, [maxProductPrice])

  // Update selected categories when category param changes
  useEffect(() => {
    if (categoryParam) {
      const category = categories.find(c => c.id === categoryParam || c.name.toLowerCase() === categoryParam.toLowerCase())
      if (category) {
        setSelectedCategories([category.name])
      }
    }
  }, [categoryParam, categories])

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    setNotification(`Added ${product.name} to cart!`)
    setTimeout(() => setNotification(null), 3000)
  }

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]
    const initialCount = filtered.length

    // Comprehensive search filter - searches ALL available product fields
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      const originalCount = filtered.length
      
      filtered = filtered.filter(p => {
        // Search in name (most important)
        const nameMatch = p.name?.toLowerCase().includes(query) || false
        
        // Search in description
        const descMatch = p.description?.toLowerCase().includes(query) || false
        
        // Search in category
        const categoryMatch = p.category?.toLowerCase().includes(query) || false
        
        // Search in any additional fields if they exist (using type assertion for optional fields)
        const productAny = p as any
        const tagsMatch = productAny.tags?.some((tag: string) => tag?.toLowerCase().includes(query)) || false
        const skuMatch = productAny.sku?.toLowerCase().includes(query) || false
        const materialMatch = productAny.material?.toLowerCase().includes(query) || false
        const shortDescMatch = productAny.shortDescription?.toLowerCase().includes(query) || false
        const fullDescMatch = productAny.fullDescription?.toLowerCase().includes(query) || false
        
        // Return true if ANY field matches
        const matches = nameMatch || descMatch || categoryMatch || tagsMatch || skuMatch || materialMatch || shortDescMatch || fullDescMatch
        
        if (matches) {
          console.log('✅ Product matches:', p.name)
        }
        
        return matches
      })
      
      console.log(`🔍 Search "${query}": ${originalCount} → ${filtered.length} products`)
    }

    // Category filter
    if (selectedCategories.length > 0) {
      const beforeCount = filtered.length
      filtered = filtered.filter(p => selectedCategories.includes(p.category))
      console.log(`📂 Category filter: ${beforeCount} → ${filtered.length} products (selected: ${selectedCategories.join(', ')})`)
    }

    // Age Range filter
    if (selectedAges.length > 0) {
      filtered = filtered.filter(p => {
        const productAny = p as any
        const productAgeRange = productAny.ageRange || []
        
        // If product has no age range data, show it (better UX)
        if (!productAgeRange || productAgeRange.length === 0) {
          return true
        }
        
        // Check if product has any of the selected age ranges
        return selectedAges.some(age => {
          // Match different age range formats
          const ageLower = age.toLowerCase()
          return productAgeRange.some((productAge: string) => {
            const productAgeLower = String(productAge).toLowerCase()
            // Handle formats like "0-3m", "0-3 months", etc.
            if (ageLower.includes('0-3') && (productAgeLower.includes('0-3') || productAgeLower.includes('0-3m'))) return true
            if (ageLower.includes('3-6') && (productAgeLower.includes('3-6') || productAgeLower.includes('3-6m'))) return true
            if (ageLower.includes('6-12') && (productAgeLower.includes('6-12') || productAgeLower.includes('6-12m'))) return true
            if (ageLower.includes('1-2') && (productAgeLower.includes('1-2') || productAgeLower.includes('1-2y'))) return true
            if (ageLower.includes('2-3') && (productAgeLower.includes('2-3') || productAgeLower.includes('2-3y'))) return true
            return productAgeLower.includes(ageLower) || ageLower.includes(productAgeLower)
          })
        })
      })
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => {
        const productAny = p as any
        const productBrand = String(productAny.brand || productAny.brandName || '').toLowerCase()
        
        // If product has no brand data, show it (better UX)
        if (!productBrand || productBrand.trim() === '') {
          return true
        }
        
        return selectedBrands.some(brand => {
          const brandLower = brand.toLowerCase()
          return productBrand.includes(brandLower) || brandLower.includes(productBrand)
        })
      })
    }

    // Price filter - use salePrice if available, otherwise use price
    const beforePriceCount = filtered.length
    filtered = filtered.filter(p => {
      const productPrice = p.salePrice && p.salePrice < (p.originalPrice || p.price) 
        ? p.salePrice 
        : (p.originalPrice || p.price)
      // If max is at or above maxProductPrice, show all products
      const maxFilter = priceRange[1] >= maxProductPrice ? Infinity : priceRange[1]
      return productPrice >= priceRange[0] && productPrice <= maxFilter
    })
    if (priceRange[0] > 0 || priceRange[1] < maxProductPrice) {
      console.log(`💰 Price filter (₹${priceRange[0]}-₹${priceRange[1]}): ${beforePriceCount} → ${filtered.length} products`)
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(p => p.rating >= minRating)
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = a.salePrice && a.salePrice < (a.originalPrice || a.price) ? a.salePrice : (a.originalPrice || a.price)
          const priceB = b.salePrice && b.salePrice < (b.originalPrice || b.price) ? b.salePrice : (b.originalPrice || b.price)
          return priceA - priceB
        })
        break
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = a.salePrice && a.salePrice < (a.originalPrice || a.price) ? a.salePrice : (a.originalPrice || a.price)
          const priceB = b.salePrice && b.salePrice < (b.originalPrice || b.price) ? b.salePrice : (b.originalPrice || b.price)
          return priceB - priceA
        })
        break
      case 'newest':
        filtered.reverse()
        break
      case 'best-selling':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    console.log(`🔍 Total filters applied: ${initialCount} → ${filtered.length} products`)
    return filtered
  }, [allProducts, searchQuery, selectedCategories, selectedAges, selectedBrands, priceRange, minRating, sortBy, maxProductPrice])

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleAge = (age: string) => {
    setSelectedAges(prev =>
      prev.includes(age)
        ? prev.filter(a => a !== age)
        : [...prev, age]
    )
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, maxProductPrice])
    setSelectedAges([])
    setSelectedBrands([])
    setMinRating(0)
  }

  const FiltersSidebar = () => (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-purple">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-pink-dark hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.name)}
                onChange={() => toggleCategory(cat.name)}
                className="w-4 h-4 text-purple focus:ring-purple rounded"
              />
              <span className="text-sm text-gray-700">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3">Price Range</h4>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={maxProductPrice}
            step="10"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1] >= maxProductPrice ? `${priceRange[1]}+` : priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Age Range */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3">Age Range</h4>
        <div className="space-y-2">
          {ageRanges.map((age) => (
            <label key={age} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedAges.includes(age)}
                onChange={() => toggleAge(age)}
                className="w-4 h-4 text-purple focus:ring-purple rounded"
              />
              <span className="text-sm text-gray-700">{age}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3">Brand</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 text-purple focus:ring-purple rounded"
              />
              <span className="text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3">Rating</h4>
        <div className="space-y-2">
          {[5, 4, 3].map((rating) => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={minRating === rating}
                onChange={() => setMinRating(rating)}
                className="w-4 h-4 text-purple focus:ring-purple"
              />
              <span className="text-sm text-gray-700">
                {rating} {rating === 5 ? 'stars' : '+ stars'}
              </span>
            </label>
          ))}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={minRating === 0}
              onChange={() => setMinRating(0)}
              className="w-4 h-4 text-purple focus:ring-purple"
            />
            <span className="text-sm text-gray-700">All ratings</span>
          </label>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Link 
              href="/"
              className="hover:text-purple transition-colors cursor-pointer"
            >
              Home
            </Link>
            <FiChevronRight className="w-4 h-4" />
            <span className="text-purple font-semibold">Products</span>
          </div>
        </nav>

        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-purple mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Products'}
            </h1>
            <p className="text-gray-600">
              {searchQuery 
                ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
                : `Showing ${filteredProducts.length} products`}
            </p>
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden bg-white px-4 py-2 rounded-lg shadow-md flex items-center space-x-2"
            >
              <span>Filters</span>
              {showFilters ? <FiX /> : <span>☰</span>}
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low-High</option>
              <option value="price-high">Price: High-Low</option>
              <option value="newest">Newest</option>
              <option value="best-selling">Best Selling</option>
            </select>

            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-purple text-white' : 'bg-white text-gray-600'}`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-purple text-white' : 'bg-white text-gray-600'}`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className={`w-full md:w-1/4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <FiltersSidebar />
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <ProductListCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex justify-center items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-purple hover:text-white"
                >
                  {page}
                </button>
              ))}
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
            </div>
          </main>
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

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (p: Product) => void }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all transform hover:scale-105 hover:shadow-lg cursor-pointer">
        <div className="aspect-square relative">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-base text-purple">{product.name}</h3>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">★</span>
            ))}
          </div>
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
          <button
            onClick={(e) => {
              e.preventDefault()
              onAddToCart(product)
            }}
            className="w-full bg-primary-pink-dark hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  )
}

function ProductListCard({ product, onAddToCart }: { product: Product; onAddToCart: (p: Product) => void }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="w-full md:w-32 h-32 flex-shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-purple mb-2">{product.name}</h3>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">★</span>
            ))}
          </div>
          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
          <div className="flex items-baseline space-x-2 mb-2">
            <p className="text-xl font-bold text-primary-pink-dark">
              ₹{product.salePrice && product.salePrice < (product.originalPrice || product.price) ? product.salePrice.toFixed(2) : product.price.toFixed(2)}
            </p>
            {product.salePrice && product.salePrice < (product.originalPrice || product.price) && (
              <p className="text-sm text-gray-500 line-through">
                ₹{(product.originalPrice || product.price).toFixed(2)}
              </p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              onAddToCart(product)
            }}
            className="bg-primary-pink-dark hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  )
}

