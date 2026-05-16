import Link from 'next/link';
import { getTopLevelCategories, getSubcategories, getPartsCountByCategory } from '@/lib/db/cartec';

export default function CategoriesPage() {
  const categories = getTopLevelCategories();
  const partsCount = getPartsCountByCategory();

  // Compute sub-count and total parts per top-level category
  const enriched = categories.map((cat) => {
    const subs = getSubcategories(cat.id);
    const totalParts = subs.reduce((sum, s) => sum + (partsCount.get(s.id) ?? 0), 0);
    return { cat, subCount: subs.length, totalParts };
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-[#0a1628] text-white py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
          <h1 className="text-3xl font-bold">Parts Categories</h1>
          <p className="text-slate-400 mt-1">
            Browse {categories.length} categories across our full parts catalog
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {enriched.map(({ cat, subCount, totalParts }) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="group bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-4 hover:shadow-lg hover:border-orange-200 transition-all"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                {cat.img ? (
                  <img
                    src={`https://www.cartec.ma${cat.img}`}
                    alt={cat.name}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <svg className="w-7 h-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </div>

              {/* Text */}
              <div className="flex-1">
                <h2 className="font-semibold text-slate-800 group-hover:text-orange-600 transition-colors leading-snug">
                  {cat.name}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {subCount} sub-categor{subCount !== 1 ? 'ies' : 'y'}
                  {totalParts > 0 && ` · ${totalParts} parts`}
                </p>
              </div>

              <span className="text-xs font-medium text-orange-500 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                Browse →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
