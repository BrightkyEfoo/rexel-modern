"use client";

import { CookieConsentProvider } from "@/lib/providers/cookie-consent-provider";

interface CookieConsentWrapperProps {
  children: React.ReactNode;
}

export function CookieConsentWrapper({ children }: CookieConsentWrapperProps) {
  return (
    <CookieConsentProvider
      showBanner={true}
      bannerPosition="bottom"
      bannerTheme="light"
    >
      {children}
    </CookieConsentProvider>
  );
}
