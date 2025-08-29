"use client"

import { useState } from 'react'
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
  const [currentSrc, setCurrentSrc] = useState(src)

  const handleError = () => {
    if (!imageError) {
      setImageError(true)
      if (fallbackSrc && fallbackSrc !== currentSrc) {
        setCurrentSrc(fallbackSrc)
      }
    }
  }

  // Si l'image a échoué et qu'on veut afficher le logo
  if (imageError && showLogoOnError) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <Logo className={logoClassName} size='xxl' showText={false} />
      </div>
    )
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  )
}
