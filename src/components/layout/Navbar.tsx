import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-xl font-bold text-indigo-600">
                        ShopEase
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link
                            to="/products"
                            className="text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            Products
                        </Link>

                        {user && (
                            <Link
                                to="/orders"
                                className="text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                                <FiPackage size={20} />
                            </Link>
                        )}

                        <Link
                            to="/cart"
                            className="text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            <FiShoppingCart size={20} />
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-3">
                                {(user.role === UserRole.Admin ||
                                    user.role === UserRole.SuperAdmin) && (
                                    <Link
                                        to="/admin"
                                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <span className="text-sm text-gray-500">
                                    {user.email}
                                </span>
                                <button
                                    onClick={logout}
                                    className="text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    <FiLogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                                <FiUser size={20} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
