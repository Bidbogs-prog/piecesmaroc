import Link from 'next/link';
import type { Product } from '@/types/database';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-200 overflow-hidden">
        {product.image_urls && product.image_urls.length > 0 ? (
          <img
            src={product.image_urls[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Condition Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              product.condition === 'aftermarket'
                ? 'bg-green-500 text-white'
                : product.condition === 'refurbished'
                ? 'bg-blue-500 text-white'
                : 'bg-yellow-500 text-white'
            }`}
          >
            {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
          </span>
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{discountPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Car Make/Model */}
        <div className="text-sm text-gray-600 mb-1">
          {product.car_make}
          {product.car_model && ` ${product.car_model}`}
          {product.year_from && ` (${product.year_from}`}
          {product.year_to && `-${product.year_to}`}
          {product.year_from && ')'}
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-blue-600">{product.price} DH</span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">{product.original_price} DH</span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between text-sm">
          <span
            className={`${
              product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'
            } font-medium`}
          >
            {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity})` : 'Out of Stock'}
          </span>
          {product.supplier && (
            <span className="text-gray-500 text-xs">{product.supplier.name}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
