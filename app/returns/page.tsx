import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <h1 className="text-4xl font-bold text-purple mb-6">Returns & Exchanges</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-purple mt-8 mb-4">Return Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We want you to be completely satisfied with your purchase. If you're not 
              happy with your order, you can return it within 30 days of delivery for a 
              full refund or exchange.
            </p>
            
            <h2 className="text-2xl font-bold text-purple mt-8 mb-4">How to Return</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-6">
              <li>Contact our customer service team to initiate a return</li>
              <li>Receive a return authorization number</li>
              <li>Package the item in its original packaging</li>
              <li>Ship the item back to us using the provided return label</li>
              <li>Once received, we'll process your refund or exchange</li>
            </ol>
            
            <h2 className="text-2xl font-bold text-purple mt-8 mb-4">Return Conditions</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Items must be unused and in original condition</li>
              <li>Original packaging and tags must be included</li>
              <li>Personalized or custom items cannot be returned</li>
              <li>Sale items may have different return policies</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-purple mt-8 mb-4">Refund Processing</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Refunds will be processed to your original payment method within 5-10 
              business days after we receive your returned item. You will receive an 
              email confirmation once the refund has been processed.
            </p>
            
            <h2 className="text-2xl font-bold text-purple mt-8 mb-4">Exchanges</h2>
            <p className="text-gray-700 leading-relaxed">
              If you need to exchange an item for a different size or color, please 
              contact our customer service team. Exchanges are subject to product 
              availability and may require additional payment if the new item has a 
              higher price.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
