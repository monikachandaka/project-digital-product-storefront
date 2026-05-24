import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../store/productSlice'
import ProductCard from '../components/products/ProductCard'
import ProductFilters from '../components/products/ProductFilters'
import { SkeletonCard } from '../components/common/Loader'
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const SORT_OPTIONS = [
  { label: 'Newest', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Top Rated', value: '-averageRating' },
  { label: 'Most Popular', value: '-numReviews' },
]

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()
  const { products, loading, totalProducts, totalPages, currentPage } = useSelector(s => s.products)
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || '-createdAt',
    search: searchParams.get('search') || '',
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
  })

  useEffect(() => {
    const params = {}
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
    setSearchParams(params)
    dispatch(fetchProducts(filters))
  }, [filters, dispatch])

  const handleSearch = e => {
    e.preventDefault()
    setFilters(f => ({ ...f, search: searchInput, page: 1 }))
  }

  const handleFilterChange = newFilters => setFilters(newFilters)

  return (
    <div className="page-container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-2">All Products</h1>
        <p className="text-stone-500 dark:text-stone-400">{totalProducts} products available</p>
      </div>

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary px-4">Search</button>
          {filters.search && (
            <button type="button" onClick={() => { setSearchInput(''); setFilters(f => ({ ...f, search: '', page: 1 })) }} className="btn-ghost px-3">
              <FiX className="w-4 h-4" />
            </button>
          )}
        </form>
        <select value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value, page: 1 }))}
          className="input-field w-full sm:w-52">
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2 lg:hidden">
          <FiFilter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters – desktop */}
        <div className="hidden lg:block w-56 shrink-0">
          <div className="card p-5 sticky top-20">
            <ProductFilters filters={filters} onChange={handleFilterChange} onClose={() => {}} />
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="relative bg-white dark:bg-stone-900 w-72 h-full overflow-y-auto p-5 animate-slide-up">
              <ProductFilters filters={filters} onChange={f => { handleFilterChange(f); setShowFilters(false) }} onClose={() => setShowFilters(false)} />
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button disabled={currentPage <= 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))} className="btn-ghost p-2 disabled:opacity-40">
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setFilters(f => ({ ...f, page: p }))}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === currentPage ? 'bg-brand-500 text-white' : 'btn-ghost'}`}>
                      {p}
                    </button>
                  ))}
                  <button disabled={currentPage >= totalPages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))} className="btn-ghost p-2 disabled:opacity-40">
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="font-semibold text-stone-700 dark:text-stone-300 mb-2">No products found</h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
