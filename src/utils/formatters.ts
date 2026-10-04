import { CurrencyCode } from '../types/finance';

export const CURRENCY_MAP: Record<CurrencyCode, { symbol: string; locale: string; name: string }> = {
  INR: { symbol: '₹', locale: 'en-IN', name: 'Indian Rupee (₹)' },
  USD: { symbol: '$', locale: 'en-US', name: 'US Dollar ($)' },
  EUR: { symbol: '€', locale: 'en-IE', name: 'Euro (€)' },
  GBP: { symbol: '£', locale: 'en-GB', name: 'British Pound (£)' }
};

export const formatCurrency = (
  val: number, 
  currency: CurrencyCode = 'INR', 
  maximumFractionDigits = 2
): string => {
  const config = CURRENCY_MAP[currency] || CURRENCY_MAP.INR;
  const isZeroDecimals = maximumFractionDigits === 0;

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits,
      minimumFractionDigits: isZeroDecimals ? 0 : 2
    }).format(val || 0);
  } catch (err) {
    // Fallback if Intl fails
    const numStr = (val || 0).toFixed(maximumFractionDigits);
    return `${config.symbol}${numStr}`;
  }
};

export const formatDate = (dateStr: string, options?: Intl.DateTimeFormatOptions): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
    return d.toLocaleDateString('en-IN', options || {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const formatRelativeTime = (dateStr: string): string => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateStr);
};
