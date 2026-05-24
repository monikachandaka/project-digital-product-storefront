import { useState, useEffect } from 'react'
import api from '../../services/api'
import { FiTag, FiX, FiGift } from 'react-icons/fi'

export default function PromoBanner() {
  const [coupons, setCoupons] = useState([])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    api.get('/discounts/available')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setCoupons(res.data)
        }
      })
      .catch(err => console.error("Failed to fetch coupons", err))
  }, [])

  if (!visible || coupons.length === 0) return null

  // Just show the first available coupon
  const topCoupon = coupons[0]
  const discountText = topCoupon.type === 'percentage' ? `${topCoupon.value}% OFF` : `₹${topCoupon.value} OFF`

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-brand-600 via-brand-500 to-orange-400 py-6 sm:py-8 border-y border-brand-400/30">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute top-10 right-20 w-60 h-60 bg-yellow-300 rounded-full blur-3xl mix-blend-overlay"></div>
      </div>

      <div className="flex overflow-hidden relative">
        <div className="flex animate-marquee whitespace-nowrap min-w-full">
          {/* Duplicate the items multiple times to create a seamless infinite loop */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse">
                  <FiGift className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-xl tracking-tight leading-tight">Exclusive Limited Offer</span>
                  <span className="text-brand-50 text-sm opacity-90 flex items-center gap-2">
                    Apply this secret code at checkout and save big!
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md p-2 pr-4 rounded-2xl border border-white/10 shadow-lg group hover:bg-black/30 transition-all cursor-pointer">
                <div className="bg-white text-brand-600 font-black text-lg px-4 py-1.5 rounded-xl tracking-wider shadow-sm uppercase">
                  {topCoupon.code}
                </div>
                <div className="text-white font-bold text-lg hidden sm:block">
                  for {discountText}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={() => setVisible(false)} 
        className="absolute top-1/2 -translate-y-1/2 right-4 text-white/60 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md p-2 rounded-full transition-all z-50"
        aria-label="Close promo banner"
      >
        <FiX className="w-5 h-5" />
      </button>
    </section>
  )
}
