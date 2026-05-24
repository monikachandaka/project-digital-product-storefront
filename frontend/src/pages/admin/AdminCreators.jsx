import { useState, useEffect } from 'react'
import { FiMoreVertical, FiSearch, FiFilter } from 'react-icons/fi'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminCreators() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCreators()
  }, [])

  const fetchCreators = async () => {
    try {
      const res = await api.get('/admin/creators')
      setCreators(res.data)
    } catch (err) {
      toast.error('Failed to load creators')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/admin/users/${id}/status`, { status })
      toast.success(`Creator status updated`)
      // Optimistic update
      setCreators(creators.map(c => c._id === id ? { ...c, status } : c))
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading creators...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Creators Management</h1>
          <p className="text-sm text-stone-500 mt-1">View and manage all creator accounts.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search creators..." 
              className="w-full bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <button className="p-2 bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900">
            <FiFilter />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-50 dark:bg-[#1a1a1a] border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Creator</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold">Products</th>
                <th className="px-6 py-4 font-semibold">Total Earnings</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
              {creators.map(creator => (
                <tr key={creator._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                        {creator.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900 dark:text-white">{creator.name}</div>
                        <div className="text-xs text-stone-500">{creator.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{creator.joined}</td>
                  <td className="px-6 py-4">{creator.productsCount}</td>
                  <td className="px-6 py-4 font-semibold">${creator.totalEarnings.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      creator.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                    }`}>
                      {creator.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {creator.status === 'active' ? (
                        <button onClick={() => handleStatusChange(creator._id, 'blocked')} className="text-xs px-3 py-1.5 rounded bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                          Block
                        </button>
                      ) : (
                        <button onClick={() => handleStatusChange(creator._id, 'active')} className="text-xs px-3 py-1.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
                          Unblock
                        </button>
                      )}
                      <button className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                        <FiMoreVertical />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
