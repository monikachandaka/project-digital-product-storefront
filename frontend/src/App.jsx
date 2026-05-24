import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { loadUser } from './store/authSlice'
import { setTheme } from './store/themeSlice'
import { fetchCart } from './store/cartSlice'
import { fetchWishlist } from './store/wishlistSlice'

// Layout
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

// Pages
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'
import CreatorDashboard from './pages/creator/CreatorDashboard'
import DownloadPage from './pages/DownloadPage'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCreators from './pages/admin/AdminCreators'
import AdminBuyers from './pages/admin/AdminBuyers'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCategories from './pages/admin/AdminCategories'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminReviews from './pages/admin/AdminReviews'
import AdminReports from './pages/admin/AdminReports'
import AdminNotifications from './pages/admin/AdminNotifications'
import AdminSettings from './pages/admin/AdminSettings'
import AdminCoupons from './pages/admin/AdminCoupons'

// Guards
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(s => s.auth)
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
  return isAuthenticated ? children : <Navigate to="/login" />
}



const GuestRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(s => s.auth)
  if (isAuthenticated && user?.role === 'admin') return <Navigate to="/admin/dashboard" />
  return isAuthenticated ? <Navigate to="/" /> : children
}

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useSelector(s => s.auth)
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/admin/login" />
}

import PromoBanner from './components/common/PromoBanner'

const StoreLayout = () => {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark">
      <Navbar />
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch()
  const { token, isAuthenticated } = useSelector(s => s.auth)
  const { mode } = useSelector(s => s.theme)

  useEffect(() => {
    dispatch(setTheme(mode))
  }, [mode, dispatch])

  useEffect(() => {
    if (token) dispatch(loadUser())
  }, [token, dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart())
      dispatch(fetchWishlist())
    }
  }, [isAuthenticated, dispatch])

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Admin Login (No Layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected Routes (Admin Layout) */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="creators" element={<AdminCreators />} />
          <Route path="buyers" element={<AdminBuyers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="coupons" element={<AdminCoupons />} />
        </Route>

        {/* Public Store Routes (Store Layout) */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
          <Route path="/reset-password/:token" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />

          <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
          <Route path="/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
          <Route path="/order-success" element={<PrivateRoute><OrderSuccessPage /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrderHistoryPage /></PrivateRoute>} />
          <Route path="/orders/:orderId/download/:productId" element={<PrivateRoute><DownloadPage /></PrivateRoute>} />

          <Route path="/creator/dashboard" element={<PrivateRoute><CreatorDashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
          }}
        />
    </Router>
  )
}
