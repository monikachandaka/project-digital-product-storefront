import { useState, useEffect } from 'react'
import { FiMoreVertical, FiSearch, FiFilter, FiDownload } from 'react-icons/fi'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders')
      setOrders(res.data)
    } catch (err) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading orders...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Orders & Transactions</h1>
          <p className="text-sm text-stone-500 mt-1">Monitor platform sales and refund requests.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <button className="p-2 bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900">
            <FiFilter />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 rounded-lg text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors">
            <FiDownload /> Export
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-50 dark:bg-[#1a1a1a] border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Buyer</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-stone-500">#{order._id}</td>
                  <td className="px-6 py-4 font-medium text-stone-900 dark:text-white">{order.buyer}</td>
                  <td className="px-6 py-4">{order.product}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4 font-bold text-stone-900 dark:text-white">${order.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      order.status === 'refunded' ? 'bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                      <FiMoreVertical />
                    </button>
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
