import { PrismaClient } from '@/prisma/app/generated/prisma/client';

const prisma = new PrismaClient();

export interface ExchangeRateResponse {
  success: boolean;
  rates?: Record<string, number>;
  error?: string;
}

// Using exchangerate-api.com v6 API (free tier: 1500 requests/month)
export async function fetchExchangeRatesFromAPI(baseCurrency: string = 'INR'): Promise<ExchangeRateResponse> {
  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;

    // Use v6 API with API key if available, fallback to v4 for development
    const apiUrl = apiKey
      ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`
      : `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle both v4 and v6 response formats
    const rates = data.conversion_rates || data.rates;

    if (!rates) {
      throw new Error('No rates data in API response');
    }

    return {
      success: true,
      rates
    };
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function updateExchangeRates(baseCurrency: string = 'INR'): Promise<boolean> {
  try {
    const ratesResponse = await fetchExchangeRatesFromAPI(baseCurrency);

    if (!ratesResponse.success || !ratesResponse.rates) {
      console.error('Failed to fetch exchange rates:', ratesResponse.error);
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Store exchange rates in database
    for (const [toCurrency, rate] of Object.entries(ratesResponse.rates)) {
      await prisma.exchangeRate.upsert({
        where: {
          fromCurrency_toCurrency_date: {
            fromCurrency: baseCurrency,
            toCurrency,
            date: today
          }
        },
        update: {
          rate,
          source: 'exchangerate-api-v6'
        },
        create: {
          fromCurrency: baseCurrency,
          toCurrency,
          rate,
          date: today,
          source: 'exchangerate-api-v6'
        }
      });
    }

    return true;
  } catch (error) {
    console.error('Error updating exchange rates:', error);
    return false;
  }
}

export async function getExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  date?: Date
): Promise<number> {
  if (fromCurrency === toCurrency) return 1;

  try {
    const queryDate = date || new Date();
    queryDate.setHours(0, 0, 0, 0);

    // Try to get exact rate for the date
    let exchangeRate = await prisma.exchangeRate.findFirst({
      where: {
        fromCurrency,
        toCurrency,
        date: queryDate
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // If not found, get the most recent rate
    if (!exchangeRate) {
      exchangeRate = await prisma.exchangeRate.findFirst({
        where: {
          fromCurrency,
          toCurrency,
          date: {
            lte: queryDate
          }
        },
        orderBy: {
          date: 'desc'
        }
      });
    }

    // If still not found, try reverse rate (1/rate)
    if (!exchangeRate) {
      const reverseRate = await prisma.exchangeRate.findFirst({
        where: {
          fromCurrency: toCurrency,
          toCurrency: fromCurrency,
          date: {
            lte: queryDate
          }
        },
        orderBy: {
          date: 'desc'
        }
      });

      if (reverseRate) {
        return 1 / reverseRate.rate;
      }
    }

    return exchangeRate?.rate || 1;
  } catch (error) {
    console.error('Error getting exchange rate:', error);
    return 1;
  }
}

export async function convertAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  date?: Date
): Promise<{ convertedAmount: number; exchangeRate: number }> {
  const exchangeRate = await getExchangeRate(fromCurrency, toCurrency, date);
  const convertedAmount = amount * exchangeRate;

  return {
    convertedAmount,
    exchangeRate
  };
}