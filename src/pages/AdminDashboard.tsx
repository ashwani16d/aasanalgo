import React, { useState } from 'react';
import UserList from './UserList';
import TradeTable from './TradeTable';

export default function AdminDashboard() {
  const [tab, setTab] = useState<'users' | 'trades'>('users');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded ${tab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          Users
        </button>
        <button onClick={() => setTab('trades')} className={`px-4 py-2 rounded ${tab === 'trades' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          Trades
        </button>
      </div>
      {tab === 'users' ? <UserList /> : <TradeTable />}
    </div>
  );
}
