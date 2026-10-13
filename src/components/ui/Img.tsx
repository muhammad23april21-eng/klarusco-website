import { useState, type ImgHTMLAttributes } from 'react'

/**
 * Image with a graceful fallback: if the file fails to load, a branded
 * forest-green surface with fine ledger lines is shown instead of a broken icon.
 */
export function Img({ className, alt, loading = 'lazy', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return <span className={`img-fallback ${className ?? ''}`} role="img" aria-label={alt} />
  }
  return (
    <img
      {...props}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
