import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { useProduct } from '../../hooks/useProducts';
import { useAddCartItem } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../lib/utils';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const { data: product, isLoading } = useProduct(id!);
    const addItem = useAddCartItem();
    const { user } = useAuth();
    const [quantity, setQuantity] = useState(1);

    if (isLoading) return <LoadingSpinner />;
    if (!product)
        return (
            <p className="text-center mt-10 text-gray-500">Product not found</p>
        );

    const handleAddToCart = () => {
        if (!user) return;
        addItem.mutate({ productId: product.id, quantity });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
                to="/products"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6"
            >
                <FiArrowLeft /> Back to Products
            </Link>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-8xl text-gray-300">
                        {product.name[0]}
                    </span>
                </div>

                <div>
                    <Badge
                        label={product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        color={
                            product.stock > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }
                    />
                    <h1 className="text-3xl font-bold text-gray-900 mt-3">
                        {product.name}
                    </h1>
                    <p className="text-3xl font-bold text-indigo-600 mt-4">
                        Price: {formatCurrency(product.price)}
                    </p>
                    <p className="text-1xl text-gray-900 mt-4">
                        Stock: {product.stock}
                    </p>
                    <p className="text-gray-600 mt-2 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">
                                Quantity:
                            </span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                    className="px-3 py-2 hover:bg-gray-50 transition-colors"
                                >
                                    <FiMinus size={16} />
                                </button>
                                <input
                                    type="number"
                                    min={1}
                                    max={product.stock}
                                    value={quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value, 10);
                                        if (isNaN(val) || val < 1) {
                                            setQuantity(1);
                                        } else if (val > product.stock) {
                                            setQuantity(product.stock);
                                        } else {
                                            setQuantity(val);
                                        }
                                    }}
                                    className="w-16 px-2 py-2 text-sm font-medium text-center border-x border-gray-300 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity(
                                            Math.min(
                                                product.stock,
                                                quantity + 1,
                                            ),
                                        )
                                    }
                                    className="px-3 py-2 hover:bg-gray-50 transition-colors"
                                >
                                    <FiPlus size={16} />
                                </button>
                            </div>
                        </div>

                        {user ? (
                            <Button
                                onClick={handleAddToCart}
                                loading={addItem.isPending}
                                disabled={product.stock === 0}
                                className="w-full"
                            >
                                <FiShoppingCart /> Add to Cart
                            </Button>
                        ) : (
                            <Link
                                to="/login"
                                className="block text-center w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                            >
                                Login to Purchase
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
