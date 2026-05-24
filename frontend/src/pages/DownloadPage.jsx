import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export default function DownloadPage() {
  const { orderId, productId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [productTitle, setProductTitle] = useState('');

  useEffect(() => {
    async function fetchLink() {
      try {
        setStatus('loading');
        // Try to fetch the download (will redirect or stream if PDF)
        const res = await api.get(`/orders/${orderId}/download/${productId}?token=${token}`, { responseType: 'blob' });
        // If PDF, trigger download
        const contentType = res.headers['content-type'];
        if (contentType === 'application/pdf') {
          const blob = new Blob([res.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          setDownloadUrl(url);
          setProductTitle(res.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, '') || 'eBook.pdf');
          setStatus('ready');
        } else {
          // For other files, just redirect
          window.location.href = res.request.responseURL;
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Download failed or expired.');
        setStatus('error');
      }
    }
    fetchLink();
    // eslint-disable-next-line
  }, [orderId, productId, token]);

  if (status === 'loading') return <div className="page-container py-16 text-center">Preparing your download...</div>;
  if (status === 'error') return <div className="page-container py-16 text-center text-red-500">{error}</div>;

  return (
    <div className="page-container py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Your Download is Ready</h1>
      <a href={downloadUrl} download={productTitle} className="btn-primary px-6 py-3 text-lg">Download {productTitle}</a>
      <p className="mt-4 text-stone-500">This link will expire soon. Please save your file securely.</p>
    </div>
  );
}
