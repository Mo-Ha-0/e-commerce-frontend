import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';

const features = [
    { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over $50' },
    { icon: FiShield, title: 'Secure Payment', desc: '100% secure checkout' },
    { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
];

export default function Home() {
    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                    <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                        Welcome to ShopEase
                    </h1>
                    <p className="text-lg sm:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                        Discover amazing products at unbeatable prices. Fast
                        shipping, secure payments, and hassle-free returns.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                        >
                            Shop Now
                            <FiArrowRight />
                        </Link>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid sm:grid-cols-3 gap-8">
                        {features.map((f) => (
                            <div key={f.title} className="text-center p-6">
                                <f.icon
                                    className="mx-auto text-indigo-600 mb-4"
                                    size={32}
                                />
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {f.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
