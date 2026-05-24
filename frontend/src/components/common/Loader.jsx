export default function Loader({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} border-4 border-stone-200 dark:border-stone-700 border-t-brand-500 rounded-full animate-spin`} />
      {text && <p className="text-sm text-stone-500 dark:text-stone-400">{text}</p>}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 rounded w-3/4" />
        <div className="skeleton h-3 rounded w-full" />
        <div className="skeleton h-3 rounded w-5/6" />
        <div className="flex justify-between items-center pt-2">
          <div className="skeleton h-6 rounded w-16" />
          <div className="skeleton h-8 rounded w-16" />
        </div>
      </div>
    </div>
  )
}
