import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeFromWishlist } from '../store/wishlistSlice'
import { addToCart } from '../store/cartSlice'
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi'
import StarRating from '../components/common/StarRating'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const dispatch = useDispatch()
  const { items } = useSelector(s => s.wishlist)

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId))
    toast.success('Removed from wishlist')
  }

  const handleAddToCart = (productId) => {
    dispatch(addToCart({ productId }))
    toast.success('Added to cart!')
  }

  if (items.length === 0) return (
    <div className="page-container py-16 text-center">
      <FiHeart className="w-16 h-16 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
      <h2 className="font-display text-2xl font-bold text-stone-700 dark:text-stone-300 mb-2">Your wishlist is empty</h2>
      <p className="text-stone-500 dark:text-stone-400 mb-6">Save products you love for later</p>
      <Link to="/products" className="btn-primary">Browse Products</Link>
    </div>
  )

  return (
    <div className="page-container py-8">
      <h1 className="section-title mb-8">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map(item => {
          const product = item.product || item
          return (
            <div key={product._id} className="card overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
                <Link to={`/products/${product._id}`}>
                  <img src={product.image || 'https://placehold.co/300x225?text=P'} alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
                <button onClick={() => handleRemove(product._id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-semibold text-stone-900 dark:text-white text-sm line-clamp-2 hover:text-brand-500 transition-colors mb-2">{product.title}</h3>
                </Link>
                <StarRating value={Math.round(product.averageRating || 0)} readOnly size="sm" />
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-stone-900 dark:text-white">₹{product.price?.toLocaleString('en-IN')}</span>
                  <button onClick={() => handleAddToCart(product._id)} className="flex items-center gap-1.5 btn-primary text-xs px-3 py-1.5">
                    <FiShoppingCart className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
