import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Fuel, Calendar, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getVehicleById, getModelById, getMakeById } from "@/lib/db/catalog";
import { getProducts } from "@/lib/db/products";

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicleId = parseInt(id, 10);
  if (Number.isNaN(vehicleId)) notFound();

  const vehicle = await getVehicleById(vehicleId).catch(() => null);
  if (!vehicle) notFound();

  const [model, result] = await Promise.all([
    getModelById(vehicle.model_id).catch(() => null),
    getProducts({ vehicleId, pageSize: 24 }).catch(() => null),
  ]);
  const make = model ? await getMakeById(model.make_id).catch(() => null) : null;

  return (
    <div>
      {/* header */}
      <div className="bg-navy text-white">
        <div className="container mx-auto px-4 py-8">
          <Link href="/products" className="text-sm text-white/60 hover:text-white">
            ← All parts
          </Link>
          <div className="mt-4 flex items-center gap-4">
            {make?.logo_url && (
              <div className="grid size-16 place-items-center rounded-xl bg-white/10 p-2">
                <Image src={make.logo_url} alt={make.name} width={48} height={48} className="size-12 object-contain" />
              </div>
            )}
            <div>
              <p className="text-sm text-white/60">
                {make?.name} {model?.short_name && `· ${model.short_name}`}
              </p>
              <h1 className="text-2xl font-bold sm:text-3xl">{vehicle.short_name}</h1>
              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                {vehicle.fuel_type && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                    <Fuel className="size-3.5" /> {vehicle.fuel_type}
                  </span>
                )}
                {vehicle.year_from && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                    <Calendar className="size-3.5" /> {vehicle.year_from}
                    {vehicle.year_to ? `–${vehicle.year_to}` : "+"}
                  </span>
                )}
                <span className="rounded-full bg-accent/20 px-3 py-1 text-accent">
                  {result?.count ?? 0} parts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* parts */}
      <div className="container mx-auto px-4 py-10">
        {!result || result.rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
            <h2 className="text-lg font-semibold">No parts listed for this vehicle yet</h2>
            <Link href="/products" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
              Browse the full catalog
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Compatible parts</h2>
              {make && (
                <Link
                  href={`/products?vehicle=${vehicle.id}&make=${make.id}`}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View all <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {result.rows.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
