import { Link, useLocation } from 'react-router-dom'
import { FiCheckCircle, FiPackage, FiHome, FiDownload, FiStar } from 'react-icons/fi'

export default function OrderSuccessPage() {
  const location = useLocation()
  const order = location.state?.order

  return (
    <div className="page-container py-16 text-center">
      <div className="max-w-xl mx-auto">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-white mb-3">Payment Successful!</h1>
        <p className="text-stone-500 dark:text-stone-400 mb-8">
          Thank you for your purchase! Your digital products are ready. We've also emailed you the receipt and download links.
        </p>

        {order?.downloadLinks?.length > 0 && (
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-6 mb-8 text-left shadow-sm">
            <h2 className="font-semibold text-lg mb-4 text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-700 pb-2">Your Downloads</h2>
            <div className="space-y-4">
              {order.downloadLinks.map((link) => {
                // Find the matching product details from order.items
                const item = order.items.find(i => i.product?._id === link.product || i.product === link.product);
                const title = item?.product?.title || 'Digital Product';
                
                return (
                  <div key={link.token} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-100 dark:border-stone-800">
                    <div>
                      <p className="font-medium text-stone-900 dark:text-white">{title}</p>
                      <p className="text-xs text-stone-500 mt-1">Expires in 24 hours or after 3 downloads</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0">
                      <Link 
                        to={`/products/${typeof link.product === 'object' ? link.product._id : link.product}?tab=reviews`}
                        className="btn-secondary py-2 px-4 flex items-center justify-center gap-2 whitespace-nowrap text-sm"
                      >
                        <FiStar className="w-4 h-4" /> Review
                      </Link>
                      <button 
                        onClick={async () => {
                          try {
                            const { default: toast } = await import('react-hot-toast');
                            const toastId = toast.loading('Preparing secure download...');
                            const { default: api } = await import('../services/api');
                            
                            // Use the tokenized URL directly for secure fetching
                            const response = await api.get(link.url, { responseType: 'blob' });
                            
                            const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
                            const downloadUrl = window.URL.createObjectURL(blob);
                            
                            let filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-download.pdf`;
                            const disposition = response.headers['content-disposition'];
                            if (disposition && disposition.indexOf('filename=') !== -1) {
                              const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
                              if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                            }

                            const a = document.createElement('a');
                            a.href = downloadUrl;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            window.URL.revokeObjectURL(downloadUrl);
                            
                            toast.success('Download started!', { id: toastId });
                          } catch (err) {
                            const { default: toast } = await import('react-hot-toast');
                            toast.error('Failed to download file. It might be expired or missing.');
                          }
                        }}
                        className="btn-primary py-2 px-4 flex items-center justify-center gap-2 whitespace-nowrap text-sm"
                      >
                        <FiDownload className="w-4 h-4" /> Download
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders" className="btn-secondary flex items-center justify-center gap-2">
            <FiPackage className="w-4 h-4" /> View My Orders
          </Link>
          <Link to="/" className="btn-secondary flex items-center justify-center gap-2">
            <FiHome className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
