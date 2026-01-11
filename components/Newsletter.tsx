'use client'

import { useState } from 'react'
import { FiArrowRight } from 'react-icons/fi'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-gradient-to-r from-primary-pink-dark to-purple">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Stay Updated With Our Latest Products
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg shadow-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <button
            type="submit"
            className="bg-purple hover:bg-purple-light text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>Subscribe</span>
            <FiArrowRight className="w-5 h-5" />
          </button>
        </form>

        {submitted && (
          <p className="text-white text-sm">Thank you for subscribing!</p>
        )}
      </div>
    </section>
  )
}

