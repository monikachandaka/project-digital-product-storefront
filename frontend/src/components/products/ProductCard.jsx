import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiHeart, FiShoppingCart, FiStar, FiArrowUpRight } from 'react-icons/fi'
import { addToCart } from '../../store/cartSlice'
import { toggleWishlist } from '../../store/wishlistSlice'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const CATEGORY_COLORS = {
  'eBooks': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Templates': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Design Assets': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Software Tools': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Study Materials': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
}

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(s => s.auth)
  const { items: wishlistItems } = useSelector(s => s.wishlist)
  const isWishlisted = wishlistItems.some(item => item._id === product._id || item.product?._id === product._id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return }
    dispatch(addToCart({ productId: product._id }))
    toast.success('Added to cart!')
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login to add to wishlist'); return }
    dispatch(toggleWishlist(product._id))
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!')
  }

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="h-full relative group rounded-2xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] dark:hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]"
    >
      <Link to={`/products/${product._id}`} className="card glass flex flex-col overflow-hidden h-full relative z-10 border border-transparent group-hover:border-brand-500/30">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-stone-100 dark:bg-stone-800">
        {product.youtubeUrl && product.youtubeUrl.match(/(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/) ? (
          <iframe
            className="w-full h-full object-cover pointer-events-none"
            src={`https://www.youtube.com/embed/${product.youtubeUrl.match(/(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${product.youtubeUrl.match(/(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)[1]}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <img
            src={product.imageUrl || product.image || 'https://placehold.co/400x300?text=No+Image'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        )}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="text-white text-sm font-medium flex items-center gap-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            View Details <FiArrowUpRight />
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`badge text-xs font-medium ${CATEGORY_COLORS[product.category] || 'bg-stone-100 text-stone-600'}`}>
            {product.category}
          </span>
        </div>
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200
            ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500'}`}
        >
          <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-stone-900 dark:text-white text-sm line-clamp-2 group-hover:text-brand-500 transition-colors mb-1">
          {product.title}
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mb-3 flex-1">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(s => (
              <FiStar key={s} className={`w-3 h-3 ${s <= Math.round(product.averageRating || 0) ? 'text-amber-400 fill-current' : 'text-stone-300'}`} />
            ))}
          </div>
          <span className="text-xs text-stone-500">({product.numReviews || 0})</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-auto pt-2 relative overflow-hidden">
          <div>
            <span className="font-display font-bold text-lg text-stone-900 dark:text-white transition-transform duration-300 inline-block group-hover:-translate-y-1">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through ml-1.5 transition-transform duration-300 inline-block group-hover:-translate-y-1">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="absolute right-0 flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-medium px-4 py-2 rounded-lg transition-all duration-300 active:scale-95 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <FiShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
      </Link>
    </motion.div>
  )
}
