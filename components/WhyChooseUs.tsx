export default function WhyChooseUs() {
  const features = [
    {
      icon: '🛡️',
      title: 'Safety First',
      points: [
        'Non-toxic, baby-safe materials',
        'Meets international safety standards',
        'Your baby\'s health is our priority'
      ]
    },
    {
      icon: '🏆',
      title: 'Quality Craftsmanship',
      points: [
        'Crafted with care and attention',
        'Ensures comfort for baby and parents',
        'Premium materials only'
      ]
    },
    {
      icon: '⭐',
      title: 'Parent Approved',
      points: [
        'Recognized by parents worldwide',
        'Quality and innovation',
        'Trusted by thousands of families'
      ]
    }
  ]

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-primary-pink/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary-pink rounded-full flex items-center justify-center text-4xl">
                {feature.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-purple">
                {feature.title}
              </h3>
              <ul className="space-y-2 text-gray-600">
                {feature.points.map((point, i) => (
                  <li key={i} className="text-sm md:text-base">• {point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

