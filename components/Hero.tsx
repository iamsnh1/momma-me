export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-bg-pink to-bg-purple py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left: Text Content */}
        <div className="text-center md:text-left space-y-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple leading-tight">
            Premium Baby Products Crafted With Love For Your Little Ones
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Safe, comfortable, and designed to make parenting a beautiful journey filled with precious moments
          </p>
          <button className="bg-primary-pink-dark hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg">
            Shop Now
          </button>
        </div>

        {/* Right: Image */}
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800&h=800&fit=crop"
              alt="Happy smiling baby"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

