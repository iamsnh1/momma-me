'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FiLayout,
  FiPackage,
  FiFolder,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiBell,
  FiImage,
  FiAward,
  FiUser,
  FiChevronDown
} from 'react-icons/fi'
import { useOrderStore } from '@/store/orderStore'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const notificationRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  
  const { getAllOrders, initialize: initializeOrders } = useOrderStore()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    initializeOrders()
  }, [initializeOrders])
  
  const allOrders = mounted ? getAllOrders() : []
  const pendingOrders = allOrders.filter(order => order.status === 'pending')
  const recentPendingOrders = pendingOrders.slice(0, 5)

  useEffect(() => {
    // Check authentication via cookie
    if (typeof window !== 'undefined' && mounted) {
      const cookies = document.cookie || ''
      const isAuth = cookies.split(';').some(c => c.trim().startsWith('adminAuth='))
      // Only redirect if not authenticated and not already on login page
      if (!isAuth && pathname !== '/admin/login' && pathname.startsWith('/admin')) {
        router.push('/admin/login')
      }
    }
  }, [pathname, router, mounted])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    // Clear cookie
    document.cookie = 'adminAuth=; path=/; max-age=0; samesite=lax'
    router.push('/admin/login')
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiLayout, path: '/admin/dashboard' },
    { id: 'products', label: 'Products', icon: FiPackage, path: '/admin/products' },
    { id: 'categories', label: 'Categories', icon: FiFolder, path: '/admin/categories' },
    { id: 'banners', label: 'Banners & Ads', icon: FiImage, path: '/admin/banners' },
    { id: 'trust-badges', label: 'Trust Badges', icon: FiAward, path: '/admin/trust-badges' },
    { id: 'footer', label: 'Footer Settings', icon: FiSettings, path: '/admin/footer' },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag, path: '/admin/orders' },
    { id: 'customers', label: 'Customers', icon: FiUsers, path: '/admin/customers' },
    { id: 'settings', label: 'Settings', icon: FiSettings, path: '/admin/settings' }
  ]

  const isActive = (path: string) => pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gray-800 text-white transition-all duration-300 z-40 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-primary-pink-dark flex items-center justify-center text-white font-bold">
              M
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-bold">
                <span className="text-purple-light">M</span>
                <span className="text-primary-pink-dark">💗</span>
                <span className="text-purple-light">mma</span>
              </span>
            )}
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-pink-dark text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 w-full transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="bg-white shadow-md sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 hover:text-purple"
            >
              ☰
            </button>

            <div className="flex items-center space-x-4 flex-1 max-w-md mx-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative text-gray-600 hover:text-purple transition-colors"
                >
                  <FiBell className="w-6 h-6" />
                  {pendingOrders.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                      {pendingOrders.length > 9 ? '9+' : pendingOrders.length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 bg-purple text-white">
                      <h3 className="font-bold text-lg">Notifications</h3>
                      <p className="text-sm text-purple-light">
                        {pendingOrders.length} pending {pendingOrders.length === 1 ? 'order' : 'orders'}
                      </p>
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {recentPendingOrders.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          <FiBell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>No pending orders</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {recentPendingOrders.map((order) => (
                            <Link
                              key={order.id}
                              href="/admin/orders"
                              onClick={() => setShowNotifications(false)}
                              className="block p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                  <FiShoppingBag className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 truncate">
                                    New Order: {order.orderNumber}
                                  </p>
                                  <p className="text-sm text-gray-600 truncate">
                                    {order.customerName}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    ₹{order.total.toFixed(2)} • {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    {pendingOrders.length > 5 && (
                      <div className="p-3 border-t border-gray-200 bg-gray-50">
                        <Link
                          href="/admin/orders"
                          onClick={() => setShowNotifications(false)}
                          className="block text-center text-purple hover:text-purple-dark font-semibold text-sm"
                        >
                          View all orders
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white font-bold hover:bg-primary-pink-dark transition-colors cursor-pointer"
                >
                  A
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">Admin User</p>
                      <p className="text-sm text-gray-500">admin@mommaandme.com</p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/admin/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiUser className="w-5 h-5" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/admin/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiSettings className="w-5 h-5" />
                        <span>Settings</span>
                      </Link>
                    </div>
                    <div className="border-t border-gray-200 py-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          handleLogout()
                        }}
                        className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full transition-colors"
                      >
                        <FiLogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

