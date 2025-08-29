"use client"

import * as React from "react"
import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"

interface ProductImageCarouselProps {
  images: string[]
  productName: string
  className?: string
}

export function ProductImageCarousel({ 
  images, 
  productName, 
  className = "" 
}: ProductImageCarouselProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const handlePrevious = () => {
    setSelectedImage(Math.max(0, selectedImage - 1))
  }

  const handleNext = () => {
    setSelectedImage(Math.min(images.length - 1, selectedImage + 1))
  }

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index)
  }

  // Filtrer seulement les images (mimeType: image/*)
  const imageFiles = images.filter(image => image && image.trim() !== '')

  if (imageError || !imageFiles.length) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="relative bg-muted rounded-2xl overflow-hidden aspect-square">
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Logo variant="light" size="lg" showText={false} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image principale */}
      <div className="relative bg-muted rounded-2xl overflow-hidden aspect-square">
        <Image
          src={imageFiles[selectedImage] || '/placeholder.png'}
          alt={`${productName} - Image ${selectedImage + 1}`}
          fill
          className="object-contain p-8"
          onError={handleImageError}
        />

        {/* Navigation */}
        {imageFiles.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={handlePrevious}
              disabled={selectedImage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={handleNext}
              disabled={selectedImage === imageFiles.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Compteur d'images */}
        {imageFiles.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {selectedImage + 1} / {imageFiles.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {imageFiles.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {imageFiles.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-20 h-20 bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index 
                  ? 'border-primary' 
                  : 'border-transparent hover:border-muted-foreground'
              }`}
            >
              <Image
                src={image || '/placeholder.png'}
                alt={`${productName} - Thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="object-contain p-2 w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
