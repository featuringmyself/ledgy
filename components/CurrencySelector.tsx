"use client";

import { useState } from 'react';
import { SUPPORTED_CURRENCIES, getCurrencySymbol } from '@/lib/currency';

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function CurrencySelector({ 
  value, 
  onChange, 
  className = "",
  disabled = false 
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCurrencies = SUPPORTED_CURRENCIES.filter(currency =>
    currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCurrency = SUPPORTED_CURRENCIES.find(c => c.code === value);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium">{getCurrencySymbol(value)}</span>
          <span>{value}</span>
          {selectedCurrency && (
            <span className="text-gray-500 text-xs">{selectedCurrency.name}</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCurrencies.map((currency) => (
              <button
                key={currency.code}
                type="button"
                onClick={() => {
                  onChange(currency.code);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={`w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 ${
                  value === currency.code ? 'bg-muted text-foreground' : ''
                }`}
              >
                <span className="font-medium w-8">{currency.symbol}</span>
                <span className="font-medium w-12">{currency.code}</span>
                <span className="text-sm text-gray-600 flex-1">{currency.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}