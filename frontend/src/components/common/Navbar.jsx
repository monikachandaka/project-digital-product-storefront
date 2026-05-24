import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/authSlice'
import { toggleTheme } from '../../store/themeSlice'
import {
  FiSun, FiMoon, FiShoppingCart, FiHeart, FiUser,
  FiLogOut, FiMenu, FiX, FiPackage, FiSettings
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector(s => s.auth)
  const { mode } = useSelector(s => s.theme)
  const { totalItems } = useSelector(s => s.cart)
  const { items: wishlistItems } = useSelector(s => s.wishlist)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/')
    setUserMenuOpen(false)
  }

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'Contact', to: '/contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-[#0F172A]/80 backdrop-blur-xl border-b border-stone-800/50 shadow-sm transition-colors duration-500">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-white group">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white text-sm font-mono font-bold shadow-[0_0_15px_rgba(14,165,233,0.5)] group-hover:shadow-[0_0_25px_rgba(14,165,233,0.8)] transition-all duration-300 relative overflow-hidden">
              <span className="relative z-10">DV</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-600 to-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="hidden sm:block tracking-tight">DigitalVault</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className="relative px-4 py-2 text-sm font-bold text-stone-300 hover:text-brand-400 transition-colors group">
                {l.label}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-brand-400 group-hover:w-3/4 transition-all duration-300 rounded-full opacity-0 group-hover:opacity-100"></span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Animated Theme Toggle */}
            <button 
              onClick={() => dispatch(toggleTheme())} 
              className="relative w-16 h-8 rounded-full bg-stone-200 dark:bg-stone-800 p-1 flex items-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              aria-label="Toggle theme"
            >
              <div className="flex w-full justify-between px-1.5 z-0 text-[10px]">
                <FiMoon className="w-3.5 h-3.5 text-stone-400" />
                <FiSun className="w-3.5 h-3.5 text-stone-400" />
              </div>
              <motion.div 
                className="absolute w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center z-10"
                initial={false}
                animate={{
                  left: mode === 'dark' ? '4px' : '36px',
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {mode === 'dark' ? <FiMoon className="w-3.5 h-3.5 text-stone-800" /> : <FiSun className="w-3.5 h-3.5 text-amber-500" />}
              </motion.div>
            </button>

            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <Link to="/wishlist" className="relative btn-ghost text-stone-300 hover:text-white hover:bg-white/10 p-2 rounded-lg">
                  <FiHeart className="w-5 h-5" />
                  {wishlistItems.length > 0 && (
                     <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-mono">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link to="/cart" className="relative btn-ghost text-stone-300 hover:text-white hover:bg-white/10 p-2 rounded-lg">
                  <FiShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-xs rounded-full flex items-center justify-center font-mono">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 btn-ghost text-stone-300 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2">
                    <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold uppercase">
                      {user?.name?.[0] || 'U'}
                    </div>
                    <span className="hidden md:block text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-stone-900 border border-stone-800 rounded-xl shadow-xl py-1 z-50 animate-scale-in">
                      <div className="px-4 py-2 border-b border-stone-800">
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-stone-400 truncate">{user?.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-stone-300 hover:bg-stone-800">
                        <FiUser className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-stone-300 hover:bg-stone-800">
                        <FiPackage className="w-4 h-4" /> My Orders
                      </Link>
                      {user?.role === 'creator' && (
                        <Link to="/creator/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-brand-400 hover:bg-brand-900/30">
                          <FiSettings className="w-4 h-4" /> Creator Dashboard
                        </Link>
                      )}
                      {user?.role === 'admin' && (
                        <Link to="/admin/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-purple-400 hover:bg-purple-900/30">
                          <FiSettings className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-stone-800 mt-1">
                        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-900/20">
                          <FiLogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/admin/login" className="text-sm font-medium text-white hover:text-stone-300 mr-2 transition-colors">Admin</Link>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-white border border-stone-700 hover:border-stone-500 rounded-lg transition-colors">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 shadow-[0_0_15px_rgba(139,92,246,0.3)]">Get Started</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden btn-ghost text-stone-300 hover:text-white hover:bg-white/10 p-2">
              {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-stone-800 py-3 space-y-1 animate-slide-up bg-stone-950">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm font-medium text-stone-300 hover:text-white hover:bg-white/10 rounded-lg">
                {l.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 pt-2 px-4">
                <Link to="/admin/login" onClick={() => setMobileOpen(false)} className="text-sm text-center font-medium text-white hover:text-stone-300 py-2">Admin Access</Link>
                <div className="flex gap-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-sm flex-1 text-center">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm flex-1 text-center">Register</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay for user menu */}
      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
    </nav>
  )
}
