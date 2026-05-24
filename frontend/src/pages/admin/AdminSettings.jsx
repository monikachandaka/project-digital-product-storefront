import { useState } from 'react'
import { FiSave, FiShield, FiGlobe, FiDatabase } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const [loading, setLoading] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Settings updated successfully')
    }, 1000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Platform Settings</h1>
        <p className="text-sm text-stone-500 mt-1">Configure global application parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-medium transition-colors text-left">
            <FiGlobe /> General
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg text-sm font-medium transition-colors text-left">
            <FiShield /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg text-sm font-medium transition-colors text-left">
            <FiDatabase /> Backups
          </button>
        </div>

        {/* Settings Form Content */}
        <div className="md:col-span-3 bg-white dark:bg-[#111] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4 border-b border-stone-200 dark:border-stone-800 pb-2">Site Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Platform Name</label>
                  <input type="text" defaultValue="DigitalVault" className="w-full bg-stone-50 dark:bg-[#0a0a0a] border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Support Email</label>
                  <input type="email" defaultValue="support@digitalvault.com" className="w-full bg-stone-50 dark:bg-[#0a0a0a] border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                </div>
                <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-200 dark:border-stone-800">
                  <div>
                    <h4 className="font-medium text-stone-900 dark:text-white text-sm">Maintenance Mode</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Temporarily disable public access to the platform.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4 border-b border-stone-200 dark:border-stone-800 pb-2">Admin Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Admin Email</label>
                  <input type="email" defaultValue="monika@gmail.com" disabled className="w-full bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 text-stone-500 rounded-lg px-4 py-2 text-sm cursor-not-allowed" />
                  <p className="text-xs text-stone-500 mt-1">Master admin email cannot be changed.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-stone-50 dark:bg-[#0a0a0a] border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-purple-500/20 active:scale-95"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiSave />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
