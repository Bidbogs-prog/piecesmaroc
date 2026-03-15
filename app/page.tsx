import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Categories from '@/components/Categories';
import HowItWorks from '@/components/HowItWorks';
import VehicleSearch from '@/components/VehicleSearchComponent';
import { getVehicles } from '@/lib/db/vehicles';

export default async function Home() {
  let vehicles: import('@/components/VehicleSearchComponent').Vehicle[] = [];

  try {
    vehicles = await getVehicles();
  } catch (error) {
    console.error('Error fetching vehicles:', error);
  }

  console.log(vehicles);
  

  return (
    <div>
      <Hero />
      <section className="py-16 bg-[#0a1628] border-t border-slate-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Search by Vehicle</h2>
            <p className="text-slate-400">Find parts compatible with your car</p>
          </div>
          <div className="flex justify-center">
            <VehicleSearch vehicles={vehicles} />
          </div>
        </div>
      </section>
      <Categories />
      <FeaturedProducts />
      <HowItWorks />
    </div>
  );
}
