'use client'

import { useState, useEffect } from 'react'

const testimonials: any[] = []

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [])

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-purple text-center mb-8 md:mb-12">
          What Our Customers Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-lg p-6 space-y-4"
            >
              {/* Star Rating */}
              <div className="flex items-center">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-gray-600 italic text-sm md:text-base">
                "{testimonial.text}"
              </p>
              
              {/* Customer Name */}
              <p className="font-bold text-purple">
                - {testimonial.name}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile Carousel Indicators */}
        <div className="flex justify-center space-x-2 mt-6 md:hidden">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-purple' : 'bg-gray-300'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

