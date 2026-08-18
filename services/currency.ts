/**
 * Currency conversion service (mocked estimates).
 * Real deployment would call an official/verified FX endpoint.
 */

export type Currency = 'EUR' | 'USD' | 'GBP' | 'CAD' | 'AED';

// Estimated rates: 1 DZD ≈ X foreign currency
const RATES: Record<Currency, number> = {
  EUR: 0.0069,
  USD: 0.0075,
  GBP: 0.0059,
  CAD: 0.0103,
  AED: 0.0275,
};

const SYMBOLS: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  CAD: 'C$',
  AED: 'AED',
};

export function convertFromDZD(amount: number, currency: Currency): number {
  const rate = RATES[currency] ?? RATES.EUR;
  return amount * rate;
}

export function formatDZD(amount: number): string {
  return `${Math.round(amount).toLocaleString('en-US')} DZD`;
}

export function formatForeign(amount: number, currency: Currency): string {
  const value = convertFromDZD(amount, currency);
  const symbol = SYMBOLS[currency];
  const formatted = value.toFixed(2);
  return `${symbol} ${formatted}`;
}

export function estimateLabel(amount: number, currency: Currency): string {
  return `≈ ${formatForeign(amount, currency)}`;
}

export const supportedCurrencies: { code: Currency; label: string; flag: string }[] = [
  { code: 'EUR', label: 'Euro', flag: '🇪🇺' },
  { code: 'USD', label: 'US Dollar', flag: '🇺🇸' },
  { code: 'GBP', label: 'British Pound', flag: '🇬🇧' },
  { code: 'CAD', label: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AED', label: 'UAE Dirham', flag: '🇦🇪' },
];
