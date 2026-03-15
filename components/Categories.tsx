import { getMainCategories } from '@/lib/db/categories';
import type { Category } from '@/types/database';
import Link from 'next/link';

export default async function Categories() {
  let categories: Category[] = [];

  try {
    categories = await getMainCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
  }

  if (categories.length === 0) {
    return null;
  }

  // Icon mapping for categories
  const categoryIcons: { [key: string]: string } = {
    'engine-parts': '⚙️',
    'transmission': '🔧',
    'suspension-steering': '🛞',
    'braking-system': '🛑',
    'electrical-system': '🔋',
    'cooling-system': '❄️',
    'exhaust-system': '💨',
    'body-parts': '🚗',
    'lighting': '💡',
    'interior-parts': '🪑',
    'wheels-tires': '⚫',
    'filters-fluids': '🛢️',
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Category</h2>
          <p className="text-gray-600">Find the exact part you need</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 rounded-lg p-6 transition text-center"
            >
              {/* Icon */}
              <div className="text-4xl mb-3">{categoryIcons[category.slug] || '📦'}</div>

              {/* Category Name */}
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition mb-1">
                {category.name}
              </h3>

              {/* Description */}
              {category.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
