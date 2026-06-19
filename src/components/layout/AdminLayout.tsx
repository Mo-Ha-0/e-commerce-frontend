import { NavLink, Outlet } from 'react-router-dom'
import {
  FiGrid, FiPackage, FiShoppingBag, FiClipboard, FiTag, FiDollarSign, FiLogOut,
} from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

const links = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: FiPackage, label: 'Products' },
  { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/admin/inventory', icon: FiClipboard, label: 'Inventory' },
  { to: '/admin/discounts', icon: FiTag, label: 'Discounts' },
  { to: '/admin/wallet', icon: FiDollarSign, label: 'Wallet' },
]

export default function AdminLayout() {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col">
        <div className="p-6">
          <h1 className="text-lg font-bold text-white">Admin Panel</h1>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <FiLogOut size={18} />
            Back to Store
          </NavLink>
        </div>
      </aside>

      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
