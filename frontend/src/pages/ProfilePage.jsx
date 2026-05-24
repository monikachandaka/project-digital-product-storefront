import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '../store/authSlice'
import { FiUser, FiMail, FiLock, FiEdit2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { user, loading } = useSelector(s => s.auth)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', currentPassword: '', newPassword: '' })

  const handleSubmit = async e => {
    e.preventDefault()
    const data = { name: form.name, email: form.email }
    if (form.newPassword) {
      if (!form.currentPassword) { toast.error('Enter current password'); return }
      data.currentPassword = form.currentPassword
      data.newPassword = form.newPassword
    }
    try {
      await dispatch(updateProfile(data)).unwrap()
      toast.success('Profile updated!')
      setEditing(false)
      setForm(f => ({ ...f, currentPassword: '', newPassword: '' }))
    } catch (err) { toast.error(err || 'Update failed') }
  }

  return (
    <div className="page-container py-8 max-w-2xl">
      <h1 className="section-title mb-8">My Profile</h1>
      <div className="card p-8">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
            <span className="font-display font-bold text-3xl text-brand-500">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-stone-900 dark:text-white">{user?.name}</h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm">{user?.email}</p>
            <span className={`badge mt-1 ${user?.role === 'admin' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'}`}>
              {user?.role?.toUpperCase()}
            </span>
          </div>
          <button onClick={() => setEditing(!editing)} className="ml-auto btn-ghost p-2 rounded-lg">
            <FiEdit2 className="w-4 h-4" />
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field pl-10" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-field pl-10" required />
              </div>
            </div>
            <div className="border-t border-stone-200 dark:border-stone-800 pt-4">
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">Change Password (optional)</p>
              <div className="space-y-3">
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                  <input type="password" placeholder="Current password" value={form.currentPassword}
                    onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} className="input-field pl-10" />
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                  <input type="password" placeholder="New password" value={form.newPassword}
                    onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} className="input-field pl-10" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
              <FiUser className="w-4 h-4 text-stone-400" />
              <div><p className="text-xs text-stone-400 mb-0.5">Full Name</p><p className="font-medium text-stone-900 dark:text-white">{user?.name}</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
              <FiMail className="w-4 h-4 text-stone-400" />
              <div><p className="text-xs text-stone-400 mb-0.5">Email</p><p className="font-medium text-stone-900 dark:text-white">{user?.email}</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
              <FiLock className="w-4 h-4 text-stone-400" />
              <div><p className="text-xs text-stone-400 mb-0.5">Password</p><p className="font-medium text-stone-900 dark:text-white">••••••••</p></div>
            </div>
            <div className="text-xs text-stone-400 pt-2">
              Member since {new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
