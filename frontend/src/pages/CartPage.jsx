import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { removeFromCart, updateCartItem, clearCartAPI } from '../store/cartSlice'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, totalAmount } = useSelector(s => s.cart)

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId))
    toast.success('Removed from cart')
  }

  const handleQtyChange = (productId, qty) => {
    if (qty < 1) return
    dispatch(updateCartItem({ productId, quantity: qty }))
  }

  const tax = totalAmount * 0.18
  const grandTotal = totalAmount + tax

  if (items.length === 0) return (
    <div className="page-container py-16 text-center">
      <FiShoppingBag className="w-16 h-16 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
      <h2 className="font-display text-2xl font-bold text-stone-700 dark:text-stone-300 mb-2">Your cart is empty</h2>
      <p className="text-stone-500 dark:text-stone-400 mb-6">Discover amazing digital products</p>
      <Link to="/products" className="btn-primary">Browse Products</Link>
    </div>
  )

  return (
    <div className="page-container py-8">
      <h1 className="section-title mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.product?._id || item._id} className="card p-4 flex gap-4">
              <img src={item.product?.image || 'https://placehold.co/80x80?text=P'} alt={item.product?.title}
                className="w-20 h-20 object-cover rounded-lg border border-stone-200 dark:border-stone-700 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-stone-900 dark:text-white text-sm line-clamp-2 mb-1">{item.product?.title}</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">{item.product?.category}</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleQtyChange(item.product?._id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center justify-center hover:border-brand-400 transition-colors">
                      <FiMinus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => handleQtyChange(item.product?._id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center justify-center hover:border-brand-400 transition-colors">
                      <FiPlus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-stone-900 dark:text-white">₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}</span>
                    <button onClick={() => handleRemove(item.product?._id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="card p-6 sticky top-20">
            <h2 className="font-display font-bold text-xl text-stone-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>GST (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-stone-200 dark:border-stone-800 pt-3 flex justify-between font-bold text-stone-900 dark:text-white text-base">
                <span>Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full">Proceed to Checkout</button>
            <Link to="/products" className="btn-ghost w-full text-center mt-2 block text-sm">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
