import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyOrders, getDownloadLink } from '../store/orderSlice'
import Loader from '../components/common/Loader'
import { FiDownload, FiPackage, FiStar } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

export default function OrderHistoryPage() {
  const dispatch = useDispatch()
  const { orders, loading } = useSelector(s => s.orders)

  useEffect(() => { dispatch(fetchMyOrders()) }, [dispatch])

  const handleDownload = async (orderId, productId) => {
    try {
      const toastId = toast.loading('Preparing secure download...');
      // Fetch the file securely using the configured api instance (which attaches JWT)
      // We must specify responseType: 'blob' so axios doesn't try to parse the PDF as JSON
      const { default: api } = await import('../services/api');
      const response = await api.get(`/orders/${orderId}/download/${productId}`, { responseType: 'blob' });
      
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Extract filename from content-disposition if available
      let filename = 'digital-download.pdf';
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.indexOf('filename=') !== -1) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
      }

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success('Download started!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to get download link. The file might be corrupted or missing.');
    }
  }

  if (loading) return <Loader text="Loading orders..." />

  return (
    <div className="page-container py-8">
      <h1 className="section-title mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <FiPackage className="w-16 h-16 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
          <h2 className="font-semibold text-stone-700 dark:text-stone-300 mb-2">No orders yet</h2>
          <p className="text-stone-500 dark:text-stone-400 mb-6">Start shopping to see your orders here</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map(order => (
            <div key={order._id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-stone-400 font-mono mb-1">#{order._id?.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${STATUS_COLORS[order.paymentStatus] || 'bg-stone-100 text-stone-600'}`}>
                    {order.paymentStatus?.toUpperCase()}
                  </span>
                  <span className="font-bold text-stone-900 dark:text-white">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="space-y-3">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={item.product?.image || 'https://placehold.co/50x50?text=P'} alt={item.product?.title}
                      className="w-12 h-12 object-cover rounded-lg border border-stone-200 dark:border-stone-700 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 dark:text-white line-clamp-1">{item.product?.title}</p>
                      <p className="text-xs text-stone-500">Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</p>
                    </div>
                    {order.paymentStatus === 'paid' && (
                      <div className="flex items-center gap-2">
                        <Link to={`/products/${item.product?._id}?tab=reviews`}
                          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-brand-600 font-medium border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                          <FiStar className="w-3.5 h-3.5" /> Review
                        </Link>
                        <button onClick={() => handleDownload(order._id, item.product?._id)}
                          className="flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-600 font-medium border border-brand-200 dark:border-brand-800 px-3 py-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                          <FiDownload className="w-3.5 h-3.5" /> Download
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
