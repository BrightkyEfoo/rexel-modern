/**
 * Currency utility functions
 * Uses environment variables for currency configuration
 */

// Get currency symbol from environment variable
export const getCurrencySymbol = (): string => {
  return process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "XAF";
};

// Get currency code from environment variable
export const getCurrencyCode = (): string => {
  return process.env.NEXT_PUBLIC_CURRENCY_CODE || "XAF";
};

// Get currency name from environment variable
export const getCurrencyName = (): string => {
  return process.env.NEXT_PUBLIC_CURRENCY_NAME || "Franc CFA";
};

// Format price with currency symbol
export const formatPrice = (
  price: number | string,
  options?: {
    showSymbol?: boolean;
    showCode?: boolean;
    decimals?: number;
  }
): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  const symbol = getCurrencySymbol();
  const code = getCurrencyCode();
  const decimals = options?.decimals ?? 2;

  const formattedPrice = numPrice
    ?.toFixed(decimals)
    .replace(".00", "")
    .replace(".", ",");

  if (options?.showCode) {
    return `${formattedPrice} ${code}`;
  }

  if (options?.showSymbol === false) {
    return formattedPrice;
  }

  return `${formattedPrice} ${symbol}`;
};

// Format price range
export const formatPriceRange = (
  minPrice: number,
  maxPrice: number,
  options?: {
    showSymbol?: boolean;
    showCode?: boolean;
    decimals?: number;
  }
): string => {
  const min = formatPrice(minPrice, { ...options, showSymbol: false });
  const max = formatPrice(maxPrice, { ...options, showSymbol: false });
  const symbol = getCurrencySymbol();
  const code = getCurrencyCode();

  if (options?.showCode) {
    return `${min} - ${max} ${code}`;
  }

  if (options?.showSymbol === false) {
    return `${min} - ${max}`;
  }

  return `${min}${symbol} - ${max}${symbol}`;
};

// Format discount amount
export const formatDiscount = (
  amount: number,
  options?: {
    showSymbol?: boolean;
    showCode?: boolean;
    decimals?: number;
  }
): string => {
  const symbol = getCurrencySymbol();
  const code = getCurrencyCode();
  const decimals = options?.decimals ?? 2;

  const formattedAmount = Math.abs(amount).toFixed(decimals);

  if (options?.showCode) {
    return `-${formattedAmount} ${code}`;
  }

  if (options?.showSymbol === false) {
    return `-${formattedAmount}`;
  }

  return `-${formattedAmount}${symbol}`;
};
