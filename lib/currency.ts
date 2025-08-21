export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return `${currency} ${amount.toLocaleString()}`;
}

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'CHF': 'CHF',
    'CNY': '¥',
    'INR': '₹',
  };
  
  return symbols[currency] || currency;
}