import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-[#0a1628] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Have a question, a suggestion, or need support? We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-14 max-w-3xl">
        <div className="space-y-10">
          {/* Contact methods */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Get in Touch</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: '📧', title: 'Email', desc: 'contact@piecesmaroc.ma' },
                { icon: '📞', title: 'Phone', desc: '+212 5XX-XXXXXX' },
                { icon: '📍', title: 'Location', desc: 'Casablanca, Morocco' },
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
            <p className="text-orange-700 font-medium">🚧 Contact form coming soon</p>
            <p className="text-sm text-orange-600 mt-1">
              We're still building out this section. In the meantime, reach us by email.
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
