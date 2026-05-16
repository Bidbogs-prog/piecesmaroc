import { getCartecVehicles } from '@/lib/db/cartec';
import type { Vehicle } from '@/components/VehicleSearchComponent';

export async function getVehicles(): Promise<Vehicle[]> {
  return getCartecVehicles();
}
