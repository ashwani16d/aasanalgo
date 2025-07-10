import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import {
  Activity, AlertCircle, BarChart, Bell, BookOpen, ChevronDown,
  ChevronUp, Clock, DollarSign, History, LineChart, LogOut,
  PieChart, Settings, Target, TrendingDown, TrendingUp, User,
  Wallet, Zap
} from 'lucide-react';
import { format } from 'date-fns';
import BrokerSettings from './BrokerSettings';
import TradeHistory from './TradeHistory';
import StrategySelector from './StrategySelector';

// Lazy load ApexCharts component
const Chart = lazy(() => import('react-apexcharts'));

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showBrokerSettings, setShowBrokerSettings] = useState(false);
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [performance, setPerformance] = useState({
    pnl: 0,
    winRate: 0,
    totalTrades: 0,
    activeTrades: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch positions
      const { data: positionsData } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'open');
      
      if (positionsData) setPositions(positionsData);

      // Fetch orders
      const { data: ordersData } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (ordersData) setOrders(ordersData);

      // Fetch strategies
      const { data: strategiesData } = await supabase
        .from('user_strategies')
        .select(`
          *,
          strategy:trading_strategies(*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (strategiesData) setStrategies(strategiesData);

      // Calculate performance metrics
      const { data: tradesData } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id);

      if (tradesData) {
        const totalTrades = tradesData.length;
        const winningTrades = tradesData.filter(t => t.pnl > 0).length;
        const activeTrades = tradesData.filter(t => t.status === 'open').length;
        const totalPnl = tradesData.reduce((sum, t) => sum + (t.pnl || 0), 0);

        setPerformance({
          pnl: totalPnl,
          winRate: totalTrades ? (winningTrades / totalTrades) * 100 : 0,
          totalTrades,
          activeTrades
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      },
      background: 'transparent'
    },
    theme: {
      mode: 'dark'
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      type: 'datetime',
      categories: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString();
      })
    },
    yaxis: {
      labels: {
        formatter: (value) => `₹${value.toFixed(2)}`
      }
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy'
      }
    }
  };

  const chartSeries = [
    {
      name: 'P&L',
      data: Array.from({ length: 30 }, () => Math.random() * 10000 - 5000)
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-8">
          <LineChart className="h-6 w-6 text-primary-500" />
          <span className="text-xl font-bold">AASANALGO</span>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${
              selectedTab === 'overview' ? 'bg-primary-500/10 text-primary-500' : 'hover:bg-slate-700/50'
            }`}
          >
            <Activity size={20} />
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('positions')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${
              selectedTab === 'positions' ? 'bg-primary-500/10 text-primary-500' : 'hover:bg-slate-700/50'
            }`}
          >
            <Target size={20} />
            Positions
          </button>
          <button
            onClick={() => setSelectedTab('orders')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${
              selectedTab === 'orders' ? 'bg-primary-500/10 text-primary-500' : 'hover:bg-slate-700/50'
            }`}
          >
            <BookOpen size={20} />
            Orders
          </button>
          <button
            onClick={() => setSelectedTab('history')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${
              selectedTab === 'history' ? 'bg-primary-500/10 text-primary-500' : 'hover:bg-slate-700/50'
            }`}
          >
            <History size={20} />
            History
          </button>
          <button
            onClick={() => setSelectedTab('strategies')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${
              selectedTab === 'strategies' ? 'bg-primary-500/10 text-primary-500' : 'hover:bg-slate-700/50'
            }`}
          >
            <Zap size={20} />
            Strategies
          </button>
          <button
            onClick={() => setSelectedTab('wallet')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${
              selectedTab === 'wallet' ? 'bg-primary-500/10 text-primary-500' : 'hover:bg-slate-700/50'
            }`}
          >
            <Wallet size={20} />
            Wallet
          </button>
          <button
            onClick={() => setShowBrokerSettings(true)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${
              showBrokerSettings ? 'bg-primary-500/10 text-primary-500' : 'hover:bg-slate-700/50'
            }`}
          >
            <Settings size={20} />
            Broker Settings
          </button>
        </nav>

        <button
          onClick={signOut}
          className="absolute bottom-4 left-4 right-4 flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-500/10"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {profile?.full_name}</h1>
            <p className="text-slate-400">Here's your trading overview</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-slate-800/50">
              <Bell size={20} />
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-800/50">
              <User size={20} />
            </button>
          </div>
        </div>

        {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400">Today's P&L</h3>
              <DollarSign className={performance.pnl >= 0 ? 'text-green-500' : 'text-red-500'} size={20} />
            </div>
            <p className={`text-2xl font-bold ${performance.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ₹{performance.pnl.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400">Win Rate</h3>
              <PieChart className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-blue-500">
              {performance.winRate.toFixed(1)}%
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400">Active Trades</h3>
              <Activity className="text-yellow-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-yellow-500">
              {performance.activeTrades}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400">Total Trades</h3>
              <BarChart className="text-purple-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-purple-500">
              {performance.totalTrades}
            </p>
          </motion.div>
        </div>

        {/* Main Content Area */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Chart */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Performance Chart</h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded-lg bg-slate-700/50 text-sm">1D</button>
                  <button className="px-3 py-1 rounded-lg bg-slate-700/50 text-sm">1W</button>
                  <button className="px-3 py-1 rounded-lg bg-slate-700/50 text-sm">1M</button>
                  <button className="px-3 py-1 rounded-lg bg-slate-700/50 text-sm">1Y</button>
                </div>
              </div>
              <Suspense fallback={<div>Loading chart...</div>}>
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type="area"
                  height={350}
                />
              </Suspense>
            </div>

            {/* Active Positions */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Active Positions</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-slate-400">
                      <th className="pb-4">Symbol</th>
                      <th className="pb-4">Type</th>
                      <th className="pb-4">Entry</th>
                      <th className="pb-4">Current</th>
                      <th className="pb-4">P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {positions.map((position) => (
                      <tr key={position.id}>
                        <td className="py-4">{position.symbol}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            position.direction === 'long'
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {position.direction.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4">₹{position.entry_price}</td>
                        <td className="py-4">₹{position.current_price}</td>
                        <td className={`py-4 ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ₹{position.pnl}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-slate-400">
                      <th className="pb-4">Time</th>
                      <th className="pb-4">Symbol</th>
                      <th className="pb-4">Type</th>
                      <th className="pb-4">Price</th>
                      <th className="pb-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="py-4">{format(new Date(order.created_at), 'HH:mm:ss')}</td>
                        <td className="py-4">{order.symbol}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.direction === 'long'
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {order.direction.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4">₹{order.entry_price}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'completed'
                              ? 'bg-green-500/20 text-green-500'
                              : order.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'positions' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Open Positions</h2>
            {positions.length > 0 ? (
              <div className="space-y-4">
                {positions.map((position) => (
                  <div
                    key={position.id}
                    className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-semibold">{position.symbol}</h3>
                      <p className="text-sm text-slate-400">
                        Qty: {position.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                        ₹{position.pnl}
                      </p>
                      <p className="text-sm text-slate-400">
                        Entry: ₹{position.entry_price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <AlertCircle className="mx-auto h-12 w-12 mb-4" />
                <p>No open positions</p>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'orders' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Order Book</h2>
            <TradeHistory />
          </div>
        )}

        {selectedTab === 'strategies' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Trading Strategies</h2>
            <StrategySelector onSelect={() => {}} />
          </div>
        )}

        {selectedTab === 'wallet' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Wallet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Available Balance</h3>
                <p className="text-3xl font-bold">₹{profile?.balance?.toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Total P&L</h3>
                <p className={`text-3xl font-bold ${profile?.total_pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ₹{profile?.total_pnl?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Broker Settings Modal */}
      {showBrokerSettings && (
        <BrokerSettings
          onClose={() => setShowBrokerSettings(false)}
          onSave={fetchDashboardData}
        />
      )}
    </div>
  );
};

export default UserDashboard;