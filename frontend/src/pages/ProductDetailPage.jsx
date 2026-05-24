import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, fetchRelatedProducts, addReview } from '../store/productSlice'
import { addToCart } from '../store/cartSlice'
import { toggleWishlist } from '../store/wishlistSlice'
import Loader from '../components/common/Loader'
import StarRating from '../components/common/StarRating'
import ProductCard from '../components/products/ProductCard'
import { FiShoppingCart, FiHeart, FiDownload, FiStar, FiUser, FiShield, FiZap, FiLock } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { product, relatedProducts, loading } = useSelector(s => s.products)
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const { items: wishlistItems } = useSelector(s => s.wishlist)
  const { orders } = useSelector(s => s.orders)
  const isWishlisted = wishlistItems.some(i => i._id === id || i.product?._id === id)
  const hasPurchased = orders.some(o => o.items?.some(i => i.product?._id === id) && o.paymentStatus === 'paid')
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('tab')) {
      setActiveTab(params.get('tab'))
    }
  }, [location])

  useEffect(() => { 
    dispatch(fetchProductById(id)) 
    dispatch(fetchRelatedProducts(id))
  }, [id, dispatch])

  useEffect(() => {
    if (product?.youtubeUrl) {
      const timer = setTimeout(() => {
        setActiveMediaIndex(1)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [product?.youtubeUrl])

  if (loading) return <Loader text="Loading product..." />
  if (!product) return <div className="page-container py-16 text-center"><p className="text-stone-500">Product not found</p></div>

  const handleAddToCart = () => {
    if (!isAuthenticated) { toast.error('Please login'); navigate('/login'); return }
    dispatch(addToCart({ productId: product._id }))
    toast.success('Added to cart!')
  }

  const handleWishlist = () => {
    if (!isAuthenticated) { toast.error('Please login'); return }
    dispatch(toggleWishlist(product._id))
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!')
  }

  const handleSubmitReview = async e => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login'); return }
    if (!reviewForm.rating) { toast.error('Please select a rating'); return }
    setSubmittingReview(true)
    try {
      await dispatch(addReview({ productId: product._id, data: reviewForm })).unwrap()
      toast.success('Review submitted!')
      setReviewForm({ rating: 0, comment: '' })
    } catch (err) { toast.error(err || 'Failed to submit review') }
    finally { setSubmittingReview(false) }
  }

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="page-container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* Image & YouTube Preview Carousel */}
        <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 aspect-[4/3] bg-stone-100 dark:bg-stone-800 flex items-center justify-center group">
          {activeMediaIndex === 0 ? (
            <img
              src={product.imageUrl || product.image || 'https://placehold.co/600x450?text=No+Image'}
              alt={product.title}
              className={`w-full h-full object-contain ${product.youtubeUrl ? 'cursor-pointer' : ''}`}
              onClick={() => product.youtubeUrl && setActiveMediaIndex(1)}
              title={product.youtubeUrl ? "Click to view video" : ""}
            />
          ) : (
            product.youtubeUrl && (() => {
              const match = product.youtubeUrl.match(/(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
              const youtubeId = match ? match[1] : '';
              return youtubeId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                  title="YouTube video preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : null;
            })()
          )}
          
          {product.youtubeUrl && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveMediaIndex(prev => prev === 0 ? 1 : 0) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-stone-800 dark:text-white hover:bg-white dark:hover:bg-black shadow-lg backdrop-blur-sm z-10"
              >
                ←
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveMediaIndex(prev => prev === 0 ? 1 : 0) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-stone-800 dark:text-white hover:bg-white dark:hover:bg-black shadow-lg backdrop-blur-sm z-10"
              >
                →
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                <button onClick={() => setActiveMediaIndex(0)} className={`w-2 h-2 rounded-full transition-all duration-300 ${activeMediaIndex === 0 ? 'bg-brand-500 w-6' : 'bg-stone-400 dark:bg-stone-600'}`} />
                <button onClick={() => setActiveMediaIndex(1)} className={`w-2 h-2 rounded-full transition-all duration-300 ${activeMediaIndex === 1 ? 'bg-brand-500 w-6' : 'bg-stone-400 dark:bg-stone-600'}`} />
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">{product.category}</span>
            {discount > 0 && <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">{discount}% OFF</span>}
          </div>
          
          <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-white mb-3">{product.title}</h1>

          {/* Creator Info */}
          {product.createdBy && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-100 dark:border-stone-800 w-fit">
              <img 
                src={product.createdBy.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.createdBy.name)}&background=8b5cf6&color=fff`} 
                alt={product.createdBy.name} 
                className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-700"
              />
              <div className="text-sm">
                <span className="text-stone-500">Created by </span>
                <span className="font-semibold text-stone-900 dark:text-white">{product.createdBy.name}</span>
              </div>
            </div>
          )}

          {/* Rating summary */}
          <div className="flex items-center gap-3 mb-4">
            <StarRating value={Math.round(product.averageRating || 0)} readOnly />
            <span className="text-sm text-stone-500">({product.numReviews || 0} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-4xl font-bold text-stone-900 dark:text-white">₹{product.price?.toLocaleString('en-IN')}</span>
            {product.originalPrice > product.price && (
              <span className="text-xl text-stone-400 line-through">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
            )}
          </div>

          <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-6">{product.description}</p>

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-full">#{tag}</span>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <FiShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
            <button onClick={handleWishlist} className={`p-3 rounded-lg border transition-colors ${isWishlisted ? 'bg-red-500 border-red-500 text-white' : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-red-400 hover:text-red-500'}`}>
              <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 mt-6 py-4 border-y border-stone-100 dark:border-stone-800/80">
            <div className="flex flex-col items-center justify-center text-center gap-1.5 p-2">
              <FiLock className="w-5 h-5 text-brand-500" />
              <span className="text-[10px] sm:text-xs font-medium text-stone-600 dark:text-stone-400">Secure Checkout</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-1.5 p-2">
              <FiZap className="w-5 h-5 text-amber-500" />
              <span className="text-[10px] sm:text-xs font-medium text-stone-600 dark:text-stone-400">Instant Delivery</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-1.5 p-2">
              <FiShield className="w-5 h-5 text-emerald-500" />
              <span className="text-[10px] sm:text-xs font-medium text-stone-600 dark:text-stone-400">Verified Quality</span>
            </div>
          </div>

          {hasPurchased && (
            <a href={product.fileUrl} download className="mt-3 btn-secondary w-full flex items-center justify-center gap-2 text-green-600 border-green-500">
              <FiDownload className="w-4 h-4" /> Download Your File
            </a>
          )}

          <div className="mt-4 text-xs text-stone-400 dark:text-stone-500">Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200 dark:border-stone-800 mb-6">
        <div className="flex gap-6">
          {['description', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${activeTab === tab ? 'border-brand-500 text-brand-500' : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}>
              {tab} {tab === 'reviews' && `(${product.reviews?.length || 0})`}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'description' && (
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{product.description}</p>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Review form */}
          {isAuthenticated && (
            <div className="card p-6">
              <h3 className="font-semibold text-stone-900 dark:text-white mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm text-stone-600 dark:text-stone-400 mb-2">Your Rating</label>
                  <StarRating value={reviewForm.rating} onChange={r => setReviewForm(f => ({ ...f, rating: r }))} size="lg" />
                </div>
                <div>
                  <label className="block text-sm text-stone-600 dark:text-stone-400 mb-2">Your Review</label>
                  <textarea value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} rows={3}
                    className="input-field resize-none" placeholder="Share your experience..." required />
                </div>
                <button type="submit" disabled={submittingReview} className="btn-primary">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}

          {/* Reviews list */}
          {product.reviews?.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((review, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                        <FiUser className="w-4 h-4 text-brand-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-900 dark:text-white">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-xs text-stone-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <StarRating value={review.rating} readOnly size="sm" />
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-400">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiStar className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
              <p className="text-stone-500 dark:text-stone-400">No reviews yet. Be the first!</p>
            </div>
          )}
        </div>
      )}

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-20 pt-16 border-t border-stone-200 dark:border-stone-800">
          <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-white mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
