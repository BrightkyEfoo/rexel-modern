"use client"

import { Check, AlertCircle, Info, Clock, Shield, Zap, FileText, Wrench } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ProductAdditionalInfo, AdditionalInfoSection } from "@/lib/types/product-additional-info"

interface ProductAdditionalInfoProps {
  additionalInfo: ProductAdditionalInfo | null
  className?: string
}

export function ProductAdditionalInfo({ additionalInfo, className = "" }: ProductAdditionalInfoProps) {
  if (!additionalInfo || !additionalInfo.sections || additionalInfo.sections.length === 0) {
    return (
      <div className={`text-center py-8 text-muted-foreground ${className}`}>
        Aucune information supplémentaire disponible pour ce produit
      </div>
    )
  }

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'check': return Check
      case 'alert': return AlertCircle
      case 'info': return Info
      case 'clock': return Clock
      case 'shield': return Shield
      case 'zap': return Zap
      case 'file': return FileText
      case 'wrench': return Wrench
      default: return Check
    }
  }

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'success': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      case 'info': return 'text-blue-600'
      default: return 'text-muted-foreground'
    }
  }

  const getBadgeVariant = (color?: string) => {
    switch (color) {
      case 'success': return 'default' as const
      case 'warning': return 'secondary' as const
      case 'error': return 'destructive' as const
      case 'info': return 'outline' as const
      default: return 'secondary' as const
    }
  }

  const renderSection = (section: AdditionalInfoSection) => {
    const IconComponent = getIcon()

    switch (section.type) {
      case 'list':
        return (
          <div className="space-y-3">
            {section.subtitle && (
              <p className="text-sm text-muted-foreground">{section.subtitle}</p>
            )}
            <div className="grid md:grid-cols-2 gap-3">
              {section.items?.map((item, index) => {
                const ItemIcon = getIcon(item.icon)
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <ItemIcon className={`w-4 h-4 ${getColorClasses(item.color)}`} />
                    <span className="text-sm">{item.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="space-y-3">
            {section.subtitle && (
              <p className="text-sm text-muted-foreground">{section.subtitle}</p>
            )}
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </div>
          </div>
        )

      case 'steps':
        return (
          <div className="space-y-3">
            {section.subtitle && (
              <p className="text-sm text-muted-foreground">{section.subtitle}</p>
            )}
            <div className="space-y-3">
              {section.items?.map((item, index) => {
                const StepIcon = getIcon(item.icon)
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <Badge variant="outline" className="flex-shrink-0 w-6 h-6 p-0 flex items-center justify-center text-xs">
                      {index + 1}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <StepIcon className={`w-4 h-4 ${getColorClasses(item.color)}`} />
                      <span className="text-sm">{item.text}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'warnings':
        return (
          <div className="space-y-3">
            {section.subtitle && (
              <p className="text-sm text-muted-foreground">{section.subtitle}</p>
            )}
            <div className="space-y-2">
              {section.items?.map((item, index) => {
                const WarningIcon = getIcon(item.icon)
                return (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <WarningIcon className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">{item.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'tips':
        return (
          <div className="space-y-3">
            {section.subtitle && (
              <p className="text-sm text-muted-foreground">{section.subtitle}</p>
            )}
            <div className="space-y-2">
              {section.items?.map((item, index) => {
                const TipIcon = getIcon(item.icon)
                return (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <TipIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800">{item.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Trier les sections par ordre
  const sortedSections = [...additionalInfo.sections].sort((a, b) => a.order - b.order)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{additionalInfo.title}</h2>
        {additionalInfo.subtitle && (
          <p className="text-muted-foreground">{additionalInfo.subtitle}</p>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sortedSections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderSection(section)}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
