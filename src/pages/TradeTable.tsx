import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TradeTable() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/admin/trades', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => setTrades(res.data));
  }, []);

  return (
    <table className="w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">ID</th>
          <th className="p-2">User</th>
          <th className="p-2">Symbol</th>
          <th className="p-2">Side</th>
          <th className="p-2">Qty</th>
          <th className="p-2">Status</th>
          <th className="p-2">Time</th>
        </tr>
      </thead>
      <tbody>
        {trades.map((t: any) => (
          <tr key={t.id}>
            <td className="p-2">{t.id}</td>
            <td className="p-2">{t.user_id}</td>
            <td className="p-2">{t.symbol}</td>
            <td className="p-2">{t.side}</td>
            <td className="p-2">{t.qty}</td>
            <td className="p-2">{t.status}</td>
            <td className="p-2">{new Date(t.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
