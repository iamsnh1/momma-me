import { categories } from '@/data/products'

export default function ProductCategories() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`#products-${category.id}`}
                className="flex items-center space-x-4 p-4 rounded-lg hover:shadow-md transition-all transform hover:scale-[1.02] cursor-pointer border border-gray-100 hover:border-primary-pink"
              >
                {/* Icon */}
                <div className="w-[60px] h-[60px] bg-primary-pink rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl md:text-4xl">{category.icon}</span>
                </div>
                
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-purple mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

