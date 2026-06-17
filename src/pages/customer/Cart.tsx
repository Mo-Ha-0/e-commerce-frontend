import { Link } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
} from "../../hooks/useCart";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import { formatCurrency } from "../../lib/utils";

export default function Cart() {
  const { data, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  if (isLoading) return <LoadingSpinner />;

  const cartItems = data?.items ?? [];
  const total = data?.total ?? 0;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState message="Your cart is empty" />
        <Link
          to="/products"
          className="block text-center mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-xl text-gray-300">
                {item.product.name[0]}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <Link
                to={`/products/${item.productId}`}
                className="font-medium text-gray-900 hover:text-indigo-600 truncate block"
              >
                {item.product.name}
              </Link>
              <p className="text-sm text-indigo-600 font-medium mt-1">
                {formatCurrency(item.product.price)}
              </p>
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() =>
                  updateItem.mutate({
                    productId: item.productId,
                    dto: { quantity: Math.max(1, item.quantity - 1) },
                  })
                }
                className="px-2 py-1.5 hover:bg-gray-50"
              >
                <FiMinus size={14} />
              </button>
              <span className="px-3 py-1.5 text-sm font-medium border-x border-gray-300 min-w-[36px] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  updateItem.mutate({
                    productId: item.productId,
                    dto: { quantity: item.quantity + 1 },
                  })
                }
                className="px-2 py-1.5 hover:bg-gray-50"
              >
                <FiPlus size={14} />
              </button>
            </div>

            <p className="text-sm font-semibold text-gray-900 w-20 text-right">
              {formatCurrency(parseFloat(item.product.price) * item.quantity)}
            </p>

            <button
              onClick={() => removeItem.mutate(item.productId)}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between text-lg">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-indigo-600">
            {formatCurrency(total)}
          </span>
        </div>

        <Link to="/checkout">
          <Button className="w-full mt-4" size="lg">
            <FiShoppingBag /> Proceed to Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}
