import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getCategoryById,
  getSubcategories,
  getPartsCountByCategory,
  type CartecCategory,
} from '@/lib/db/cartec';

// ── Sub-category Card ────────────────────────────────────────
function SubcategoryCard({
  sub,
  partsCount,
}: {
  sub: CartecCategory;
  partsCount: number;
}) {
  return (
    <div className="group bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-md hover:border-orange-200 transition-all">
      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
        {sub.img ? (
          <img
            src={`https://www.cartec.ma${sub.img}`}
            alt={sub.name}
            className="w-7 h-7 object-contain"
          />
        ) : (
          <svg className="w-6 h-6 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
          </svg>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-slate-800 group-hover:text-orange-600 transition-colors text-sm leading-snug truncate">
          {sub.name}
        </h3>
        {partsCount > 0 && (
          <p className="text-xs text-slate-400 mt-0.5">
            {partsCount} part{partsCount !== 1 ? 's' : ''} in catalog
          </p>
        )}
      </div>

      <svg
        className="w-4 h-4 text-slate-300 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all shrink-0"
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = parseInt(id, 10);

  if (isNaN(categoryId)) notFound();

  const category = getCategoryById(categoryId);
  if (!category) notFound();

  const subcategories = getSubcategories(categoryId);
  const partsCount = getPartsCountByCategory();

  // Total parts across all subcategories
  const totalParts = subcategories.reduce(
    (sum, s) => sum + (partsCount.get(s.id) ?? 0),
    0
  );

  // Parent category for breadcrumb (if this is a sub being browsed directly)
  const parent = category.parentId ? getCategoryById(category.parentId) : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#0a1628] text-white py-10">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
            {parent && (
              <>
                <span>/</span>
                <Link href={`/categories/${parent.id}`} className="hover:text-white transition-colors">
                  {parent.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-slate-200">{category.name}</span>
          </nav>

          <div className="flex items-center gap-4">
            {category.img && (
              <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center p-2 shrink-0">
                <img
                  src={`https://www.cartec.ma${category.img}`}
                  alt={category.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {subcategories.length > 0 && (
                  <span className="text-xs font-medium bg-white/10 text-slate-300 px-3 py-1 rounded-full">
                    {subcategories.length} sub-categor{subcategories.length !== 1 ? 'ies' : 'y'}
                  </span>
                )}
                {totalParts > 0 && (
                  <span className="text-xs font-medium bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full">
                    {totalParts} parts in catalog
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {subcategories.length > 0 ? (
          <>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Sub-categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {subcategories.map((sub) => (
                <Link key={sub.id} href={`/categories/${sub.id}`}>
                  <SubcategoryCard
                    sub={sub}
                    partsCount={partsCount.get(sub.id) ?? 0}
                  />
                </Link>
              ))}
            </div>
          </>
        ) : (
          /* Leaf category — show that it's a parts type */
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
              {category.img ? (
                <img
                  src={`https://www.cartec.ma${category.img}`}
                  alt={category.name}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </div>
            <h2 className="text-lg font-semibold text-slate-700">{category.name}</h2>
            <p className="text-slate-500 mt-1 text-sm">
              {(partsCount.get(categoryId) ?? 0) > 0
                ? `${partsCount.get(categoryId)} parts available in this category — search by vehicle to find compatible ones.`
                : 'Search by vehicle to find compatible parts in this category.'}
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <Link
                href="/categories"
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                ← Back to categories
              </Link>
              <Link
                href="/#search"
                className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
              >
                Search by vehicle →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
