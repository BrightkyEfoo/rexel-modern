import Image from "next/image";
import { appConfig } from "@/lib/config/app";

interface LogoProps {
  variant?: "light" | "dark" | "light-plus" | "dark-plus";
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  showText?: boolean;
  className?: string;
}

export function Logo({
  variant = "light",
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-16",
    xxl: "w-44 h-20", // Plus large pour le header/footer
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
    xxl: "text-3xl",
  };

  // Sélectionner le bon logo selon la variante
  // Sur fond sombre (primary), utiliser les variantes claires
  const logoSrc =
    variant === "dark"
      ? "/images/svg/full_logo.svg" // Logo clair sur fond sombre
      : variant === "light-plus"
      ? "/images/svg/full_logo_v2.svg"
      : "/images/svg/full_logo_black.svg"; // Logo sombre sur fond clair

  const iconSrc =
    variant === "dark"
      ? "/images/svg/icon_logo.svg" // Icône claire sur fond sombre
      : variant === "light-plus"
      ? "/images/svg/icon_logo_v2_white.svg"
      : "/images/svg/icon_logo_black.svg"; // Icône sombre sur fond clair

  // Si on utilise le logo long (full_logo), ne pas afficher le texte à côté
  const shouldShowText = showText && !logoSrc.includes("full_logo");

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <Image
          src={showText ? logoSrc : iconSrc}
          alt={`Logo ${appConfig.name}`}
          fill
          className={`object-contain ${sizeClasses[size]}`}
          priority
        />
      </div>
      {shouldShowText && (
        <div className={`font-bold text-primary ${textSizes[size]}`}>
          {appConfig.name}
        </div>
      )}
    </div>
  );
}
