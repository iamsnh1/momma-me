'use client'

import { useState, useEffect } from 'react'
import { FiEye, FiChevronRight } from 'react-icons/fi'
import { useOrderStore, Order } from '@/store/orderStore'

export default function AdminOrdersManagement() {
  const { orders, initialize, updateOrderStatus, getAllOrders } = useOrderStore()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    initialize()
  }, [initialize])

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | Order['status']>('all')
  
  const allOrders = mounted ? getAllOrders() : []

  const filteredOrders = allOrders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  )

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const order = selectedOrder ? allOrders.find(o => o.id === selectedOrder) : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple mb-2">Orders Management</h1>
          <p className="text-gray-600">View and manage customer orders</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | Order['status'])}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {selectedOrder && order ? (
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <button
            onClick={() => setSelectedOrder(null)}
            className="text-purple hover:text-purple-light mb-4 flex items-center space-x-2"
          >
            <FiChevronRight className="w-5 h-5 rotate-180" />
            <span>Back to Orders</span>
          </button>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-purple">Order {order.id}</h2>
              <select
                value={order.status}
                onChange={(e) => {
                  updateOrderStatus(order.id, e.target.value as Order['status'])
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-purple mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 bg-white p-4 rounded-lg">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-primary-pink-dark">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-purple mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold">₹{order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-semibold">₹{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-lg text-primary-pink-dark">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-purple mb-4">Shipping Information</h3>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-gray-900">{order.customerName}</p>
                <p className="text-gray-600">{order.customerEmail}</p>
                <p className="text-gray-600">{order.customerPhone}</p>
                <p className="text-gray-600 mt-2">
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">Shipping Method:</span> {order.shippingMethod.charAt(0).toUpperCase() + order.shippingMethod.slice(1)}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Payment Method:</span> {order.paymentMethod}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            {!mounted ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No orders yet. Orders will appear here once customers start purchasing.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-purple text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Order #</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Items</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-purple">{order.orderNumber}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-gray-900">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary-pink-dark">₹{order.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedOrder(order.id)}
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <FiEye className="w-5 h-5" />
                          <span className="text-sm">View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

