import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { TrendingUp, TrendingDown, Calendar, Clock } from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  entry_price: number;
  exit_price: number | null;
  quantity: number;
  direction: 'long' | 'short';
  status: 'open' | 'closed' | 'cancelled';
  pnl: number;
  entry_time: string;
  exit_time: string | null;
}

const TradeHistory: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrades(data || []);
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trades.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p>No trades found</p>
        </div>
      ) : (
        trades.map((trade) => (
          <div
            key={trade.id}
            className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">{trade.symbol}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trade.direction === 'long'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-red-500/20 text-red-500'
                  }`}
                >
                  {trade.direction === 'long' ? (
                    <TrendingUp size={14} className="inline mr-1" />
                  ) : (
                    <TrendingDown size={14} className="inline mr-1" />
                  )}
                  {trade.direction.toUpperCase()}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  trade.status === 'open'
                    ? 'bg-blue-500/20 text-blue-500'
                    : trade.status === 'closed'
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-red-500/20 text-red-500'
                }`}
              >
                {trade.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Entry Price</p>
                <p>₹{trade.entry_price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400">Exit Price</p>
                <p>
                  {trade.exit_price
                    ? `₹${trade.exit_price.toLocaleString()}`
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Quantity</p>
                <p>{trade.quantity}</p>
              </div>
              <div>
                <p className="text-slate-400">P&L</p>
                <p
                  className={
                    trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                  }
                >
                  ₹{trade.pnl.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(trade.entry_time).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {new Date(trade.entry_time).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TradeHistory;