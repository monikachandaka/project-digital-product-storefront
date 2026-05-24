import { useState, useEffect } from 'react'
import { FiStar, FiTrash2 } from 'react-icons/fi'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await api.get('/admin/reviews')
      setReviews(res.data)
    } catch (err) {
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id) => {
    // Implement delete logic when backend supports it
    toast.success('Review deleted (simulated)')
    setReviews(reviews.filter(r => r._id !== id))
  }

  if (loading) return <div className="p-8 text-center">Loading reviews...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Platform Reviews</h1>
        <p className="text-sm text-stone-500 mt-1">Moderate user reviews across all products.</p>
      </div>

      <div className="bg-white dark:bg-[#111] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-50 dark:bg-[#1a1a1a] border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Rating</th>
                <th className="px-6 py-4 font-semibold w-1/3">Comment</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
              {reviews.map(review => (
                <tr key={review._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-stone-900 dark:text-white">{review.user}</td>
                  <td className="px-6 py-4">{review.productTitle}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={i < review.rating ? 'fill-current' : 'text-stone-300 dark:text-stone-700'} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-normal min-w-[200px] text-stone-600 dark:text-stone-400">{review.comment}</td>
                  <td className="px-6 py-4">{review.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(review._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-stone-500">No reviews found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
