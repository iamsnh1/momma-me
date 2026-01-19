import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <h1 className="text-4xl font-bold text-purple mb-6">Shipping Information</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-purple mt-8 mb-4">Shipping Options</h2>
            <div className="space-y-4 mb-8">
              <div className="border-l-4 border-purple pl-4">
                <h3 className="font-bold text-lg text-gray-900">Standard Shipping</h3>
                <p className="text-gray-700">Free on orders over ₹50. Delivery in 5-7 business days.</p>
              </div>
              <div className="border-l-4 border-purple pl-4">
                <h3 className="font-bold text-lg text-gray-900">Express Shipping</h3>
                <p className="text-gray-700">₹9.99. Delivery in 2-3 business days.</p>
              </div>
              <div className="border-l-4 border-purple pl-4">
                <h3 className="font-bold text-lg text-gray-900">Overnight Shipping</h3>
                <p className="text-gray-700">₹19.99. Delivery next business day.</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-purple mt-8 mb-4">Shipping Locations</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We currently ship to all major cities in India. International shipping 
              is available for select countries. Please contact us for more information.
            </p>
            
            <h2 className="text-2xl font-bold text-purple mt-8 mb-4">Order Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Once your order is shipped, you will receive a tracking number via email. 
              You can use this number to track your package on our website or the 
              carrier's website.
            </p>
            
            <h2 className="text-2xl font-bold text-purple mt-8 mb-4">Processing Time</h2>
            <p className="text-gray-700 leading-relaxed">
              Orders are typically processed within 1-2 business days. During peak 
              seasons or sales, processing may take up to 3 business days. You will 
              receive an email confirmation once your order has been shipped.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
