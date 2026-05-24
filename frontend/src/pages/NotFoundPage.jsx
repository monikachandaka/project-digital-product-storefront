import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center text-center px-4">
      <div>
        <p className="font-mono text-8xl font-bold gradient-text mb-4">404</p>
        <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-white mb-3">Page Not Found</h1>
        <p className="text-stone-500 dark:text-stone-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary px-8 py-3">Back to Home</Link>
      </div>
    </div>
  )
}
