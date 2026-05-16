import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getCartecVehicleById,
  getPartsByVehicleId,
  type CartecPart,
  type PartsByCategory,
} from '@/lib/db/cartec';

// ── Part Card ────────────────────────────────────────────────
function PartCard({ part }: { part: CartecPart }) {
  const price = parseFloat(part.discountPrice);
  const hasPrice = price > 0;
  const hasImage = part.articleImg && !part.articleImg.includes('no-pic');

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 flex gap-4 hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
        {hasImage ? (
          <img
            src={`https://www.cartec.ma${part.articleImg}`}
            alt={part.articleName}
            className="w-full h-full object-contain"
          />
        ) : (
          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-slate-900 text-sm leading-snug">{part.articleName}</p>
            {part.articleExtraName && (
              <p className="text-xs text-slate-500 mt-0.5">{part.articleExtraName}</p>
            )}
          </div>
          {part.inStock ? (
            <span className="flex-shrink-0 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              In stock
            </span>
          ) : (
            <span className="flex-shrink-0 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              Out of stock
            </span>
          )}
        </div>

        {/* Brand + article number */}
        <div className="mt-1.5 flex items-center gap-2">
          <img
            src={`https://www.cartec.ma${part.brandLogo}`}
            alt={part.brandName}
            className="h-4 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="text-xs text-slate-500">{part.brandName}</span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs font-mono text-slate-500">{part.articleNumber}</span>
        </div>

        {/* Details */}
        {part.articleDetails.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {part.articleDetails.slice(0, 4).map((d) => (
              <span key={d.id} className="text-xs text-slate-500">
                <span className="text-slate-400">{d.shortName ?? d.name}:</span> {d.value}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        {hasPrice && (
          <p className="mt-2 text-sm font-semibold text-orange-600">
            {price.toFixed(2)} MAD
          </p>
        )}
      </div>
    </div>
  );
}

// ── Category Section ─────────────────────────────────────────
function CategorySection({ group }: { group: PartsByCategory }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        {group.category.img && (
          <img
            src={`https://www.cartec.ma${group.category.img}`}
            alt=""
            className="w-6 h-6 object-contain opacity-60"
          />
        )}
        <div>
          {group.parentCategory && (
            <p className="text-xs text-slate-400">{group.parentCategory.name}</p>
          )}
          <h3 className="font-semibold text-slate-800">{group.category.name}</h3>
        </div>
        <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {group.parts.length} part{group.parts.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {group.parts.map((part) => (
          <PartCard key={part.id} part={part} />
        ))}
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default async function VehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicleId = parseInt(id, 10);

  if (isNaN(vehicleId)) notFound();

  const detail = getCartecVehicleById(vehicleId);
  if (!detail) notFound();

  const { vehicle, model, manufacturer } = detail;
  const partGroups = getPartsByVehicleId(vehicleId);
  const totalParts = partGroups.reduce((sum, g) => sum + g.parts.length, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#0a1628] text-white">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to search
          </Link>

          <div className="flex items-start gap-4">
            {/* Manufacturer logo */}
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 p-2">
              <img
                src={`https://www.cartec.ma${manufacturer.logo}`}
                alt={manufacturer.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <p className="text-slate-400 text-sm">{manufacturer.name} · {model.shortName}</p>
              <h1 className="text-2xl font-bold mt-0.5">{vehicle.shortName}</h1>
              <p className="text-slate-300 text-sm mt-1">{vehicle.name}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs font-medium bg-emerald-900/60 text-emerald-300 px-3 py-1 rounded-full">
                  {vehicle.fuelType}
                </span>
                <span className="text-xs font-medium bg-white/10 text-slate-300 px-3 py-1 rounded-full">
                  {totalParts} parts available
                </span>
                <span className="text-xs font-medium bg-white/10 text-slate-300 px-3 py-1 rounded-full">
                  {partGroups.length} categories
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parts content */}
      <div className="container mx-auto px-4 py-8">
        {totalParts === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-700">No parts available</h2>
            <p className="text-slate-500 mt-1 text-sm">
              No parts are listed for this vehicle in our catalog yet.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm text-orange-600 hover:underline font-medium"
            >
              ← Back to search
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {partGroups.map((group) => (
              <CategorySection key={group.category.id} group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
