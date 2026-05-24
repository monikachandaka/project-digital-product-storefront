import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createOrder, verifyPayment } from '../store/orderSlice'
import { clearCartAPI } from '../store/cartSlice'
import { FiLock } from 'react-icons/fi'
import toast from 'react-hot-toast'

import api from '../services/api'

export default function CheckoutPage() {
    // Marketing opt-in
    const [optIn, setOptIn] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, totalAmount } = useSelector(s => s.cart)
  const { user } = useSelector(s => s.auth)
  const { loading } = useSelector(s => s.orders)
  const [processing, setProcessing] = useState(false)
  const [contactNumber, setContactNumber] = useState('')

  // Multi-currency
  const [currency, setCurrency] = useState('INR')
  const [rates, setRates] = useState({})
  useEffect(() => {
    api.get('/currency/rates').then(res => setRates(res.data)).catch(() => {})
  }, [])

  // Discount code
  const [discountCode, setDiscountCode] = useState('')
  const [discount, setDiscount] = useState(null)
  const [discountError, setDiscountError] = useState('')
  const [availableCoupons, setAvailableCoupons] = useState([])

  useEffect(() => {
    api.get('/discounts/available')
      .then(res => setAvailableCoupons(res.data))
      .catch(() => {})
  }, [])

  const handleApplyDiscount = async (overrideCode) => {
    const codeToApply = typeof overrideCode === 'string' ? overrideCode : discountCode
    if (!codeToApply) return
    setDiscountError('')
    try {
      const res = await api.post('/discounts/apply', { code: codeToApply })
      setDiscount(res.data)
      setDiscountCode(codeToApply)
    } catch (err) {
      setDiscount(null)
      setDiscountError(err.response?.data?.error || 'Invalid code')
    }
  }

  // Tax calculation
  const [tax, setTax] = useState(0)
  useEffect(() => {
    if (!user?.country) { setTax(0); return }
    api.get('/tax/calculate', { params: { amount: totalAmount, country: user.country } })
      .then(res => setTax(res.data.tax)).catch(() => setTax(0))
  }, [totalAmount, user?.country])

  // Cross-selling
  const [related, setRelated] = useState([])
  useEffect(() => {
    if (items.length > 0) {
      api.get('/products/related', { params: { productId: items[0].product?._id } })
        .then(res => setRelated(res.data)).catch(() => setRelated([]))
    }
  }, [items])

  // Currency conversion
  const convert = (amount) => {
    if (currency === 'INR' || !rates[currency]) return amount
    return amount * (rates[currency] / (rates['INR'] || 1))
  }

  // Discount calculation
  let discountAmount = 0
  if (discount) {
    if (discount.type === 'percentage') discountAmount = totalAmount * (discount.value / 100)
    else if (discount.type === 'fixed') discountAmount = discount.value
  }

  const grandTotal = Math.round(totalAmount + tax - discountAmount)

  const loadRazorpay = () => new Promise(resolve => {
    if (document.getElementById('razorpay-script')) { resolve(true); return }
    const script = document.createElement('script')
    script.id = 'razorpay-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

  const handlePayment = async () => {
    if (items.length === 0) { toast.error('Cart is empty'); return }
    if (!contactNumber || contactNumber.trim().length < 10) { toast.error('Please enter a valid mobile number'); return }
    setProcessing(true)
    try {
      const loaded = await loadRazorpay()
      if (!loaded) { toast.error('Razorpay failed to load. Check your connection.'); setProcessing(false); return }

      // Fetch Razorpay key securely from backend
      const { data: { key: razorpayKey } } = await api.get('/config/razorpay')

      const orderData = await dispatch(createOrder({ items: items.map(i => ({ product: i.product?._id, quantity: i.quantity })), totalAmount: grandTotal, optIn })).unwrap()

      const options = {
        key: razorpayKey,
        amount: orderData.razorpayOrder?.amount,
        currency: 'INR',
        name: 'DigitalVault',
        description: 'Digital Products Purchase',
        order_id: orderData.razorpayOrder?.id,
        handler: async (response) => {
          try {
            const verifiedData = await dispatch(verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.order?._id,
            })).unwrap()
            await dispatch(clearCartAPI())
            toast.success('Payment successful! 🎉')
            navigate('/order-success', { state: { order: verifiedData.order } })
          } catch { toast.error('Payment verification failed') }
        },
        prefill: { name: user?.name, email: user?.email, contact: contactNumber },
        theme: { color: '#f97316' },
        modal: { ondismiss: () => { toast.error('Payment cancelled'); setProcessing(false) } },
      }
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response){
        console.error('Razorpay payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open()
    } catch (err) {
      toast.error(err || 'Failed to initiate payment')
      setProcessing(false)
    }
  }

  if (items.length === 0) return (
    <div className="page-container py-16 text-center">
      <p className="text-stone-500">Your cart is empty. <a href="/products" className="text-brand-500 underline">Browse products</a></p>
    </div>
  )

  return (
    <div className="page-container py-8 max-w-4xl">
      <h1 className="section-title mb-8">Checkout</h1>
      {/* Currency selection */}
      <div className="mb-4 flex gap-2 items-center">
        <span className="text-sm">Currency:</span>
        <select value={currency} onChange={e => setCurrency(e.target.value)} className="border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white rounded px-2 py-1">
          {Object.keys(rates).sort().map(cur => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
          <option value="INR">INR</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Items */}
        <div className="card p-6">
          <h2 className="font-semibold text-stone-900 dark:text-white mb-4">Order Items ({items.length})</h2>
          <div className="space-y-3 divide-y divide-stone-100 dark:divide-stone-800">
            {items.map(item => (
              <div key={item.product?._id} className="flex items-center gap-3 pt-3 first:pt-0">
                <img src={item.product?.image || 'https://placehold.co/50x50?text=P'} alt={item.product?.title}
                  className="w-12 h-12 object-cover rounded-lg border border-stone-200 dark:border-stone-700 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 dark:text-white line-clamp-1">{item.product?.title}</p>
                  <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-stone-900 dark:text-white shrink-0">
                  {currency} {convert((item.product?.price || 0) * item.quantity).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>

          {/* Cross-sell suggestions */}
          {related.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-2 text-stone-900 dark:text-white">You may also like</h3>
              <div className="grid grid-cols-2 gap-3">
                {related.map(prod => (
                  <div key={prod._id} className="border rounded p-2 flex flex-col items-center">
                    <img src={prod.image || 'https://placehold.co/50x50?text=P'} alt={prod.title} className="w-12 h-12 object-cover rounded mb-1" />
                    <div className="text-xs font-medium text-stone-900 dark:text-white line-clamp-1">{prod.title}</div>
                    <div className="text-xs text-stone-500">{currency} {convert(prod.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div>
          <div className="card p-6 mb-4">
            <h2 className="font-semibold text-stone-900 dark:text-white mb-4">Price Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Subtotal</span><span>{currency} {convert(totalAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Tax</span><span>{currency} {convert(tax).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              {discount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount.code})</span>
                  <span>-{currency} {convert(discountAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="border-t border-stone-200 dark:border-stone-800 pt-3 flex justify-between font-bold text-stone-900 dark:text-white text-lg">
                <span>Grand Total</span><span>{currency} {convert(grandTotal).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Available Coupons */}
            {availableCoupons.length > 0 && (
              <div className="mt-4 p-3 bg-brand-50/50 dark:bg-brand-900/10 rounded-lg border border-brand-100 dark:border-brand-800">
                <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mb-2 uppercase tracking-wider">Available Coupons</p>
                <div className="flex flex-wrap gap-2">
                  {availableCoupons.map(c => (
                    <button
                      key={c.code}
                      onClick={() => handleApplyDiscount(c.code)}
                      className="text-xs font-medium bg-white dark:bg-stone-800 border border-brand-200 dark:border-brand-700 hover:border-brand-400 text-stone-700 dark:text-stone-300 px-2 py-1 rounded transition-colors text-left"
                    >
                      <span className="font-bold">{c.code}</span> <span className="text-brand-500 opacity-80 border-l border-brand-200 dark:border-brand-700 pl-1 ml-1">{c.type === 'percentage' ? `${c.value}% off` : `₹${c.value} off`}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Discount code input */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Discount code"
                value={discountCode}
                onChange={e => setDiscountCode(e.target.value)}
                className="border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white placeholder-stone-400 rounded px-2 py-1 mr-2"
              />
              <button onClick={handleApplyDiscount} className="btn-secondary px-3 py-1 text-sm">Apply</button>
              {discountError && <div className="text-xs text-red-500 mt-1">{discountError}</div>}
              {discount && <div className="text-xs text-green-600 mt-1">Code applied!</div>}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-stone-900 dark:text-white mb-4">Billing Details</h2>
            <div className="space-y-1 text-sm text-stone-600 dark:text-stone-400 mb-4">
              <p className="font-medium text-stone-900 dark:text-white">{user?.name}</p>
              <p>{user?.email}</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Mobile Number *</label>
              <input 
                type="tel" 
                value={contactNumber} 
                onChange={e => setContactNumber(e.target.value)} 
                placeholder="Enter your mobile number"
                className="w-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white placeholder-stone-400 rounded-lg px-3 py-2 outline-none focus:border-brand-500"
                required
              />
            </div>
            {/* Marketing opt-in */}
            <label className="flex items-center gap-2 mb-3">
              <input type="checkbox" checked={optIn} onChange={e => setOptIn(e.target.checked)} />
              <span className="text-xs text-stone-600 dark:text-stone-400">I want to receive updates and offers by email</span>
            </label>
            <button onClick={handlePayment} disabled={processing || loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              <FiLock className="w-4 h-4" />
              {processing ? 'Processing...' : `Pay ${currency} ${convert(grandTotal).toLocaleString(undefined, { maximumFractionDigits: 2 })} via Razorpay`}
            </button>
            <p className="text-xs text-stone-400 dark:text-stone-500 text-center mt-3">🔒 Secured by Razorpay — 100% safe & encrypted</p>
          </div>
        </div>
      </div>
    </div>
  )
}
