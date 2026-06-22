"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Make, Model, Vehicle } from "@/types/database";

export default function VehicleSelector({ variant = "light" }: { variant?: "light" | "dark" }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [makeId, setMakeId] = useState("");
  const [modelId, setModelId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [loading, setLoading] = useState<"models" | "vehicles" | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("makes")
      .select("*")
      .order("name")
      .then(({ data }) => setMakes((data as Make[]) ?? []));
  }, [supabase]);

  async function onMake(value: string) {
    setMakeId(value);
    setModelId("");
    setVehicleId("");
    setModels([]);
    setVehicles([]);
    if (!supabase) return;
    setLoading("models");
    const { data } = await supabase
      .from("models")
      .select("*")
      .eq("make_id", Number(value))
      .order("short_name");
    setModels((data as Model[]) ?? []);
    setLoading(null);
  }

  async function onModel(value: string) {
    setModelId(value);
    setVehicleId("");
    setVehicles([]);
    if (!supabase) return;
    setLoading("vehicles");
    const { data } = await supabase
      .from("vehicles")
      .select("*")
      .eq("model_id", Number(value))
      .order("year_from", { ascending: false });
    setVehicles((data as Vehicle[]) ?? []);
    setLoading(null);
  }

  function onSearch() {
    if (!makeId) return;
    const params = new URLSearchParams();
    if (vehicleId) params.set("vehicle", vehicleId);
    else if (modelId) params.set("model", modelId);
    if (makeId) params.set("make", makeId);
    router.push(`/products?${params.toString()}`);
  }

  const labelCls =
    variant === "dark"
      ? "text-[11px] font-semibold uppercase tracking-wider text-white/60"
      : "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Make</label>
        <Select value={makeId} onValueChange={onMake}>
          <SelectTrigger className="h-12 bg-white text-foreground">
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {makes.map((m) => (
              <SelectItem key={m.id} value={String(m.id)}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Model</label>
        <Select value={modelId} onValueChange={onModel} disabled={!makeId || loading === "models"}>
          <SelectTrigger className="h-12 bg-white text-foreground">
            <SelectValue placeholder={loading === "models" ? "Loading…" : "Select model"} />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {models.map((m) => (
              <SelectItem key={m.id} value={String(m.id)}>
                {m.short_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Engine / Year</label>
        <Select value={vehicleId} onValueChange={setVehicleId} disabled={!modelId || loading === "vehicles"}>
          <SelectTrigger className="h-12 bg-white text-foreground">
            <SelectValue placeholder={loading === "vehicles" ? "Loading…" : "All engines"} />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {vehicles.map((v) => (
              <SelectItem key={v.id} value={String(v.id)}>
                {v.short_name} · {v.fuel_type}
                {v.year_from ? ` (${v.year_from}${v.year_to ? `–${v.year_to}` : "+"})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onSearch} disabled={!makeId} size="lg" className="h-12 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 lg:px-8">
        {loading ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />}
        Find parts
      </Button>
    </div>
  );
}
