import { useState, useEffect } from 'react'
import { FiMoreVertical, FiSearch, FiFilter, FiEdit2, FiTrash2 } from 'react-icons/fi'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await api.get('/admin/products')
      setProducts(res.data)
    } catch (err) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/admin/products/${id}/status`, { status })
      toast.success(`Product ${status}`)
      setProducts(products.map(p => p._id === id ? { ...p, status } : p))
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Product deleted successfully');
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      toast.error('Failed to delete product');
    }
  }

  if (loading) return <div className="p-8 text-center">Loading products...</div>

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Products Management</h1>
          <p className="text-sm text-stone-500 mt-1">Review and manage digital products.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                <th className="px-6 py-4 font-semibold">Product Title</th>
                <th className="px-6 py-4 font-semibold">Creator</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Sales</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
              {filteredProducts.map(product => (
                <tr key={product._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-stone-900 dark:text-white">{product.title}</td>
                  <td className="px-6 py-4">{product.creator}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">{product.sales}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      product.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                      'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {product.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatusChange(product._id, 'approved')} className="text-xs px-3 py-1.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
                            Approve
                          </button>
                          <button onClick={() => handleStatusChange(product._id, 'rejected')} className="text-xs px-3 py-1.5 rounded bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                            Reject
                          </button>
                        </>
                      )}
                      <button className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors">
                        <FiTrash2 />
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
