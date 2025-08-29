import Image from 'next/image';
import { hasFlag } from 'country-flag-icons';
import { getCountryData } from 'countries-list';

interface CountryFlagProps {
  countryCode: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-3',
  md: 'w-6 h-4',
  lg: 'w-8 h-6'
};

export function CountryFlag({ 
  countryCode, 
  size = 'md',
  className = '' 
}: CountryFlagProps) {
  const doesItHaveFlag = hasFlag(countryCode);

  const country = getCountryData(countryCode as any);

  const countryName = country?.name;

  if (!doesItHaveFlag) {
    return null;
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <Image
        alt={countryName || `Flag of ${countryCode}`}
        src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`}
        fill
        className="object-cover rounded-[2px]"
        title={countryName}
      />
    </div>
  );
}
