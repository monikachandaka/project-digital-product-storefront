import { useState } from 'react'
import { FiStar } from 'react-icons/fi'

export default function StarRating({ value = 0, onChange, size = 'md', readOnly = false }) {
  const [hovered, setHovered] = useState(0)
  const sizes = { sm: 'w-3 h-3', md: 'w-5 h-5', lg: 'w-7 h-7' }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={`transition-colors duration-100 ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}`}
        >
          <FiStar
            className={`${sizes[size]} ${
              star <= (hovered || value)
                ? 'text-amber-400 fill-current'
                : 'text-stone-300 dark:text-stone-600'
            }`}
          />
        </button>
      ))}
    </div>
  )
}
