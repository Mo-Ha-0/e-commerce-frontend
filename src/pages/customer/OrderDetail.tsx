import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft, FiDownload } from 'react-icons/fi'
import { useOrder } from '../../hooks/useOrders'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import api from '../../api/axios'
import { ENDPOINTS } from '../../api/endpoints'
import { formatCurrency, formatDate } from '../../lib/utils'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
}

const paymentColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading } = useOrder(id!)

  if (isLoading) return <LoadingSpinner />
  if (!order) return <p className="text-center mt-10 text-gray-500">Order not found</p>

  const handleDownloadInvoice = () => {
    const token = localStorage.getItem('token')
    window.open(
      `${import.meta.env.VITE_API_URL}${ENDPOINTS.ORDERS}/${order.id}/invoice`,
      '_blank',
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6">
        <FiArrowLeft /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h1>
        <div className="flex gap-2">
          <Badge label={order.status} color={statusColors[order.status]} />
          <Badge label={order.paymentStatus} color={paymentColors[order.paymentStatus]} />
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-8">Placed on {formatDate(order.createdAt)}</p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Items</h2>

        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-sm shrink-0">
                {item.product.name[0]}
              </div>
              <div>
                <Link to={`/products/${item.productId}`} className="text-gray-900 hover:text-indigo-600 font-medium">
                  {item.product.name}
                </Link>
                <p className="text-gray-500">Qty: {item.quantity} x {formatCurrency(item.priceAtTime)}</p>
              </div>
            </div>
            <span className="font-medium text-gray-900">
              {formatCurrency(parseFloat(item.priceAtTime) * item.quantity)}
            </span>
          </div>
        ))}

        <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-indigo-600">{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      {order.invoicePdfPath && (
        <Button onClick={handleDownloadInvoice} variant="secondary" className="mt-4">
          <FiDownload /> Download Invoice
        </Button>
      )}
    </div>
  )
}
