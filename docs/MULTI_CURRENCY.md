# Multi-Currency Support Implementation

This document explains how multi-currency support has been implemented in Ledgique.

## Features

- **25+ Supported Currencies**: Major world currencies with INR as default
- **Automatic Exchange Rate Updates**: Daily updates using exchangerate-api.com v6 API
- **Historical Exchange Rates**: Track rates over time for accurate reporting
- **Currency Conversion**: Real-time conversion between any supported currencies
- **Localized Formatting**: Proper currency formatting based on locale
- **Base Currency Tracking**: Store amounts in both original and base currency
- **User Preferences**: Personalized default currency settings
- **Onboarding Flow**: Guided currency selection for new users

## Database Schema Changes

### New Fields Added:
- `User.defaultCurrency`: User's preferred base currency (defaults to INR)
- `Payment.currency`, `Payment.exchangeRate`, `Payment.amountInBaseCurrency` (defaults to INR)
- `PaymentMilestone.currency`, `PaymentMilestone.exchangeRate`, `PaymentMilestone.amountInBaseCurrency` (defaults to INR)
- `Transaction.currency`, `Transaction.exchangeRate`, `Transaction.amountInBaseCurrency` (defaults to INR)

### New Model:
- `ExchangeRate`: Stores historical exchange rates with source tracking

## Components

### CurrencySelector
Dropdown component for selecting currencies with search functionality.

```tsx
<CurrencySelector
  value={currency}
  onChange={setCurrency}
  disabled={false}
/>
```

### CurrencyDisplay
Displays formatted currency amounts with optional conversion display.

```tsx
<CurrencyDisplay
  amount={1000}
  currency="USD"
  convertedAmount={850}
  convertedCurrency="EUR"
  showCode={true}
/>
```

## Hooks

### useCurrencyConversion
React hook for real-time currency conversion.

```tsx
const { convertedAmount, exchangeRate, isLoading, error } = useCurrencyConversion({
  amount: 1000,
  fromCurrency: 'USD',
  toCurrency: 'EUR'
});
```

### useExchangeRate
React hook for fetching exchange rates.

```tsx
const { rate, isLoading, error } = useExchangeRate('USD', 'EUR');
```

## API Endpoints

### POST /api/exchange-rates
Manually trigger exchange rate updates.

```bash
curl -X POST http://localhost:3000/api/exchange-rates \
  -H "Content-Type: application/json" \
  -d '{"baseCurrency": "USD"}'
```

### GET /api/exchange-rates
Get exchange rate between two currencies.

```bash
curl "http://localhost:3000/api/exchange-rates?from=USD&to=EUR&date=2024-01-01"
```

### GET /api/cron/exchange-rates
Cron endpoint for daily rate updates (called by external cron service).

## Setup Instructions

1. **Run Database Migration**:
   ```bash
   npm run db:migrate
   ```

2. **Update Exchange Rates**:
   ```bash
   npm run update-rates
   ```

3. **Set Up Daily Cron Job**:
   - Use Vercel Cron, GitHub Actions, or external service
   - Call `GET /api/cron/exchange-rates` daily
   - Recommended time: 6 AM UTC (after markets open)

## Usage Examples

### Creating a Payment with Currency
```tsx
const payment = await prisma.payment.create({
  data: {
    amount: 1000,
    currency: 'EUR',
    exchangeRate: 1.1,
    amountInBaseCurrency: 1100, // USD equivalent
    // ... other fields
  }
});
```

### Converting Amounts
```tsx
import { convertAmount } from '@/lib/exchange-rates';

const result = await convertAmount(1000, 'USD', 'EUR');
console.log(`$1000 USD = €${result.convertedAmount} EUR`);
console.log(`Exchange rate: ${result.exchangeRate}`);
```

### Formatting Currency
```tsx
import { formatCurrency } from '@/lib/currency';

const formatted = formatCurrency(1000, 'EUR', 'de-DE');
console.log(formatted); // "1.000,00 €"
```

## Best Practices

1. **Always Store Exchange Rates**: Save the exchange rate used for each transaction
2. **Use Base Currency**: Convert all amounts to user's base currency for reporting
3. **Handle Rate Failures**: Gracefully handle API failures with fallback rates
4. **Update Rates Regularly**: Set up automated daily updates
5. **Validate Currencies**: Always validate currency codes against supported list

## API Configuration

### Free Tier (v4 API)
- 1,500 requests per month
- No API key required
- Updates for ~25 currencies = ~100 requests per day
- Sufficient for small to medium usage

### Paid Tier (v6 API)
- Requires API key from exchangerate-api.com
- Higher rate limits (10,000+ requests/month)
- More reliable service
- Additional features like historical data

Set `EXCHANGE_RATE_API_KEY` in your environment variables to use v6 API.

## Error Handling

The system gracefully handles:
- API failures (falls back to cached rates)
- Invalid currency codes (defaults to 1.0 rate)
- Network timeouts (uses last known rates)
- Missing historical data (uses most recent available rate)

## Future Enhancements

- Multiple exchange rate providers for redundancy
- Real-time rate updates via WebSocket
- Currency hedging calculations
- Multi-currency reporting dashboards
- Automatic currency detection based on client location