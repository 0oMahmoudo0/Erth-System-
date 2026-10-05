'use client' // Error boundaries must be Client Components

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    // global-error replaces the root layout, so it must include html and body
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          color: '#fff',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          padding: 24,
        }}
      >
        <title>Erth System — Temporary problem</title>
        <div
          style={{
            maxWidth: 420,
            width: '100%',
            border: '2px solid #fff',
            padding: 40,
            textAlign: 'center',
            boxShadow: '12px 12px 0 0 #fff',
          }}
        >
          <h1 style={{ fontSize: 28, fontWeight: 900, textTransform: 'uppercase', margin: '0 0 12px' }}>
            Something went wrong
          </h1>
          <p style={{ opacity: 0.7, fontSize: 14, margin: '0 0 28px' }}>
            Your data is safe. Please try again in a moment.
          </p>
          <button
            id="global-error-retry-button"
            onClick={() => retry()}
            style={{
              background: '#fff',
              color: '#000',
              border: 'none',
              padding: '14px 28px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: 2,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: 28, fontSize: 10, opacity: 0.4, fontFamily: 'monospace' }}>
              Ref: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
