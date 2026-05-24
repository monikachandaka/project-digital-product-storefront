import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/authSlice'
import { 
  FiHome, FiUsers, FiShoppingBag, FiBox, FiList, 
  FiPieChart, FiMessageSquare, FiFileText, FiBell, FiSettings, FiActivity, FiTag, FiLogOut 
} from 'react-icons/fi'

const MENU_ITEMS = [
  { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
  { path: '/admin/creators', icon: FiUsers, label: 'Creators' },
  { path: '/admin/buyers', icon: FiShoppingBag, label: 'Buyers' },
  { path: '/admin/products', icon: FiBox, label: 'Products' },
  { path: '/admin/orders', icon: FiList, label: 'Orders' },
  { path: '/admin/coupons', icon: FiTag, label: 'Coupons' },
  { path: '/admin/categories', icon: FiPieChart, label: 'Categories' },
  { path: '/admin/analytics', icon: FiActivity, label: 'Analytics' },
  { path: '/admin/reviews', icon: FiMessageSquare, label: 'Reviews' },
  { path: '/admin/reports', icon: FiFileText, label: 'Reports' },
  { path: '/admin/notifications', icon: FiBell, label: 'Notifications' },
  { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
]

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/admin/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-white dark:bg-[#0a0a0a] border-r border-stone-200 dark:border-stone-800 
        flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo area */}
        <div className="h-16 flex items-center px-6 border-b border-stone-200 dark:border-stone-800 shrink-0">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-stone-900 dark:text-white">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-mono font-bold shadow-sm shadow-purple-500/20">DV</div>
            <span>Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) setIsOpen(false)
              }}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200'
                }
              `}
            >
              <item.icon className="text-lg" />
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Logout area */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-500/10 transition-colors"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
