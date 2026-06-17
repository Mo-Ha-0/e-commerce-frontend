import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'

import Home from './pages/public/Home'
import Products from './pages/public/Products'
import ProductDetail from './pages/public/ProductDetail'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import Orders from './pages/customer/Orders'
import OrderDetail from './pages/customer/OrderDetail'
import Wallet from './pages/customer/Wallet'

export default function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/wallet" element={<Wallet />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          {/* admin layout + pages will go here */}
        </Route>
      </Routes>
    </>
  )
}
