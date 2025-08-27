"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  useLogo?: boolean; // Si true, utilise le logo app au lieu de l'icône Package
}

export function ProductImage({ 
  src, 
  alt, 
  className, 
  fallbackClassName,
  useLogo = false 
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Si pas d'URL ou erreur de chargement, afficher le fallback
  if (!src || hasError) {
    return (
      <div className={cn(
        "bg-muted rounded-lg flex items-center justify-center",
        fallbackClassName,
        className
      )}>
        {useLogo ? (
          <img
            src="/images/svg/icon_logo.svg"
            alt="Logo Rexel"
            className="w-6 h-6 opacity-50"
          />
        ) : (
          <Package className="w-6 h-6 text-muted-foreground" />
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className={cn(
          "absolute inset-0 bg-muted rounded-lg flex items-center justify-center",
          fallbackClassName
        )}>
          {useLogo ? (
            <img
              src="/images/svg/icon_logo.svg"
              alt="Logo Rexel"
              className="w-6 h-6 opacity-50"
            />
          ) : (
            <Package className="w-6 h-6 text-muted-foreground animate-pulse" />
          )}
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover rounded-lg transition-opacity",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
