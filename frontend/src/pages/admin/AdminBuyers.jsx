import { useState, useEffect } from 'react'
import { FiMoreVertical, FiSearch, FiFilter } from 'react-icons/fi'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminBuyers() {
  const [buyers, setBuyers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBuyers()
  }, [])

  const fetchBuyers = async () => {
    try {
      const res = await api.get('/admin/buyers')
      setBuyers(res.data)
    } catch (err) {
      toast.error('Failed to load buyers')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/admin/users/${id}/status`, { status })
      toast.success(`Buyer status updated`)
      setBuyers(buyers.map(b => b._id === id ? { ...b, status } : b))
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading buyers...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Buyers Management</h1>
          <p className="text-sm text-stone-500 mt-1">View and manage customer accounts.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search buyers..." 
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
                <th className="px-6 py-4 font-semibold">Buyer</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold">Orders</th>
                <th className="px-6 py-4 font-semibold">Total Spent</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
              {buyers.map(buyer => (
                <tr key={buyer._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 font-bold">
                        {buyer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900 dark:text-white">{buyer.name}</div>
                        <div className="text-xs text-stone-500">{buyer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{buyer.joined}</td>
                  <td className="px-6 py-4">{buyer.ordersCount}</td>
                  <td className="px-6 py-4 font-semibold">${buyer.totalSpent.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      buyer.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                    }`}>
                      {buyer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {buyer.status === 'active' ? (
                        <button onClick={() => handleStatusChange(buyer._id, 'blocked')} className="text-xs px-3 py-1.5 rounded bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                          Block
                        </button>
                      ) : (
                        <button onClick={() => handleStatusChange(buyer._id, 'active')} className="text-xs px-3 py-1.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
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
