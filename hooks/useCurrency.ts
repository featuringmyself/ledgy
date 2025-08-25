"use client";

import { useState, useEffect } from 'react';
import { convertAmount } from '@/lib/exchange-rates';

interface UseCurrencyConversionProps {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  date?: Date;
}

interface CurrencyConversionResult {
  convertedAmount: number;
  exchangeRate: number;
  isLoading: boolean;
  error: string | null;
}

export function useCurrencyConversion({
  amount,
  fromCurrency,
  toCurrency,
  date
}: UseCurrencyConversionProps): CurrencyConversionResult {
  const [convertedAmount, setConvertedAmount] = useState(amount);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setConvertedAmount(amount);
      setExchangeRate(1);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchConversion = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await convertAmount(amount, fromCurrency, toCurrency, date);
        setConvertedAmount(result.convertedAmount);
        setExchangeRate(result.exchangeRate);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Conversion failed');
        setConvertedAmount(amount);
        setExchangeRate(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversion();
  }, [amount, fromCurrency, toCurrency, date]);

  return {
    convertedAmount,
    exchangeRate,
    isLoading,
    error
  };
}

export function useExchangeRate(fromCurrency: string, toCurrency: string, date?: Date) {
  const [rate, setRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setRate(1);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchRate = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/exchange-rates?from=${fromCurrency}&to=${toCurrency}${
            date ? `&date=${date.toISOString()}` : ''
          }`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch exchange rate');
        }

        const data = await response.json();
        setRate(data.rate);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rate');
        setRate(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();
  }, [fromCurrency, toCurrency, date]);

  return { rate, isLoading, error };
}