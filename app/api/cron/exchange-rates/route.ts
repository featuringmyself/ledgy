import { NextResponse } from 'next/server';
import { updateExchangeRates } from '@/lib/exchange-rates';

// This endpoint should be called by a cron service (like Vercel Cron or external service)
export async function GET() {
  try {
    console.log('Starting daily exchange rate update...');
    
    // Update rates for major base currencies, prioritizing INR
    const baseCurrencies = ['INR', 'USD', 'EUR', 'GBP'];
    const results = [];
    
    for (const baseCurrency of baseCurrencies) {
      const success = await updateExchangeRates(baseCurrency);
      results.push({ baseCurrency, success });
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const successCount = results.filter(r => r.success).length;
    
    console.log(`Exchange rate update completed. ${successCount}/${results.length} successful.`);
    
    return NextResponse.json({
      success: true,
      message: `Updated exchange rates for ${successCount}/${results.length} base currencies`,
      results
    });
  } catch (error) {
    console.error('Error in exchange rate cron job:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update exchange rates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}