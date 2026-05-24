import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { logout } from '../../store/authSlice'
import { toggleTheme } from '../../store/themeSlice'
import { FiMenu, FiSun, FiMoon, FiBell, FiSearch, FiLogOut, FiHome, FiUser } from 'react-icons/fi'

export default function AdminNavbar({ toggleSidebar }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { mode } = useSelector(s => s.theme)
  const { user } = useSelector(s => s.auth)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/admin/login')
  }

  return (
    <header className="h-16 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
        >
          <FiMenu className="text-xl" />
        </button>
        
        {/* Global Search */}
        <div className="hidden md:flex relative group">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-purple-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="w-64 bg-stone-100 dark:bg-stone-900 border-none text-stone-900 dark:text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-stone-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link to="/" title="Storefront" className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors">
          <FiHome className="text-xl" />
        </Link>
        <button 
          onClick={() => dispatch(toggleTheme())} 
          className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
        >
          {mode === 'dark' ? <FiSun className="text-xl text-amber-400" /> : <FiMoon className="text-xl" />}
        </button>
        <button className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors relative">
          <FiBell className="text-xl" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#0a0a0a]"></span>
        </button>
        
        <div className="h-8 w-px bg-stone-200 dark:bg-stone-800 mx-1"></div>

        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 hover:bg-stone-50 dark:hover:bg-stone-800 p-1.5 rounded-xl transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-stone-900 dark:text-white leading-tight">{user?.name}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Administrator</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 text-white flex items-center justify-center font-bold shadow-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg shadow-black/10 border border-stone-200 dark:border-stone-800 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-stone-200 dark:border-stone-800">
                  <p className="text-sm font-medium text-stone-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <Link 
                    to="/admin/settings" 
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg transition-colors"
                  >
                    <FiUser className="text-lg" /> Profile Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <FiLogOut className="text-lg" /> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
