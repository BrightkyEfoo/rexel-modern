"use client"

import { SafeImage } from './safe-image'

export function SafeImageDemo() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Démonstration SafeImage</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Image valide */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Image valide</h3>
          <SafeImage
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
            alt="Image valide"
            width={150}
            height={150}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>

        {/* URL vide */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">URL vide</h3>
          <SafeImage
            src=""
            alt="URL vide"
            width={150}
            height={150}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>

        {/* URL invalide */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">URL invalide</h3>
          <SafeImage
            src="invalid-url"
            alt="URL invalide"
            width={150}
            height={150}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>

        {/* Image qui échoue */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Image qui échoue</h3>
          <SafeImage
            src="https://example.com/nonexistent-image.jpg"
            alt="Image qui échoue"
            width={150}
            height={150}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>

        {/* Chemin relatif valide */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Chemin relatif</h3>
          <SafeImage
            src="/images/svg/icon_logo.svg"
            alt="Logo"
            width={150}
            height={150}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>

        {/* Chemin relatif invalide */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Chemin invalide</h3>
          <SafeImage
            src="/images/nonexistent.jpg"
            alt="Chemin invalide"
            width={150}
            height={150}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>

        {/* URL avec fallback */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Avec fallback</h3>
          <SafeImage
            src="https://example.com/nonexistent.jpg"
            fallbackSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
            alt="Avec fallback"
            width={150}
            height={150}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>

        {/* Sans logo */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Sans logo</h3>
          <SafeImage
            src=""
            alt="Sans logo"
            width={150}
            height={150}
            className="w-full h-32 object-cover rounded-lg"
            showLogoOnError={false}
          />
        </div>
      </div>
    </div>
  )
}
