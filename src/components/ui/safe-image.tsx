"use client"

import { useState, useEffect } from 'react'
import { Logo } from '@/components/ui/logo'

interface SafeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
  showLogoOnError?: boolean
  logoClassName?: string
}

// Fonction pour valider une URL
const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false
  
  try {
    // Vérifier si c'est une URL valide
    new URL(url)
    return true
  } catch {
    // Si ce n'est pas une URL valide, vérifier si c'est un chemin relatif valide
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('../')
  }
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackSrc = '/placeholder.png',
  showLogoOnError = true,
  logoClassName = 'w-full h-full object-contain',
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [currentSrc, setCurrentSrc] = useState(src)

  // Reset states when src changes
  useEffect(() => {
    setImageError(false)
    setImageLoading(true)
    setCurrentSrc(src)
  }, [src])

  const handleError = () => {
    setImageError(true)
    setImageLoading(false)
    
    // Try fallback if available and different from current
    if (fallbackSrc && fallbackSrc !== currentSrc && !imageError) {
      setCurrentSrc(fallbackSrc)
      setImageError(false)
      setImageLoading(true)
    }
  }

  const handleLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  // Si pas d'URL, URL vide, ou URL invalide, afficher directement le logo
  if (!src || src.trim() === '' || !isValidUrl(src)) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <Logo className={logoClassName} size='sm' showText={false} />
      </div>
    )
  }

  // Si l'image a échoué et qu'on veut afficher le logo
  if (imageError && showLogoOnError) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <Logo className={logoClassName} size='sm' showText={false} />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading state */}
      {imageLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-muted ${className}`}>
          <Logo className={logoClassName} size='sm' showText={false} />
        </div>
      )}
      
      {/* Image */}
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  )
}
