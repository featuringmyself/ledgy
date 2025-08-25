"use client";

import { formatCurrency } from '@/lib/currency';

interface CurrencyDisplayProps {
  amount: number;
  currency: string;
  locale?: string;
  className?: string;
  showCode?: boolean;
  convertedAmount?: number;
  convertedCurrency?: string;
}

export default function CurrencyDisplay({
  amount,
  currency,
  locale = 'en-US',
  className = '',
  showCode = false,
  convertedAmount,
  convertedCurrency
}: CurrencyDisplayProps) {
  const formattedAmount = formatCurrency(amount, currency, locale);
  
  return (
    <div className={className}>
      <span className="font-medium">
        {formattedAmount}
        {showCode && ` ${currency}`}
      </span>
      {convertedAmount && convertedCurrency && convertedCurrency !== currency && (
        <div className="text-sm text-gray-500 mt-1">
          ≈ {formatCurrency(convertedAmount, convertedCurrency, locale)}
          {showCode && ` ${convertedCurrency}`}
        </div>
      )}
    </div>
  );
}