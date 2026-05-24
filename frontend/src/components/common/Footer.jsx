import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FiTwitter, FiInstagram, FiYoutube, FiGithub, FiArrowRight, FiMail } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    // Simulate API call for newsletter subscription
    setTimeout(() => {
      setLoading(false)
      setEmail('')
      toast.success("Thanks for subscribing! Check your email for your 10% off code.")
    }, 1000)
  }

  return (
    <footer className="bg-stone-950 text-stone-400 py-16 border-t border-stone-800 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-900/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-fuchsia-900/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="page-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Description */}
          <div className="space-y-6 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-white">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-fuchsia-500 rounded-lg flex items-center justify-center text-white text-sm font-mono font-bold shadow-sm">DV</div>
              <span className="drop-shadow-sm">DigitalVault</span>
            </Link>
            <p className="text-sm leading-relaxed text-stone-400">
              Your premium marketplace for high-quality digital assets, templates, and tools. Accelerate your creative journey today.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all duration-300 shadow-sm border border-stone-800">
                <FiTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all duration-300 shadow-sm border border-stone-800">
                <FiInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm border border-stone-800">
                <FiYoutube className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center hover:bg-stone-700 hover:text-white transition-all duration-300 shadow-sm border border-stone-800">
                <FiGithub className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-6 tracking-wide">Explore</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/products?category=eBooks" className="hover:text-brand-400 transition-colors">eBooks</Link></li>
              <li><Link to="/products?category=Templates" className="hover:text-brand-400 transition-colors">Templates</Link></li>
              <li><Link to="/products?category=Design+Assets" className="hover:text-brand-400 transition-colors">Design Assets</Link></li>
              <li><Link to="/products?category=Software+Tools" className="hover:text-brand-400 transition-colors">Software Tools</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-6 tracking-wide">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-brand-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-white mb-6 tracking-wide">Stay in the Loop</h3>
            <p className="text-sm mb-4 text-stone-400">Get 10% off your first purchase when you subscribe to our newsletter.</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-stone-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-stone-200 transition-colors active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Subscribing...' : 'Subscribe'} <FiArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} DigitalVault. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">Built with ❤️ for Creators</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
