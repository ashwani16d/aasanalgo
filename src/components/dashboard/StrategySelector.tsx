import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Settings, AlertTriangle } from 'lucide-react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  parameters: any;
  is_active: boolean;
}

interface StrategySelectorProps {
  onSelect: (strategy: Strategy) => void;
}

const StrategySelector: React.FC<StrategySelectorProps> = ({ onSelect }) => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      const { data, error } = await supabase
        .from('trading_strategies')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setStrategies(data || []);
    } catch (err: any) {
      setError(err.message);
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

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {strategies.map((strategy) => (
        <motion.div
          key={strategy.id}
          whileHover={{ scale: 1.02 }}
          className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 cursor-pointer"
          onClick={() => onSelect(strategy)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{strategy.name}</h3>
            <Settings className="text-primary-500" size={20} />
          </div>
          <p className="text-slate-400 text-sm mb-4">{strategy.description}</p>
          <div className="space-y-2">
            {Object.entries(strategy.parameters).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{key}</span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StrategySelector;