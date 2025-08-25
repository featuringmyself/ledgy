import { NextRequest, NextResponse } from 'next/server';
import { updateExchangeRates, getExchangeRate } from '@/lib/exchange-rates';

export async function POST(request: NextRequest) {
  try {
    const { baseCurrency = 'USD' } = await request.json();
    
    const success = await updateExchangeRates(baseCurrency);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Exchange rates updated successfully' 
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to update exchange rates' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in exchange rates API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fromCurrency = searchParams.get('from') || 'USD';
    const toCurrency = searchParams.get('to') || 'USD';
    const dateStr = searchParams.get('date');
    
    const date = dateStr ? new Date(dateStr) : undefined;
    const rate = await getExchangeRate(fromCurrency, toCurrency, date);
    
    return NextResponse.json({
      success: true,
      rate,
      fromCurrency,
      toCurrency,
      date: date?.toISOString() || new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting exchange rate:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}