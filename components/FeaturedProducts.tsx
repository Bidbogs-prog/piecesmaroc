import { getFeaturedProducts } from '@/lib/db/products';
import type { Product } from '@/types/database';
import ProductCard from './ProductCard';
import Link from 'next/link';

export default async function FeaturedProducts() {
  let products: Product[] = [];

  try {
    products = await getFeaturedProducts(8);
  } catch (error) {
    console.error('Error fetching featured products:', error);
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Parts</h2>
            <p className="text-gray-600">Discover our latest quality auto parts</p>
          </div>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
          >
            View All
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
