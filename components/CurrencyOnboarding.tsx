"use client";

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import CurrencySelector from './CurrencySelector';
import { SUPPORTED_CURRENCIES, getCurrencySymbol } from '@/lib/currency';

interface CurrencyOnboardingProps {
  onComplete: (currency: string) => void;
  onSkip?: () => void;
  className?: string;
}

export default function CurrencyOnboarding({ 
  onComplete, 
  onSkip, 
  className = "" 
}: CurrencyOnboardingProps) {
  const { user } = useUser();
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/currency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ defaultCurrency: selectedCurrency }),
      });

      if (response.ok) {
        onComplete(selectedCurrency);
      } else {
        throw new Error('Failed to save currency preference');
      }
    } catch (error) {
      console.error('Error saving currency:', error);
      // Still call onComplete to not block the user
      onComplete(selectedCurrency);
    } finally {
      setIsLoading(false);
    }
  };

  const popularCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD'];

  return (
    <div className={`max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">{getCurrencySymbol(selectedCurrency)}</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Set Your Default Currency
        </h2>
        <p className="text-sm text-gray-600">
          Choose your preferred currency for invoices, payments, and financial reports.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Currency
          </label>
          <CurrencySelector
            value={selectedCurrency}
            onChange={setSelectedCurrency}
            disabled={isLoading}
          />
        </div>

        <div>
          <p className="text-xs font-medium text-gray-700 mb-2">Popular choices:</p>
          <div className="flex flex-wrap gap-2">
            {popularCurrencies.map((currency) => {
              const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency);
              return (
                <button
                  key={currency}
                  onClick={() => setSelectedCurrency(currency)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    selectedCurrency === currency
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {currencyInfo?.symbol} {currency}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={handleComplete}
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Setting up...</span>
              </div>
            ) : (
              `Continue with ${selectedCurrency}`
            )}
          </button>

          {onSkip && (
            <button
              onClick={onSkip}
              disabled={isLoading}
              className="w-full text-gray-500 py-2 px-4 text-sm hover:text-gray-700 transition-colors"
            >
              Skip for now
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 p-3 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> You can change this anytime in your settings. 
          All amounts will be stored in your chosen currency and converted when needed.
        </p>
      </div>
    </div>
  );
}