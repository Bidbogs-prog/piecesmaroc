import { supabase } from '@/lib/supabase/client';
import type { Vehicle } from '@/components/VehicleSearchComponent';

export async function getVehicles() {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('brand');

  if (error) throw error;
  console.log(data);
  return data as Vehicle[];
  
}



