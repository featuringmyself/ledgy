"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import CurrencySelector from './CurrencySelector';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';

interface UserCurrencySettingsProps {
  onCurrencyChange?: (currency: string) => void;
  className?: string;
}

export default function UserCurrencySettings({ 
  onCurrencyChange, 
  className = "" 
}: UserCurrencySettingsProps) {
  const { user } = useUser();
  const [defaultCurrency, setDefaultCurrency] = useState('INR');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Load user's current currency preference
  useEffect(() => {
    const loadUserCurrency = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/user/currency');
        if (response.ok) {
          const data = await response.json();
          setDefaultCurrency(data.defaultCurrency || 'INR');
        }
      } catch (error) {
        console.error('Failed to load user currency:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserCurrency();
  }, [user?.id]);

  const handleCurrencyChange = async (newCurrency: string) => {
    if (!user?.id) return;

    setDefaultCurrency(newCurrency);
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/user/currency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ defaultCurrency: newCurrency }),
      });

      if (response.ok) {
        setMessage('Currency preference saved successfully!');
        onCurrencyChange?.(newCurrency);
        
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to save currency preference');
      }
    } catch (error) {
      console.error('Error saving currency:', error);
      setMessage('Failed to save currency preference. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
        <p className="text-sm text-gray-600">Please sign in to set currency preferences.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Default Currency
        </label>
        <p className="text-xs text-gray-500 mb-3">
          This will be used as your base currency for all financial calculations and reports.
        </p>
        
        {isLoading ? (
          <div className="animate-pulse bg-gray-200 h-10 rounded-md"></div>
        ) : (
          <CurrencySelector
            value={defaultCurrency}
            onChange={handleCurrencyChange}
            disabled={isSaving}
            className="max-w-xs"
          />
        )}
      </div>

      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.includes('successfully') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {isSaving && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Saving currency preference...</span>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p className="font-medium mb-1">Supported Currencies:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
          {SUPPORTED_CURRENCIES.slice(0, 12).map((currency) => (
            <span key={currency.code} className="flex items-center space-x-1">
              <span>{currency.symbol}</span>
              <span>{currency.code}</span>
            </span>
          ))}
        </div>
        <p className="mt-2">And {SUPPORTED_CURRENCIES.length - 12} more currencies...</p>
      </div>
    </div>
  );
}