'use client'

import { useEffect, useState } from 'react'
import { FiPackage, FiShoppingBag, FiDollarSign, FiUsers } from 'react-icons/fi'
import { useProductStore } from '@/store/productStore'
import { useCustomerStore } from '@/store/customerStore'
import { useOrderStore } from '@/store/orderStore'

export default function AdminDashboard() {
  const { products, getAllProducts, initialize } = useProductStore()
  const { customers, getAllCustomers, initialize: initializeCustomers } = useCustomerStore()
  const { orders, getAllOrders, initialize: initializeOrders } = useOrderStore()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    initialize()
    initializeCustomers()
    initializeOrders()
  }, [initialize, initializeCustomers, initializeOrders])
  
  const allProducts = mounted ? getAllProducts() : []
  const allCustomers = mounted ? getAllCustomers() : []
  const allOrders = mounted ? getAllOrders() : []

  const stats = [
    {
      label: 'Total Products',
      value: allProducts.length,
      icon: FiPackage,
      color: 'bg-blue-500',
      change: '+0%'
    },
    {
      label: 'Total Orders',
      value: allOrders.length.toString(),
      icon: FiShoppingBag,
      color: 'bg-green-500',
      change: '+0%'
    },
    {
      label: 'Revenue',
      value: `₹${allOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}`,
      icon: FiDollarSign,
      color: 'bg-purple',
      change: '+0%'
    },
    {
      label: 'Active Customers',
      value: allCustomers.length.toString(),
      icon: FiUsers,
      color: 'bg-primary-pink-dark',
      change: '+0%'
    }
  ]

  const recentOrders = allOrders.slice(0, 5)

  const topProducts = allProducts.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-purple mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-purple mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            {recentOrders.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Order #</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Customer</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm font-medium text-purple">{order.orderNumber}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{order.customerName}</td>
                      <td className="px-4 py-2 text-sm font-semibold">₹{order.total.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No orders yet. Orders will appear here once customers start purchasing.</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-purple mb-4">Top Products</h2>
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-600">₹{product.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple">#{index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No products yet. Add products from the Products page to see them here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sales Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-purple mb-4">Sales Overview</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Chart visualization would go here</p>
        </div>
      </div>
    </div>
  )
}

