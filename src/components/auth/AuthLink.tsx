'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect';

interface AuthLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AuthLink({ href, children, className, onClick }: AuthLinkProps) {
  const pathname = usePathname();
  const { saveCurrentUrl } = useAuthRedirect();

  const handleClick = () => {
    // Sauvegarder l'URL actuelle avant d'aller vers auth
    saveCurrentUrl(pathname);
    
    // Appeler le onClick custom si fourni
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
