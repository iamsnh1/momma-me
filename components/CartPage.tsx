'use client'

import { useState } from 'react'
import { FiX, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'overnight'>('standard')

  const shippingCosts = {
    standard: 0,
    express: 9.99,
    overnight: 19.99
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 50 ? 0 : shippingCosts[shippingMethod]
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <FiShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-purple mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Start shopping to add items to your cart!</p>
          <Link
            href="/products"
            className="inline-block bg-primary-pink-dark hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-purple mb-8">Shopping Cart</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col md:flex-row gap-4">
                {/* Image */}
                <div className="w-full md:w-32 h-32 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-purple mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.category}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xl font-bold text-primary-pink-dark">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-semibold"
            >
              Clear Cart
            </button>
          </div>

          {/* Cart Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-purple mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>

                {/* Shipping Method */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Shipping</label>
                  <select
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value as typeof shippingMethod)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                  >
                    <option value="standard">Standard (5-7 days) - {subtotal >= 50 ? 'Free' : '₹0.00'}</option>
                    <option value="express">Express (2-3 days) - ₹9.99</option>
                    <option value="overnight">Overnight - ₹19.99</option>
                  </select>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {subtotal >= 50 ? 'Free' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>

                {subtotal < 50 && (
                  <p className="text-sm text-green-600">
                    Add ₹{(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-purple">Total</span>
                  <span className="text-2xl font-bold text-primary-pink-dark">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-primary-pink-dark hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors mb-4"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="block w-full text-center text-purple hover:text-purple-light font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

