import { useState } from 'react'
import api from '../services/api'
import { FiMail, FiMessageSquare, FiUser, FiChevronDown, FiSend } from 'react-icons/fi'
import toast from 'react-hot-toast'

const FAQS = [
  { q: 'How do I download my purchased products?', a: 'After successful payment, go to My Orders and click the Download button next to each product.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI, net banking, and wallets via Razorpay.' },
  { q: 'Can I get a refund?', a: 'Due to the digital nature of products, we generally do not offer refunds. Please review products carefully before purchasing.' },
  { q: 'Are the products updated regularly?', a: 'Yes! Purchased products receive free updates whenever the seller pushes new versions.' },
  { q: 'How do I become a seller?', a: 'Contact us to request seller access. Once approved, you can list your digital products on our platform.' },
  { q: 'Is my payment information secure?', a: 'Absolutely. We use Razorpay, a PCI-DSS compliant payment gateway. We never store your card details.' },
]

function FAQItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
        <span className="font-medium text-stone-900 dark:text-white text-sm">{item.q}</span>
        <FiChevronDown className={`w-4 h-4 text-stone-400 transition-transform shrink-0 ml-3 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 pb-4 text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{item.a}</div>}
    </div>
  )
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/contact', form)
      toast.success('Message sent! We\'ll reply within 24 hours.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch { toast.error('Failed to send. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="page-container py-12">
      <div className="text-center mb-12">
        <h1 className="section-title mb-3">Get In Touch</h1>
        <p className="text-stone-500 dark:text-stone-400 max-w-xl mx-auto">Have a question or need help? We're here to assist you with anything related to your digital products.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Contact form */}
        <div className="card p-8">
          <h2 className="font-display text-xl font-bold text-stone-900 dark:text-white mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="input-field pl-10" placeholder="Your name" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="input-field pl-10" placeholder="you@example.com" required />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Subject</label>
              <div className="relative">
                <FiMessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  className="input-field pl-10" placeholder="How can we help?" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Message</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={5} className="input-field resize-none" placeholder="Describe your issue or question..." required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              <FiSend className="w-4 h-4" />
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-stone-900 dark:text-white mb-2">📧 Email Support</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">monikachandaka24@gmail.com — We reply within 24 hours.</p>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-stone-900 dark:text-white mb-2">⏱ Business Hours</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">Monday – Friday: 9 AM to 6 PM IST<br />Saturday: 10 AM to 4 PM IST</p>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-stone-900 dark:text-white mb-2">🚀 Quick Answers</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">Check our FAQ section below for instant answers to common questions.</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="section-title text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((item, i) => <FAQItem key={i} item={item} />)}
        </div>
      </div>
    </div>
  )
}
