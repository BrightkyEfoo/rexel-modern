import Link from "next/link";
import { ArrowRight, Check, Settings, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SERVICE_GROUPS, type ServiceCategory } from "@/types/services";

interface ServiceCardProps {
  service: {
    id: string | number;
    slug: string;
    name: string;
    shortDescription: string;
    category: ServiceCategory;
    features?: string[];
    pricing?: string;
    popular?: boolean;
  };
  size?: 'default' | 'large' | 'xlarge';
  serviceIcons: Record<string, LucideIcon>;
}

export function ServiceCard({
  service,
  size = 'default',
  serviceIcons,
}: ServiceCardProps) {
  const IconComponent = serviceIcons[service.slug] || Settings;
  const group = SERVICE_GROUPS[service.category];

  const sizeClasses = {
    default: '',
    large: 'lg:col-span-2',
    xlarge: 'col-span-full',
  };

  return (
    <div
      className={`group relative bg-gradient-to-br from-secondary to-background rounded-2xl p-6 border hover:shadow-lg transition-all duration-300 flex flex-col justify-between ${
        sizeClasses[size]
      }`}
      style={{ borderTopWidth: '4px', borderTopColor: group?.color || '#3B82F6' }}
    >
      <div>
        {/* Service badge */}
        <div className="flex items-center justify-between mb-6">
          <Badge
            variant="secondary"
            className="text-xs"
            style={{ backgroundColor: `${group?.color}20`, color: group?.color }}
          >
            {group?.name || 'Service KesiMarket'}
          </Badge>
          {service.popular && (
            <Badge
              className="text-white text-xs"
              style={{ backgroundColor: group?.color }}
            >
              Populaire
            </Badge>
          )}
        </div>

        {/* Service header */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="relative flex-shrink-0">
            <div
              className="w-14 h-14 rounded-xl shadow-sm border flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
              style={{ backgroundColor: `${group?.color}10` }}
            >
              <IconComponent className="w-7 h-7" style={{ color: group?.color }} />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {service.name}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {service.shortDescription}
            </p>
          </div>
        </div>
      </div>

      <div>
        {/* Service features */}
        {service.features && service.features.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {service.features.slice(0, 3).map((feature, featureIndex) => (
                <div
                  key={featureIndex}
                  className="flex items-center space-x-1 text-xs text-muted-foreground bg-background rounded-full px-3 py-1 border"
                >
                  <Check className="w-3 h-3" style={{ color: group?.color }} />
                  <span className="line-clamp-1">{typeof feature === 'string' ? feature : feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="group/btn"
            style={{ borderColor: group?.color, color: group?.color }}
            asChild
          >
            <Link href={`/services/${service.slug}`}>
              Découvrir
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>

          {/* Pricing indicator */}
          {service.pricing && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium" style={{ color: group?.color }}>
                {service.pricing}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hover effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${group?.color}05 0%, transparent 50%, ${group?.color}05 100%)`
        }}
      />
    </div>
  );
}
