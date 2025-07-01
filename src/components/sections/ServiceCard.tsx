import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Settings, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    features?: string[];
    link: string;
  };
  size?: 'default' | 'large' | 'xlarge';
  serviceIcons: Record<string, LucideIcon>;
}

export function ServiceCard({
  service,
  size = 'default',
  serviceIcons,
}: ServiceCardProps) {
  const IconComponent =
    serviceIcons[service.name as keyof typeof serviceIcons] || Settings;

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
    >
      <div>
        {/* Service badge */}
        <div className="flex items-center justify-between mb-6">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/20"
          >
            Solution Rexel
          </Badge>
          {service.name === "Open" && (
            <Badge
              variant="outline"
              className="border-green-200 text-green-700"
            >
              Éco-responsable
            </Badge>
          )}
          {service.name === "Freshmile" && (
            <Badge variant="outline" className="border-primary/20 text-primary">
              Électromobilité
            </Badge>
          )}
          {service.name === "Safir" && (
            <Badge
              variant="outline"
              className="border-orange-200 text-orange-700"
            >
              RGE
            </Badge>
          )}
        </div>

        {/* Service header */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 bg-background rounded-xl shadow-sm border flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              {service.imageUrl ? (
                <Image
                  src={service.imageUrl}
                  alt={`Logo ${service.name}`}
                  width={40}
                  height={40}
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const fallback = document.createElement("div");
                    fallback.className = "w-8 h-8 text-primary";
                    target.style.display = "none";
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              ) : (
                <IconComponent className="w-8 h-8 text-primary" />
              )}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {service.name}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>
      </div>

      <div>
        {/* Service features */}
        {service.features && service.features.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {service.features.map((feature, featureIndex) => (
                <div
                  key={featureIndex}
                  className="flex items-center space-x-1 text-xs text-muted-foreground bg-background rounded-full px-3 py-1 border"
                >
                  <Check className="w-3 h-3 text-green-500" />
                  <span>{feature}</span>
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
            className="group/btn border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            asChild
          >
            <Link href={service.link}>
              Découvrir {service.name}
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>

          {/* Service indicator */}
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Service actif</span>
          </div>
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
