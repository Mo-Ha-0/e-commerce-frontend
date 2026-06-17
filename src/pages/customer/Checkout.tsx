import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiCheck } from 'react-icons/fi'
import { useCart } from '../../hooks/useCart'
import { useCheckout } from '../../hooks/useOrders'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import { formatCurrency } from '../../lib/utils'

export default function Checkout() {
  const { data, isLoading: cartLoading } = useCart()
  const checkout = useCheckout()
  const navigate = useNavigate()

  if (cartLoading) return <LoadingSpinner />

  const cartItems = data?.items ?? []

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState message="Your cart is empty" />
      </div>
    )
  }

  const subtotal = data?.total ?? cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0,
  )

  const handleCheckout = () => {
    checkout.mutate(undefined, {
      onSuccess: () => navigate('/orders'),
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/cart')}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6"
      >
        <FiArrowLeft /> Back to Cart
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
        <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.product.name} <span className="text-gray-400">x{item.quantity}</span>
            </span>
            <span className="font-medium text-gray-900">
              {formatCurrency(parseFloat(item.product.price) * item.quantity)}
            </span>
          </div>
        ))}

        <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold">
          <span>Total</span>
          <span className="text-indigo-600">{formatCurrency(subtotal)}</span>
        </div>
      </div>

      <Button
        onClick={handleCheckout}
        loading={checkout.isPending}
        className="w-full mt-6"
        size="lg"
      >
        <FiCheck /> Place Order
      </Button>
    </div>
  )
}
