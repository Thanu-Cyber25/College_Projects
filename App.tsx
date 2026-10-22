import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toast'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ThemeProvider } from './contexts/ThemeContext'
import HomePage from './pages/HomePage'
import CataloguePage from './pages/CataloguePage'
import BookDetailPage from './pages/BookDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import CustomerLoginPage from './pages/CustomerLoginPage'
import CustomerRegisterPage from './pages/CustomerRegisterPage'
import CustomerDashboardPage from './pages/CustomerDashboardPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage'
import AdminBooksPage from './pages/admin/AdminBooksPage'
import AdminCustomersPage from './pages/admin/AdminCustomersPage'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogue" element={<CataloguePage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/login" element={<CustomerLoginPage />} />
              <Route path="/register" element={<CustomerRegisterPage />} />
              <Route path="/account" element={<CustomerDashboardPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/orders/:orderId" element={<AdminOrderDetailPage />} />
              <Route path="/admin/books" element={<AdminBooksPage />} />
              <Route path="/admin/customers" element={<AdminCustomersPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
