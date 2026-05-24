import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword } from '../store/authSlice'
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.auth)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await dispatch(forgotPassword(email)).unwrap()
      setSent(true)
      toast.success('Reset link sent!')
    } catch (err) { toast.error(err || 'Failed to send reset email') }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          {sent ? (
            <div className="text-center">
              <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-white mb-3">Check your email</h2>
              <p className="text-stone-500 dark:text-stone-400 mb-6">
                We've sent a password reset link to <strong>{email}</strong>. Check your inbox (and spam folder).
              </p>
              <Link to="/login" className="btn-primary w-full block text-center">Back to Login</Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 text-sm text-stone-500 hover:text-brand-500 mb-6 transition-colors">
                <FiArrowLeft className="w-4 h-4" /> Back to login
              </Link>
              <h1 className="font-display text-2xl font-bold text-stone-900 dark:text-white mb-2">Forgot Password</h1>
              <p className="text-stone-500 dark:text-stone-400 mb-6">Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="input-field pl-10" placeholder="you@example.com" required />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
