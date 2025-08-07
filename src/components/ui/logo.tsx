import Image from 'next/image';
import { appConfig } from '@/lib/config/app';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ variant = 'light', size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const logoSrc = variant === 'light' ? '/rexel-without-bg.png' : '/rexel.jpeg';

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Logo KESI I MARKET en SVG */}
        <Image
          src={logoSrc}
          alt="Logo"
          // width={sizes[size]}
          // height={sizes[size]}
          fill
          className={`${sizeClasses[size]}`}
        />
      </div>
      {showText && (
        <div className={`font-bold text-primary ${textSizes[size]}`}>
          {appConfig.name}
        </div>
      )}
    </div>
  );
} 