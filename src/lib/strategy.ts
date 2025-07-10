import { supabase } from './supabase';

interface Candle {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface SwingDetectionResult {
  direction: 'call' | 'put';
  entryPrice: number;
  strikePrice: number;
  bufferPrice: number;
  pattern: Candle[];
}

export class NiftyOptionsStrategy {
  private strategy: any;
  private currentTimeframe: '1' | '3' = '1';

  constructor(strategy: any) {
    this.strategy = strategy;
  }

  private isWithinTradingHours(): boolean {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    const { start, morningEnd, end } = this.strategy.parameters.tradingHours;
    
    // Update timeframe based on time
    if (currentTime >= start && currentTime < morningEnd) {
      this.currentTimeframe = '1';
    } else if (currentTime >= morningEnd && currentTime < end) {
      this.currentTimeframe = '3';
    }
    
    return currentTime >= start && currentTime < end;
  }

  private calculateBufferPrice(basePrice: number): number {
    const { bufferPoints, roundingPrecision } = this.strategy.parameters.swingRules;
    
    // Round the base price
    const roundedBase = Math.round(basePrice / roundingPrecision) * roundingPrecision;
    
    // Add buffer points
    const bufferPrice = roundedBase + bufferPoints;
    
    // Round the final price
    return Math.round(bufferPrice / roundingPrecision) * roundingPrecision;
  }

  private detectSwing(candles: Candle[]): SwingDetectionResult | null {
    if (candles.length < 4) return null;
    
    const { consecutiveCandles } = this.strategy.parameters.swingRules;
    const lastCandles = candles.slice(-consecutiveCandles - 1);
    
    // Check for PUT swing (3 consecutive red after green)
    const isPutSwing = lastCandles[0].close > lastCandles[0].open && // Green candle
      lastCandles.slice(1).every(c => c.close < c.open); // Followed by 3 red candles
    
    // Check for CALL swing (3 consecutive green after red)
    const isCallSwing = lastCandles[0].close < lastCandles[0].open && // Red candle
      lastCandles.slice(1).every(c => c.close > c.open); // Followed by 3 green candles
    
    if (!isPutSwing && !isCallSwing) return null;
    
    const direction = isPutSwing ? 'put' : 'call';
    const highestPrice = Math.max(...lastCandles.map(c => c.high));
    const bufferPrice = this.calculateBufferPrice(highestPrice);
    
    return {
      direction,
      entryPrice: highestPrice,
      strikePrice: Math.round(highestPrice),
      bufferPrice,
      pattern: lastCandles
    };
  }

  async processCandles(candles: Candle[]): Promise<void> {
    if (!this.isWithinTradingHours()) return;
    
    const swingResult = this.detectSwing(candles);
    if (!swingResult) return;
    
    // Save the signal
    const { data, error } = await supabase
      .from('strategy_signals')
      .insert({
        strategy_id: this.strategy.id,
        symbol: 'NIFTY50',
        direction: swingResult.direction,
        entry_price: swingResult.entryPrice,
        strike_price: swingResult.strikePrice,
        buffer_price: swingResult.bufferPrice,
        candle_pattern: swingResult.pattern,
        timeframe: this.currentTimeframe
      });
    
    if (error) {
      console.error('Error saving strategy signal:', error);
    }
  }
}