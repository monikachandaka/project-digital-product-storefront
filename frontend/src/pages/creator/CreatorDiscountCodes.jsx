import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function CreatorDiscountCodes() {
  const [codes, setCodes] = useState([]);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', expiresAt: '', usageLimit: 1 });
  const [loading, setLoading] = useState(false);

  const fetchCodes = async () => {
    try {
      const res = await api.get('/discounts/my-codes');
      setCodes(res.data);
    } catch {
      toast.error('Failed to load discount codes');
    }
  };

  useEffect(() => { fetchCodes(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/discounts/create', form);
      toast.success('Discount code created');
      setForm({ code: '', type: 'percentage', value: '', expiresAt: '', usageLimit: 1 });
      fetchCodes();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 mb-8">
      <h2 className="font-semibold text-stone-900 dark:text-white mb-4">Discount Codes</h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end mb-6">
        <input name="code" value={form.code} onChange={handleChange} required placeholder="Code" className="input-field max-w-[150px] py-1.5" />
        <select name="type" value={form.type} onChange={handleChange} className="input-field max-w-[150px] py-1.5">
          <option value="percentage">% Off</option>
          <option value="fixed">Fixed Amount</option>
        </select>
        <input name="value" value={form.value} onChange={handleChange} required type="number" min="1" placeholder="Value" className="input-field w-24 py-1.5" />
        <input name="expiresAt" value={form.expiresAt} onChange={handleChange} required type="date" className="input-field max-w-[180px] py-1.5 text-sm" />
        <input name="usageLimit" value={form.usageLimit} onChange={handleChange} type="number" min="1" placeholder="Usage Limit" className="input-field w-32 py-1.5" />
        <button type="submit" disabled={loading} className="btn-primary py-1.5 h-10">{loading ? 'Creating...' : 'Create'}</button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-stone-100 dark:bg-stone-800">
              <th className="p-3 text-left font-medium text-stone-600 dark:text-stone-400">Code</th>
              <th className="p-3 text-left font-medium text-stone-600 dark:text-stone-400">Type</th>
              <th className="p-3 text-left font-medium text-stone-600 dark:text-stone-400">Value</th>
              <th className="p-3 text-left font-medium text-stone-600 dark:text-stone-400">Expires</th>
              <th className="p-3 text-left font-medium text-stone-600 dark:text-stone-400">Usage</th>
              <th className="p-3 text-left font-medium text-stone-600 dark:text-stone-400">Active</th>
            </tr>
          </thead>
          <tbody>
            {codes.map(c => (
              <tr key={c._id} className="border-b border-stone-100 dark:border-stone-800/80">
                <td className="p-3 font-mono text-brand-600 dark:text-brand-400 font-medium">{c.code}</td>
                <td className="p-3 text-stone-700 dark:text-stone-300">{c.type}</td>
                <td className="p-3 text-stone-700 dark:text-stone-300">{c.value}</td>
                <td className="p-3 text-stone-700 dark:text-stone-300">{c.expiresAt?.slice(0,10)}</td>
                <td className="p-3 text-stone-700 dark:text-stone-300">{c.usedCount}/{c.usageLimit}</td>
                <td className="p-3">{c.active ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
