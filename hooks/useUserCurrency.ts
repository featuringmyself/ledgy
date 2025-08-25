"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface UseUserCurrencyResult {
  defaultCurrency: string;
  isLoading: boolean;
  error: string | null;
  updateCurrency: (currency: string) => Promise<boolean>;
  isFirstTime: boolean;
}

export function useUserCurrency(): UseUserCurrencyResult {
  const { user, isLoaded } = useUser();
  const [defaultCurrency, setDefaultCurrency] = useState('INR');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    const loadUserCurrency = async () => {
      if (!isLoaded || !user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user/currency');
        
        if (response.status === 404) {
          // User not found in database - first time user
          setIsFirstTime(true);
          setDefaultCurrency('INR');
        } else if (response.ok) {
          const data = await response.json();
          setDefaultCurrency(data.defaultCurrency || 'INR');
          setIsFirstTime(false);
        } else {
          throw new Error('Failed to load currency preference');
        }
      } catch (err) {
        console.error('Error loading user currency:', err);
        setError(err instanceof Error ? err.message : 'Failed to load currency');
        setDefaultCurrency('INR'); // Fallback to INR
      } finally {
        setIsLoading(false);
      }
    };

    loadUserCurrency();
  }, [user?.id, isLoaded]);

  const updateCurrency = async (currency: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const response = await fetch('/api/user/currency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ defaultCurrency: currency }),
      });

      if (response.ok) {
        setDefaultCurrency(currency);
        setIsFirstTime(false);
        setError(null);
        return true;
      } else {
        throw new Error('Failed to update currency preference');
      }
    } catch (err) {
      console.error('Error updating currency:', err);
      setError(err instanceof Error ? err.message : 'Failed to update currency');
      return false;
    }
  };

  return {
    defaultCurrency,
    isLoading,
    error,
    updateCurrency,
    isFirstTime
  };
}