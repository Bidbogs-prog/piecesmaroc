import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-[#0a1628] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">About PiecesMaroc</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Morocco's trusted marketplace for quality auto parts — new, refurbished, and used.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-14 max-w-3xl">
        <div className="space-y-10">
          {/* Mission */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              PiecesMaroc connects car owners and mechanics across Morocco with verified suppliers
              offering a wide range of auto parts. Whether you need an OEM component or a
              cost-effective aftermarket alternative, we make finding the right part simple and fast.
            </p>
          </section>

          {/* Why us */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Why PiecesMaroc?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: '🔍', title: 'Smart Search', desc: 'Find parts by vehicle make, model, year, and fuel type.' },
                { icon: '✅', title: 'Verified Suppliers', desc: 'Every supplier is reviewed before listing on our platform.' },
                { icon: '🚗', title: '32 000+ Vehicles', desc: 'Full Cartec catalog coverage for cars sold in Morocco.' },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Coming soon notice */}
          <section className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
            <p className="text-orange-700 font-medium">🚧 Full page coming soon</p>
            <p className="text-sm text-orange-600 mt-1">
              We're still building out this section. Check back shortly.
            </p>
          </section>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
