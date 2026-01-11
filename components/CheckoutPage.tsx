'use client'

import { useState } from 'react'
import { FiChevronRight, FiEdit2 } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { useOrderStore } from '@/store/orderStore'
import { useCustomerStore } from '@/store/customerStore'
import Link from 'next/link'

type Step = 'shipping' | 'method' | 'review'

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<Step>('shipping')
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { addOrder } = useOrderStore()
  const { getCustomerByEmail, addCustomer, updateCustomer } = useCustomerStore()
  const [formData, setFormData] = useState({
    // Shipping
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    // Method
    shippingMethod: 'standard' as 'standard' | 'express' | 'overnight',
  })

  const shippingCosts = {
    standard: 0,
    express: 9.99,
    overnight: 19.99
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 50 ? 0 : shippingCosts[formData.shippingMethod]
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const steps: { id: Step; label: string }[] = [
    { id: 'shipping', label: 'Shipping' },
    { id: 'method', label: 'Shipping Method' },
    { id: 'review', label: 'Review & Place Order' }
  ]

  const handleNext = () => {
    const stepOrder: Step[] = ['shipping', 'method', 'review']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const stepOrder: Step[] = ['shipping', 'method', 'review']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  const handlePlaceOrder = () => {
    // Create order items from cart
    const orderItems = items.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }))

    // Create or update customer
    let customer = getCustomerByEmail(formData.email)
    if (!customer) {
      addCustomer({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zip,
      })
      customer = getCustomerByEmail(formData.email)
    } else {
      // Update customer info if needed
      updateCustomer(customer.id, {
        phone: formData.phone || customer.phone,
        address: formData.address || customer.address,
        city: formData.city || customer.city,
        state: formData.state || customer.state,
        zipCode: formData.zip || customer.zipCode,
      })
    }

    // Create order
    const order = addOrder({
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      },
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      shippingMethod: formData.shippingMethod,
      paymentMethod: 'Cash on Delivery',
    })

    // Update customer stats
    if (customer) {
      updateCustomer(customer.id, {
        totalOrders: (customer.totalOrders || 0) + 1,
        totalSpent: (customer.totalSpent || 0) + total,
        lastOrderDate: new Date().toISOString(),
      })
    }

    alert(`Order placed successfully! Order Number: ${order.orderNumber}`)
    clearCart()
    window.location.href = '/'
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-purple mb-4">Your cart is empty</h2>
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
        <h1 className="text-3xl font-bold text-purple mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      steps.findIndex(s => s.id === currentStep) >= index
                        ? 'bg-purple text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="mt-2 text-sm font-semibold text-gray-700">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <FiChevronRight className="w-5 h-5 text-gray-400 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Step 1: Shipping Information */}
            {currentStep === 'shipping' && (
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-purple mb-6">Shipping Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">ZIP Code *</label>
                    <input
                      type="text"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                      required
                    />
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  className="mt-6 bg-primary-pink-dark hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Continue to Shipping Method
                </button>
              </div>
            )}

            {/* Step 2: Shipping Method */}
            {currentStep === 'method' && (
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-purple mb-6">Shipping Method</h2>
                <div className="space-y-4">
                  {[
                    { id: 'standard', label: 'Standard Shipping', time: '5-7 days', price: subtotal >= 50 ? 0 : 0 },
                    { id: 'express', label: 'Express Shipping', time: '2-3 days', price: 9.99 },
                    { id: 'overnight', label: 'Overnight Shipping', time: '1 day', price: 19.99 }
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.shippingMethod === method.id
                          ? 'border-purple bg-purple/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.id}
                        checked={formData.shippingMethod === method.id}
                        onChange={(e) => setFormData({ ...formData, shippingMethod: e.target.value as typeof formData.shippingMethod })}
                        className="w-5 h-5 text-purple focus:ring-purple"
                      />
                      <div className="ml-4 flex-1">
                        <div className="font-semibold text-gray-900">{method.label}</div>
                        <div className="text-sm text-gray-600">{method.time}</div>
                      </div>
                      <div className="font-bold text-purple">
                        {method.price === 0 ? 'Free' : `₹${method.price.toFixed(2)}`}
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={handleBack}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="bg-primary-pink-dark hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 'review' && (
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-purple mb-6">Review Your Order</h2>
                
                {/* Shipping Info */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Shipping Information</h3>
                    <button onClick={() => setCurrentStep('shipping')} className="text-purple hover:text-purple-light flex items-center space-x-1">
                      <FiEdit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <p className="text-gray-600">
                    {formData.firstName} {formData.lastName}<br />
                    {formData.address}<br />
                    {formData.city}, {formData.state} {formData.zip}
                  </p>
                </div>

                {/* Shipping Method */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Shipping Method</h3>
                    <button onClick={() => setCurrentStep('method')} className="text-purple hover:text-purple-light flex items-center space-x-1">
                      <FiEdit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <p className="text-gray-600 capitalize">{formData.shippingMethod} Shipping</p>
                </div>

                {/* Payment Method */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Payment Method</h3>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">₹</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when you receive your order</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={handleBack}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="bg-primary-pink-dark hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-purple mb-6">Order Summary</h2>
              
              <div className="space-y-2 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.name} x{item.quantity}</span>
                    <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {subtotal >= 50 ? 'Free' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-purple">Total</span>
                  <span className="text-2xl font-bold text-primary-pink-dark">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

