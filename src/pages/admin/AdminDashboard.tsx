import { Link } from 'react-router-dom'
import { FiPackage, FiShoppingBag, FiAlertTriangle, FiDollarSign } from 'react-icons/fi'
import { useProducts } from '../../hooks/useProducts'
import { useAdminOrders } from '../../hooks/useOrders'
import { useLowStock } from '../../hooks/useInventory'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Badge from '../../components/ui/Badge'
import { formatCurrency, formatDate } from '../../lib/utils'

export default function AdminDashboard() {
  const { data: products } = useProducts(1, 1)
  const { data: orders } = useAdminOrders()
  const { data: lowStock } = useLowStock(5)

  const totalProducts = products?.total ?? 0
  const totalOrders = orders?.length ?? 0
  const lowStockCount = Array.isArray(lowStock) ? lowStock.length : 0
  const totalRevenue = orders?.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0) ?? 0

  const stats = [
    { icon: FiPackage, label: 'Total Products', value: totalProducts, color: 'bg-blue-500' },
    { icon: FiShoppingBag, label: 'Total Orders', value: totalOrders, color: 'bg-green-500' },
    { icon: FiAlertTriangle, label: 'Low Stock Items', value: lowStockCount, color: 'bg-orange-500' },
    { icon: FiDollarSign, label: 'Total Revenue', value: formatCurrency(totalRevenue), color: 'bg-purple-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center mb-4`}>
              <s.icon className="text-white" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Orders</h2>
          {!orders ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">#{o.id.slice(0, 8)}</span>
                  <Badge label={o.status} />
                  <span className="font-medium">{formatCurrency(o.totalAmount)}</span>
                  <span className="text-gray-400 text-xs">{formatDate(o.createdAt)}</span>
                </div>
              ))}
              <Link to="/admin/orders" className="block text-center text-sm text-indigo-600 hover:text-indigo-800 mt-3 font-medium">
                View All Orders
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Low Stock Alerts</h2>
          {!lowStock ? (
            <LoadingSpinner />
          ) : lowStockCount === 0 ? (
            <p className="text-gray-500 text-sm">All products are well stocked</p>
          ) : (
            <div className="space-y-3">
              {(Array.isArray(lowStock) ? lowStock : []).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{p.name}</span>
                  <span className="text-red-600 font-medium">{p.stock} left</span>
                </div>
              ))}
              <Link to="/admin/inventory" className="block text-center text-sm text-indigo-600 hover:text-indigo-800 mt-3 font-medium">
                Manage Inventory
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
