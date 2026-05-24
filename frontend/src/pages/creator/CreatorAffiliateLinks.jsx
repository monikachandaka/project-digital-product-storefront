import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function CreatorAffiliateLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commissionRate, setCommissionRate] = useState(0.1);
  const [creating, setCreating] = useState(false);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/affiliates/my-links');
      setLinks(res.data);
    } catch {
      toast.error('Failed to load affiliate links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLinks(); }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      await api.post('/affiliates/generate', { commissionRate });
      toast.success('Affiliate link created');
      fetchLinks();
    } catch {
      toast.error('Failed to create link');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="card p-6 mb-8">
      <h2 className="font-semibold text-stone-900 dark:text-white mb-4">Affiliate Links</h2>
      <div className="flex gap-3 mb-6">
        <input type="number" min="0.01" max="0.5" step="0.01" value={commissionRate} onChange={e => setCommissionRate(Number(e.target.value))} className="input-field w-32 py-1.5" />
        <button onClick={handleCreate} disabled={creating} className="btn-primary py-1.5 h-10">{creating ? 'Creating...' : 'Generate Link'}</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-stone-100 dark:bg-stone-800">
              <th className="p-3 text-left font-medium text-stone-600 dark:text-stone-400">Code</th>
              <th className="p-3 text-left font-medium text-stone-600 dark:text-stone-400">Commission</th>
              <th className="p-3 text-left font-medium text-stone-600 dark:text-stone-400">Clicks</th>
              <th className="p-3 text-left font-medium text-stone-600 dark:text-stone-400">Sales</th>
              <th className="p-3 text-left font-medium text-stone-600 dark:text-stone-400">Total Commission</th>
              <th className="p-3 text-left font-medium text-stone-600 dark:text-stone-400">Link</th>
            </tr>
          </thead>
          <tbody>
            {links.map(l => (
              <tr key={l._id} className="border-b border-stone-100 dark:border-stone-800/80">
                <td className="p-3 font-mono text-brand-600 dark:text-brand-400 font-medium">{l.code}</td>
                <td className="p-3 text-stone-700 dark:text-stone-300">{(l.commissionRate * 100).toFixed(0)}%</td>
                <td className="p-3 text-stone-700 dark:text-stone-300">{l.totalClicks}</td>
                <td className="p-3 text-stone-700 dark:text-stone-300">{l.totalSales}</td>
                <td className="p-3 text-stone-700 dark:text-stone-300 font-medium text-emerald-600 dark:text-emerald-400">₹{l.totalCommission.toLocaleString()}</td>
                <td className="p-3"><input className="input-field text-xs py-1" value={`${window.location.origin}/?ref=${l.code}`} readOnly onFocus={e => e.target.select()} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
