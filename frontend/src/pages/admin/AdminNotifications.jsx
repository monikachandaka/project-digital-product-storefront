import { useState, useEffect } from 'react'
import { FiBell, FiUserPlus, FiAlertCircle, FiCheckCircle, FiDollarSign } from 'react-icons/fi'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/admin/notifications')
      setNotifications(res.data)
    } catch (err) {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const icons = {
    'FiUserPlus': FiUserPlus,
    'FiDollarSign': FiDollarSign,
    'FiAlertCircle': FiAlertCircle,
    'FiCheckCircle': FiCheckCircle
  }

  if (loading) return <div className="p-8 text-center">Loading notifications...</div>

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-stone-500 mt-1">Recent system alerts and activity logs.</p>
        </div>
        <button className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-stone-500">No notifications found.</div>
        ) : (
          notifications.map(note => {
            const IconComponent = icons[note.iconName] || FiBell
            return (
              <div key={note.id} className="bg-white dark:bg-[#111] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-start gap-4 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors cursor-pointer">
                <div className={`w-12 h-12 rounded-full ${note.bg} flex items-center justify-center shrink-0`}>
                  <IconComponent className={`text-xl ${note.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-stone-900 dark:text-white">{note.title}</h4>
                    <span className="text-xs text-stone-400 whitespace-nowrap ml-4">{note.time}</span>
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-400">{note.desc}</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
