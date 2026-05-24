import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../store/productSlice'
import ProductCard from '../components/products/ProductCard'
import { SkeletonCard } from '../components/common/Loader'
import { FiArrowRight, FiDownload, FiShield, FiStar, FiZap } from 'react-icons/fi'
import { motion } from 'framer-motion'
import PromoBanner from '../components/common/PromoBanner'

const CATEGORIES = [
  { name: 'eBooks', emoji: '📚', desc: 'Knowledge at your fingertips' },
  { name: 'Templates', emoji: '🗂️', desc: 'Ready-to-use designs' },
  { name: 'Design Assets', emoji: '🎨', desc: 'Premium design resources' },
  { name: 'Software Tools', emoji: '⚙️', desc: 'Boost your productivity' },
  { name: 'Study Materials', emoji: '📖', desc: 'Learn & grow faster' },
]

const FEATURES = [
  { icon: FiDownload, title: 'Instant Download', desc: 'Get your files immediately after purchase' },
  { icon: FiShield, title: 'Secure Payments', desc: 'Powered by Razorpay — 100% safe & encrypted' },
  { icon: FiStar, title: 'Premium Quality', desc: 'Curated, high-quality digital products only' },
  { icon: FiZap, title: 'Regular Updates', desc: 'Free updates on all purchased products' },
]

const DEFAULT_TESTIMONIALS = [
  { id: 1, name: "Sarah Jenkins", role: "Freelance Designer", text: "The UI templates I bought here saved me literally weeks of work. The quality is unmatched compared to other marketplaces.", avatar: "https://i.pravatar.cc/150?u=sarah" },
  { id: 2, name: "David Chen", role: "Software Engineer", text: "Purchased a React dashboard template and it was incredibly well-coded. Best $49 I've spent all year. Highly recommend!", avatar: "https://i.pravatar.cc/150?u=david" },
  { id: 3, name: "Elena Rodriguez", role: "Digital Marketer", text: "I sell my own marketing eBooks on DigitalVault and the platform is amazing. Fast payouts and a beautiful storefront.", avatar: "https://i.pravatar.cc/150?u=elena" },
]

const DEFAULT_TOP_CREATORS = [
  { id: 1, name: "PixelPerfect", sales: "1.2k+ Sales", tags: ["UI Kits", "Templates"], avatar: "https://i.pravatar.cc/150?u=pixel" },
  { id: 2, name: "DevMastery", sales: "850+ Sales", tags: ["React", "NodeJS"], avatar: "https://i.pravatar.cc/150?u=dev" },
  { id: 3, name: "CreativeStudio", sales: "2.5k+ Sales", tags: ["Fonts", "Vectors"], avatar: "https://i.pravatar.cc/150?u=creative" },
  { id: 4, name: "StudyHub", sales: "3.1k+ Sales", tags: ["eBooks", "Notes"], avatar: "https://i.pravatar.cc/150?u=study" },
]

export default function HomePage() {
  const dispatch = useDispatch()
  const { products, loading } = useSelector(s => s.products)
  
  const [topCreators, setTopCreators] = useState(DEFAULT_TOP_CREATORS)
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS)

  useEffect(() => { 
    dispatch(fetchProducts({ limit: 8, sort: '-createdAt' })) 
    
    // Fetch dynamic homepage data
    api.get('/auth/creators/top').then(res => {
      if (res.data && res.data.length > 0) setTopCreators(res.data)
    }).catch(console.error)

    // Fetch real top reviews
    api.get('/products/top-reviews').then(res => {
      if (res.data && res.data.length > 0) setTestimonials(res.data)
    }).catch(console.error)
  }, [dispatch])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-light dark:bg-[#0F172A] text-stone-900 dark:text-white min-h-[90vh] flex items-center pt-20">
        {/* Dynamic Orbs */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-1/4 w-[40vw] h-[40vw] max-w-2xl bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[10%] w-[50vw] h-[50vw] max-w-3xl bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" 
        />
        
        <div className="page-container relative z-10 w-full text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 glass px-5 py-2 rounded-full text-sm font-bold tracking-wide shadow-sm hover:shadow-brand-500/20 transition-all duration-300 mb-10 border border-brand-500/20 text-stone-700 dark:text-stone-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              The Premium Digital Marketplace
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-display text-6xl md:text-8xl font-black leading-[1.05] mb-8 tracking-tighter"
            >
              Monetize Your<br />
              <span className="gradient-text drop-shadow-sm">Digital Craft</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-stone-600 dark:text-stone-400 text-xl md:text-2xl mb-12 leading-relaxed max-w-2xl mx-auto font-light"
            >
              Discover thousands of premium digital products — templates, design assets, and software tools. Instant access. Lifetime value.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link to="/products" className="btn-primary flex items-center gap-2 text-lg px-10 py-4">
                Browse Products <FiArrowRight />
              </Link>
              <Link to="/register" className="btn-secondary flex items-center gap-2 text-lg px-10 py-4 font-bold bg-white/50 dark:bg-[#1E293B]/50 hover:bg-white dark:hover:bg-[#1E293B]">
                Join for Free
              </Link>
            </motion.div>



          </motion.div>
        </div>
      </section>

      {/* Promotional Banner */}
      <PromoBanner />

      {/* Categories */}
      <section className="py-24 page-container relative z-20 -mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-3">Browse by Category</h2>
          <p className="text-stone-500 dark:text-stone-400 text-lg">Find exactly what you need from our curated collection</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="card glass p-6 text-center group cursor-pointer block h-full border border-stone-200/50 dark:border-stone-800/50 shadow-xl shadow-stone-200/20 dark:shadow-black/40 hover:-translate-y-2">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{cat.emoji}</div>
                <h3 className="font-semibold text-base text-stone-900 dark:text-white group-hover:text-brand-500 transition-colors mb-2">{cat.name}</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">{cat.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-stone-50 dark:bg-stone-950">
        <div className="page-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title mb-1">Featured Products</h2>
              <p className="text-stone-500 dark:text-stone-400">Handpicked premium digital products</p>
            </div>
            <Link to="/products" className="btn-secondary text-sm flex items-center gap-2">
              View All <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : products.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)
            }
          </div>
          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">📦</p>
              <p className="text-stone-500 dark:text-stone-400">No products yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 page-container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-3">Why DigitalVault?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-lg">Everything you need to succeed, nothing you don't</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div 
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-8 text-center border-stone-200/50 dark:border-stone-800/50 shadow-xl shadow-stone-200/20 dark:shadow-black/40 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-brand-100 to-fuchsia-100 dark:from-brand-900/40 dark:to-fuchsia-900/40 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Icon className="w-8 h-8 text-brand-500" />
              </div>
              <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-3">{title}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Creators Spotlight */}
      <section className="py-20 bg-stone-50 dark:bg-stone-950">
        <div className="page-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="section-title mb-2">Featured Creators</h2>
              <p className="text-stone-500 dark:text-stone-400">Discover top talent on DigitalVault</p>
            </div>
            <Link to="/products" className="btn-ghost hidden sm:flex items-center gap-2">
              View All <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCreators.map((creator, i) => (
              <motion.div
                key={creator._id || creator.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 text-center group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-brand-100 to-fuchsia-100 dark:from-brand-900/40 dark:to-fuchsia-900/40" />
                <img src={creator.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=8b5cf6&color=fff`} alt={creator.name} className="w-20 h-20 rounded-full border-4 border-white dark:border-stone-900 mx-auto relative z-10 shadow-md mb-4" />
                <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-1 group-hover:text-brand-500 transition-colors">{creator.name}</h3>
                <p className="text-sm text-stone-500 mb-4">{creator.sales || '0 Sales'}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {creator.tags?.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-1 rounded-md">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wall of Love (Testimonials) */}
      <section className="py-24 page-container overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-[100px] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-bold px-4 py-1.5 rounded-full text-sm mb-4">Wall of Love ❤️</div>
          <h2 className="section-title mb-4">Trusted by many creators</h2>
          <p className="text-stone-500 dark:text-stone-400 text-lg max-w-2xl mx-auto">Don't just take our word for it. Here's what our community has to say about their experience with DigitalVault.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t._id || t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass card p-8 relative"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating || 5)].map((_, s) => <FiStar key={s} className="w-4 h-4 text-amber-400 fill-current" />)}
              </div>
              <p className="text-stone-700 dark:text-stone-300 mb-6 italic leading-relaxed text-sm">"{t.comment || t.text}"</p>
              <div className="flex items-center gap-4 mt-auto">
                <img src={t.user?.avatar || t.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.user?.name || t.name)}&background=8b5cf6&color=fff`} alt={t.user?.name || t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-white text-sm">{t.user?.name || t.name}</h4>
                  <p className="text-xs text-stone-500">{t.user?.role || t.role}</p>
                  {t.product && <p className="text-[10px] text-brand-500 mt-0.5 truncate max-w-[150px]">for {t.product.title}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>



      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-fuchsia-600 to-pink-600 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay opacity-30" />
        
        <div className="page-container text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6 tracking-tight drop-shadow-md">Ready to level up your toolkit?</h2>
            <p className="text-brand-50 text-lg sm:text-xl mb-10 font-light drop-shadow-sm">Join thousands of creators and learners using DigitalVault to accelerate their journey.</p>
            <Link to="/register" className="bg-white text-brand-600 hover:bg-stone-50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/20 font-bold px-10 py-4 rounded-xl inline-block transition-all duration-300 text-lg">
              Get Started for Free
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
