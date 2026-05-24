import { useState, useEffect } from 'react'
import { FiFolder, FiTrendingUp } from 'react-icons/fi'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/categories')
      setCategories(res.data)
    } catch (err) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading categories...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Product Categories</h1>
        <p className="text-sm text-stone-500 mt-1">Manage platform categories and view performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl">
                <FiFolder />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-white">{cat.name}</h3>
                <p className="text-sm text-stone-500">{cat.products} Products</p>
              </div>
            </div>
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-stone-500">Total Revenue</p>
                <p className="font-bold text-stone-900 dark:text-white">${cat.revenue.toLocaleString()}</p>
              </div>
              <div className="text-emerald-500 flex items-center gap-1 text-sm font-medium">
                <FiTrendingUp /> Active
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
