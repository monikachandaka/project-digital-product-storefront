import { FiX } from 'react-icons/fi'

const CATEGORIES = ['eBooks', 'Templates', 'Design Assets', 'Software Tools', 'Study Materials']
const RATINGS = [4, 3, 2, 1]

export default function ProductFilters({ filters, onChange, onClose }) {
  const update = (key, value) => onChange({ ...filters, [key]: value, page: 1 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-stone-900 dark:text-white">Filters</h3>
        <button onClick={onClose} className="lg:hidden btn-ghost p-1"><FiX /></button>
      </div>

      {/* Category */}
      <div>
        <h4 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="category" checked={!filters.category} onChange={() => update('category', '')} className="accent-brand-500" />
            <span className="text-sm text-stone-600 dark:text-stone-400">All Categories</span>
          </label>
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="category" checked={filters.category === cat} onChange={() => update('category', cat)} className="accent-brand-500" />
              <span className="text-sm text-stone-600 dark:text-stone-400">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">Price Range</h4>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-stone-500 mb-1 block">Min ₹{filters.minPrice || 0}</label>
            <input type="range" min="0" max="5000" step="100" value={filters.minPrice || 0}
              onChange={e => update('minPrice', e.target.value)} className="w-full accent-brand-500" />
          </div>
          <div>
            <label className="text-xs text-stone-500 mb-1 block">Max ₹{filters.maxPrice || 5000}</label>
            <input type="range" min="0" max="5000" step="100" value={filters.maxPrice || 5000}
              onChange={e => update('maxPrice', e.target.value)} className="w-full accent-brand-500" />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">Min Rating</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="rating" checked={!filters.rating} onChange={() => update('rating', '')} className="accent-brand-500" />
            <span className="text-sm text-stone-600 dark:text-stone-400">Any Rating</span>
          </label>
          {RATINGS.map(r => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="rating" checked={Number(filters.rating) === r} onChange={() => update('rating', r)} className="accent-brand-500" />
              <span className="text-sm text-stone-600 dark:text-stone-400">{'★'.repeat(r)} & above</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button onClick={() => onChange({ page: 1, limit: 12 })} className="w-full btn-secondary text-sm">
        Reset Filters
      </button>
    </div>
  )
}
