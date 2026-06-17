import { data, Link } from "react-router-dom";
import { useOrders } from "../../hooks/useOrders";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";
import { formatCurrency, formatDate } from "../../lib/utils";
import type { Order } from "../../types";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

export default function Orders() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) return <LoadingSpinner />;

  const list = orders ?? [];

  if (list.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState message="No orders yet" />
        <Link
          to="/products"
          className="block text-center mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

      <div className="space-y-4">
        {list.map((order: Order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">
                {formatDate(order.createdAt)}
              </span>
              <Badge label={order.status} color={statusColors[order.status]} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </span>
              <span className="font-bold text-indigo-600">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
