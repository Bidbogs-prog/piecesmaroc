

export default function Categories() {
    return (
        <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Explore Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Example Category Card */}
            <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
                <img src="/images/engine.jpg" alt="Engine Parts" className="w-full h-40 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold mb-2">Engine Parts</h3>
                <p className="text-gray-600 text-center">Find a wide range of engine components for various makes and models.</p>
            </div>
            </div>
        </div>
        </section>
    );
}