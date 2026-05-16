"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────
export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  start_year: number;
  end_year: string;
  engine_fuel: string;
  engine_example: string;
  transmission: string;
}

interface VehicleSearchProps {
  vehicles: Vehicle[];
}

// ─── Helpers ─────────────────────────────────────────────────
const unique = (arr: string[]) => [...new Set(arr)].sort();

const fuelLabel: Record<string, string> = {
  Petrol: "Petrol",
  Diesel: "Diesel",
};

const transLabel: Record<string, string> = {
  Manual: "Manual",
  Automatic: "Automatic",
  CVT: "CVT",
};

// ─── Chevron Icon ────────────────────────────────────────────
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

// ─── Search Icon ─────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11l3.5 3.5" />
    </svg>
  );
}

// ─── Select Wrapper ──────────────────────────────────────────
function FilterSelect({
  label,
  value,
  onChange,
  disabled,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="
            w-full appearance-none rounded-lg border border-neutral-200
            bg-white px-3 py-2.5 pr-9 text-sm text-neutral-800
            transition-colors
            hover:border-neutral-300
            focus:border-neutral-400 focus:outline-none
            disabled:cursor-not-allowed disabled:opacity-40
            dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200
            dark:hover:border-neutral-600 dark:focus:border-neutral-500
          "
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
      </div>
    </div>
  );
}

// ─── Result Tag ──────────────────────────────────────────────
function Tag({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "fuel" | "transmission" | "year";
}) {
  const styles = {
    fuel: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    transmission: "bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
    year: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  };

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────
export default function VehicleSearch({ vehicles }: VehicleSearchProps) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [results, setResults] = useState<Vehicle[] | null>(null);

  // Cascading filter options
  const brandOptions = useMemo(
    () => unique(vehicles.map((v) => v.brand)).map((b) => ({ value: b, label: b })),
    [vehicles]
  );

  const modelOptions = useMemo(() => {
    if (!brand) return [];
    return unique(vehicles.filter((v) => v.brand === brand).map((v) => v.model)).map(
      (m) => ({ value: m, label: m })
    );
  }, [vehicles, brand]);

  const yearOptions = useMemo(() => {
    if (!brand || !model) return [];
    return unique(
      vehicles
        .filter((v) => v.brand === brand && v.model === model)
        .map((v) => `${v.start_year}-${v.end_year}`)
    ).map((y) => ({ value: y, label: y }));
  }, [vehicles, brand, model]);

  const fuelOptions = useMemo(() => {
    if (!brand || !model) return [];
    let filtered = vehicles.filter((v) => v.brand === brand && v.model === model);
    if (year) {
      const [sy, ey] = year.split("-");
      filtered = filtered.filter(
        (v) => String(v.start_year) === sy && String(v.end_year) === ey
      );
    }
    return unique(filtered.map((v) => v.engine_fuel)).map((f) => ({
      value: f,
      label: fuelLabel[f] || f,
    }));
  }, [vehicles, brand, model, year]);

  const transmissionOptions = useMemo(() => {
    if (!brand || !model) return [];
    let filtered = vehicles.filter((v) => v.brand === brand && v.model === model);
    if (year) {
      const [sy, ey] = year.split("-");
      filtered = filtered.filter(
        (v) => String(v.start_year) === sy && String(v.end_year) === ey
      );
    }
    if (fuel) filtered = filtered.filter((v) => v.engine_fuel === fuel);
    return unique(filtered.map((v) => v.transmission)).map((t) => ({
      value: t,
      label: transLabel[t] || t,
    }));
  }, [vehicles, brand, model, year, fuel]);

  // Actions
  const handleBrandChange = useCallback((val: string) => {
    setBrand(val);
    setModel("");
    setYear("");
    setFuel("");
    setTransmission("");
    setResults(null);
  }, []);

  const handleModelChange = useCallback((val: string) => {
    setModel(val);
    setYear("");
    setFuel("");
    setTransmission("");
    setResults(null);
  }, []);

  const handleYearChange = useCallback((val: string) => {
    setYear(val);
    setFuel("");
    setTransmission("");
    setResults(null);
  }, []);

  const handleFuelChange = useCallback((val: string) => {
    setFuel(val);
    setTransmission("");
    setResults(null);
  }, []);

  const handleTransmissionChange = useCallback((val: string) => {
    setTransmission(val);
    setResults(null);
  }, []);

  const handleSearch = useCallback(() => {
    let filtered = vehicles;
    if (brand) filtered = filtered.filter((v) => v.brand === brand);
    if (model) filtered = filtered.filter((v) => v.model === model);
    if (year) {
      const [sy, ey] = year.split("-");
      filtered = filtered.filter(
        (v) => String(v.start_year) === sy && String(v.end_year) === ey
      );
    }
    if (fuel) filtered = filtered.filter((v) => v.engine_fuel === fuel);
    if (transmission) filtered = filtered.filter((v) => v.transmission === transmission);
    setResults(filtered);
  }, [vehicles, brand, model, year, fuel, transmission]);

  const handleReset = useCallback(() => {
    setBrand("");
    setModel("");
    setYear("");
    setFuel("");
    setTransmission("");
    setResults(null);
  }, []);

  const canSearch = brand && model;

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">
          Find your vehicle
        </h2>
        <p className="mt-0.5 text-sm text-slate-400">
          Select criteria to find compatible parts
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-5">
        <FilterSelect
          label="Brand"
          value={brand}
          onChange={handleBrandChange}
          options={brandOptions}
          placeholder="All brands"
        />
        <FilterSelect
          label="Model"
          value={model}
          onChange={handleModelChange}
          disabled={!brand}
          options={modelOptions}
          placeholder={brand ? "All models" : "Select a brand first"}
        />
        <FilterSelect
          label="Year"
          value={year}
          onChange={handleYearChange}
          disabled={!model}
          options={yearOptions}
          placeholder={model ? "All years" : "Select a model first"}
        />
        <FilterSelect
          label="Fuel type"
          value={fuel}
          onChange={handleFuelChange}
          disabled={!model}
          options={fuelOptions}
          placeholder="All"
        />
        <FilterSelect
          label="Transmission"
          value={transmission}
          onChange={handleTransmissionChange}
          disabled={!model}
          options={transmissionOptions}
          placeholder="All"
        />
      </div>

      {/* Result count bar */}
      {results !== null && (
        <div className="mb-3 flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
          <span className="text-slate-400">
            <span className="font-medium text-white">
              {results.length}
            </span>{" "}
            vehicles found
          </span>
          <button
            onClick={handleReset}
            className="text-xs font-medium text-orange-400 hover:underline"
          >
            Reset
          </button>
        </div>
      )}

      {/* Search button */}
      <button
        onClick={handleSearch}
        disabled={!canSearch}
        className="
          flex w-full items-center justify-center gap-2 rounded-lg
          bg-orange-600 px-4 py-3 text-sm font-medium text-white
          transition-all
          hover:bg-orange-700 active:scale-[0.98]
          disabled:cursor-not-allowed disabled:opacity-50
        "
      >
        <SearchIcon />
        Search
      </button>

      {/* Results */}
      {results !== null && results.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {results.slice(0, 20).map((v) => (
            <Link
              key={v.id}
              href={`/vehicles/${v.id}`}
              className="
                animate-in fade-in slide-in-from-bottom-1
                rounded-xl bg-white/5 p-4 block
                hover:bg-white/10 transition-colors cursor-pointer
              "
            >
              <h3 className="text-base font-medium text-white">
                {v.brand} {v.model}
              </h3>
              <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-400">
                <span>
                  Engine{" "}
                  <span className="font-medium text-slate-200">
                    {v.engine_example || "—"}
                  </span>
                </span>
                <span>
                  Years{" "}
                  <span className="font-medium text-slate-200">
                    {v.start_year}–{v.end_year}
                  </span>
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <Tag variant="fuel">{fuelLabel[v.engine_fuel] || v.engine_fuel}</Tag>
                <Tag variant="transmission">
                  {transLabel[v.transmission] || v.transmission}
                </Tag>
                <Tag variant="year">
                  {v.start_year}–{v.end_year}
                </Tag>
              </div>
              <p className="mt-2 text-xs text-orange-400 font-medium">View parts →</p>
            </Link>
          ))}
        </div>
      )}

      {results !== null && results.length === 0 && (
        <div className="mt-4 rounded-xl bg-white/5 p-6 text-center">
          <p className="text-sm text-slate-400">
            No vehicles match your criteria
          </p>
        </div>
      )}
    </div>
  );
}