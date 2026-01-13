'use client'

import { useState, useEffect } from 'react'
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { useCategoryStore } from '@/store/categoryStore'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const totalItems = useCartStore((state) => state.getTotalItems())
  const { getActiveCategories, initialize: initializeCategories } = useCategoryStore()
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'
  
  useEffect(() => {
    setMounted(true)
    initializeCategories()
  }, [initializeCategories])
  
  const categories = mounted ? getActiveCategories() : []

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const performSearch = () => {
    const trimmedQuery = searchQuery.trim()
    if (trimmedQuery && typeof window !== 'undefined') {
      window.location.href = `/products?search=${encodeURIComponent(trimmedQuery)}`
    }
  }

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault()
    performSearch()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      performSearch()
    }
  }

  return (
    <>
      {/* Top Header Bar */}
      <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple via-primary-pink-dark to-pink-500 flex items-center justify-center text-white text-xl font-black shadow-lg">
                M
              </div>
              <span className="hidden sm:inline text-xl md:text-2xl font-black">
                <span className="text-purple">M</span>
                <span className="text-primary-pink-dark text-2xl">💗</span>
                <span className="text-purple">mma</span>
                <span className="text-purple">& Me</span>
              </span>
            </Link>
            
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-l-xl focus:outline-none focus:border-purple focus:ring-2 focus:ring-purple/20 transition-all shadow-sm"
              />
              <button 
                type="button"
                onClick={handleSearchClick}
                className="bg-gradient-to-r from-purple to-purple-light text-white px-8 py-3 rounded-r-xl hover:from-purple-light hover:to-purple transition-all shadow-md hover:shadow-lg font-semibold cursor-pointer"
              >
                🔍 Search
              </button>
            </div>
          </div>

          {/* Right Side Links */}
          <div className="hidden lg:flex items-center space-x-4 text-sm">
            {!isHome && (
              <Link href="/admin/login" className="text-purple hover:text-purple-light font-semibold border border-purple px-3 py-1.5 rounded-lg hover:bg-purple/10 transition-colors">
                Admin
              </Link>
            )}
            <Link href="/cart" className="relative flex items-center space-x-1">
              <FiShoppingCart className="w-5 h-5 text-gray-700" />
              <span className="text-sm">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Cart */}
          <Link href="/cart" className="lg:hidden relative">
            <FiShoppingCart className="w-6 h-6 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Yellow Navigation Bar - FirstCry Style */}
      <nav className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 sticky top-[81px] z-40 shadow-md border-b-2 border-yellow-500">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center overflow-x-auto">
            <div 
              className="relative flex items-center space-x-1 px-5 py-4 font-black text-gray-900 cursor-pointer hover:bg-yellow-500 transition-all duration-200 rounded-t-lg"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              role="button"
              tabIndex={0}
              aria-haspopup="menu"
              aria-expanded={isDropdownOpen}
            >
              <span className="text-sm md:text-base">ALL CATEGORIES</span>
              <span className="text-lg">▾</span>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-2xl p-5 grid grid-cols-2 gap-3 z-50 border-2 border-purple/20">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.id}`}
                      className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-lg transition-all hover:shadow-md"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-sm font-semibold text-gray-700">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/products?category=newborn" className="px-5 py-4 font-bold text-gray-900 hover:bg-yellow-500 transition-all duration-200 whitespace-nowrap text-sm md:text-base">NEW BORN</Link>
            <Link href="/products?category=infant" className="px-5 py-4 font-bold text-gray-900 hover:bg-yellow-500 transition-all duration-200 whitespace-nowrap text-sm md:text-base">INFANT UTILITIES</Link>
            <Link href="/products?category=fashion" className="px-5 py-4 font-bold text-gray-900 hover:bg-yellow-500 transition-all duration-200 whitespace-nowrap text-sm md:text-base">FASHION</Link>
            <Link href="/products?category=toys" className="px-5 py-4 font-bold text-gray-900 hover:bg-yellow-500 transition-all duration-200 whitespace-nowrap text-sm md:text-base">TOYS & PLAY</Link>
            <Link href="/products?category=travel" className="px-5 py-4 font-bold text-gray-900 hover:bg-yellow-500 transition-all duration-200 whitespace-nowrap text-sm md:text-base">TRAVEL GEAR</Link>
            <Link href="/products?category=maternity" className="px-5 py-4 font-bold text-gray-900 hover:bg-yellow-500 transition-all duration-200 whitespace-nowrap text-sm md:text-base">MATERNITY</Link>
            <Link href="/products?category=gifts" className="px-5 py-4 font-bold text-gray-900 hover:bg-yellow-500 transition-all duration-200 whitespace-nowrap text-sm md:text-base">GIFT SETS</Link>
            <div className="ml-auto flex items-center space-x-3">
              <span className="px-5 py-3 font-black text-blue-600 bg-white rounded-xl shadow-lg border-2 border-blue-200 hover:scale-105 transition-transform">CLUB</span>
              <span className="px-5 py-3 font-black text-white bg-gradient-to-r from-red-600 to-red-500 rounded-xl shadow-lg hover:scale-105 transition-transform">DEALS</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden absolute top-3 right-4"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <FiX className="w-6 h-6 text-gray-700" />
        ) : (
          <FiMenu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden pt-24 px-4">
          <div className="flex flex-col space-y-4">
            {/* Mobile Search Bar */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple focus:ring-2 focus:ring-purple/20"
              />
              <button 
                type="button"
                onClick={handleSearchClick}
                className="bg-gradient-to-r from-purple to-purple-light text-white px-6 py-3 rounded-lg hover:from-purple-light hover:to-purple transition-all font-semibold cursor-pointer"
              >
                🔍
              </button>
            </div>
            <Link href="/" className="text-gray-700 hover:text-purple transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/products" className="text-gray-700 font-semibold py-2" onClick={() => setIsMenuOpen(false)}>Products</Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="text-gray-600 hover:text-purple transition-colors pl-4 py-1 flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
            {!isHome && (
              <Link href="/admin/login" className="text-purple hover:text-purple-light font-semibold border border-purple px-3 py-1.5 rounded-lg hover:bg-purple/10 transition-colors inline-block" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}

