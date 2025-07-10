import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BrokerSettingsProps {
  onClose: () => void;
  onSave: () => void;
}

const BrokerSettings: React.FC<BrokerSettingsProps> = ({ onClose, onSave }) => {
  const [brokerName, setBrokerName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchBrokerSettings();
  }, []);

  const fetchBrokerSettings = async () => {
    try {
      const { data: settings, error } = await supabase
        .from('broker_settings')
        .select('*')
        .single();

      if (error) throw error;

      if (settings) {
        setBrokerName(settings.broker_name);
        setApiKey(settings.api_key);
        setApiSecret(settings.api_secret);
      }
    } catch (error) {
      console.error('Error fetching broker settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      if (!brokerName || !apiKey || !apiSecret) {
        throw new Error('All fields are required');
      }

      const { error } = await supabase
        .from('broker_settings')
        .upsert({
          broker_name: brokerName,
          api_key: apiKey,
          api_secret: apiSecret,
          is_active: true
        });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        onSave();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-800 rounded-xl p-6 w-full max-w-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Broker Integration</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-500">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-2 text-green-500">
            <Check size={20} />
            <p>Broker settings saved successfully!</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Broker Name</label>
            <select
              value={brokerName}
              onChange={(e) => setBrokerName(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-700/50 border border-slate-600 focus:outline-none focus:border-primary-500"
            >
              <option value="">Select Broker</option>
              <option value="zerodha">Zerodha</option>
              <option value="angelone">Angel One</option>
              <option value="fyers">Fyers</option>
              <option value="upstox">Upstox</option>
              <option value="dhan">Dhan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-700/50 border border-slate-600 focus:outline-none focus:border-primary-500"
              placeholder="Enter your broker API key"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">API Secret</label>
            <input
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-700/50 border border-slate-600 focus:outline-none focus:border-primary-500"
              placeholder="Enter your broker API secret"
            />
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 button-primary py-2"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 button-secondary py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BrokerSettings;