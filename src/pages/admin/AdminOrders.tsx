import { useAdminOrders } from '../../hooks/useOrders';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../lib/utils';
import type { Order } from '../../types';

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
};

export default function AdminOrders() {
    const { data: orders, isLoading } = useAdminOrders();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

            {isLoading ? (
                <LoadingSpinner />
            ) : !orders || orders.length === 0 ? (
                <EmptyState message="No orders yet" />
            ) : (
                <Table
                    columns={[
                        {
                            key: 'id',
                            header: 'Order ID',
                            render: (o: Order) => `#${o.id.slice(0, 8)}`,
                        },
                        {
                            key: 'items',
                            header: 'Items',
                            render: (o: Order) => o.items.length,
                        },
                        {
                            key: 'total',
                            header: 'Total',
                            render: (o: Order) => formatCurrency(o.totalAmount),
                        },
                        {
                            key: 'status',
                            header: 'Status',
                            render: (o: Order) => (
                                <Badge
                                    label={o.status}
                                    color={statusColors[o.status]}
                                />
                            ),
                        },
                        {
                            key: 'payment',
                            header: 'Payment',
                            render: (o: Order) => (
                                <Badge label={o.paymentStatus} />
                            ),
                        },
                        {
                            key: 'date',
                            header: 'Date',
                            render: (o: Order) => formatDate(o.createdAt),
                        },
                    ]}
                    data={orders}
                />
            )}
        </div>
    );
}
