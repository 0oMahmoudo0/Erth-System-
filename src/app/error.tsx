'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md border-2 border-current p-8 md:p-10 text-center shadow-[12px_12px_0px_0px_currentColor]">
        <p className="font-mono text-xs tracking-widest opacity-60 uppercase mb-3">
          Temporary problem
        </p>
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">
          Something went wrong
        </h1>
        <p className="text-sm opacity-70 mb-8">
          Your data is safe. This is usually a short connection issue — please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            id="error-retry-button"
            onClick={() => retry()}
            className="px-6 py-3 font-black uppercase tracking-widest text-sm border-2 border-current hover:opacity-80 transition-opacity cursor-pointer"
          >
            Try again
          </button>
          <Link
            id="error-home-link"
            href="/"
            className="px-6 py-3 font-mono uppercase tracking-widest text-sm opacity-70 hover:opacity-100 hover:underline"
          >
            Go home
          </Link>
        </div>
        {error.digest && (
          <p className="mt-8 font-mono text-[10px] opacity-40">Ref: {error.digest}</p>
        )}
      </div>
    </main>
  )
}
