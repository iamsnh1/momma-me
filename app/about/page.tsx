import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <h1 className="text-4xl font-bold text-purple mb-6">About Us</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Welcome to M💗mma & Me, your trusted partner for premium baby and mom products. 
              We are dedicated to providing the highest quality products for your little ones 
              and supporting mothers on their journey.
            </p>
            
            <h2 className="text-2xl font-bold text-purple mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our mission is to make parenting easier by offering carefully curated, 
              high-quality products that meet the needs of both babies and mothers. 
              We believe every family deserves access to the best products at affordable prices.
            </p>
            
            <h2 className="text-2xl font-bold text-purple mt-8 mb-4">Why Choose Us?</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Premium quality products sourced from trusted manufacturers</li>
              <li>Affordable prices without compromising on quality</li>
              <li>Fast and reliable shipping</li>
              <li>Excellent customer service</li>
              <li>Mother-founded and family-oriented business</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-purple mt-8 mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              M💗mma & Me was founded by a mother who understood the challenges of finding 
              quality baby products. We started with a simple goal: to make shopping for 
              baby essentials easy, affordable, and stress-free. Today, we continue to 
              serve families with the same dedication and care.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
