'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Car, Shield, Truck, ChevronRight } from 'lucide-react';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden p-4 sm:p-6 lg:p-12">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-[#0a1628]">
        {/* Gradient orbs for depth */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl" />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Serving Casablanca & Beyond
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-6 leading-tight">
            <span className="text-white">Quality Auto Parts.</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Better Prices.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-center text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Morocco's trusted marketplace for used, refurbished, and aftermarket auto parts. 
            Find what you need from verified suppliers.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <div className="flex bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
                <div className="flex-1 flex items-center px-5">
                  <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by part name, car make, or model..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-5 text-slate-800 text-lg placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-5 font-semibold text-lg transition-all flex items-center gap-2 group"
                >
                  Search
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="flex flex-wrap gap-2 justify-center mb-16">
            <span className="text-slate-500 text-sm py-2">Popular:</span>
            {['Toyota Corolla', 'Renault Clio', 'Dacia Logan', 'Brake Pads', 'Oil Filter', 'Alternator'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setSearchQuery(item);
                  router.push(`/products?search=${encodeURIComponent(item)}`);
                }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2 rounded-full text-sm text-slate-300 hover:text-white transition-all"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Car className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">2,500+</div>
                <div className="text-slate-400 text-sm">Parts Listed</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-slate-400 text-sm">Verified Sellers</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">24h</div>
                <div className="text-slate-400 text-sm">Fast Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a1628] to-transparent" />
    </section>
  );
}