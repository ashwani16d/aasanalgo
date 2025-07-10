import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Users,
  Settings,
  Activity,
  Trash,
  Package,
  Gift,
  Link,
  CreditCard,
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const isAdmin = localStorage.getItem("adminLoggedIn") === "true";
    if (!isAdmin) {
      navigate("/nikunj");
    }

    // Mock users (replace with real fetch later)
    setUsers([
      { id: 1, email: "user1@example.com", role: "user" },
      { id: 2, email: "admin@example.com", role: "admin" }
    ]);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/nikunj");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 p-6">
        <div className="flex items-center gap-3 mb-10">
          <Lock className="text-blue-500" size={24} />
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>

        <nav className="space-y-2">
          {[
            { key: 'users', label: 'User Management', icon: <Users size={20} /> },
            { key: 'activity', label: 'Activity Log', icon: <Activity size={20} /> },
            { key: 'settings', label: 'Settings', icon: <Settings size={20} /> },
            { key: 'subscriptions', label: 'Subscriptions', icon: <Package size={20} /> },
            { key: 'offers', label: 'Offers', icon: <Gift size={20} /> },
            { key: 'apiLinks', label: 'API Links', icon: <Link size={20} /> },
            { key: 'payments', label: 'Payments', icon: <CreditCard size={20} /> }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                activeTab === tab.key ? 'bg-blue-500/20 text-blue-500' : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400">Welcome back, Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30"
          >
            <Lock size={18} />
            Logout
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6 text-white">Users ({users.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-400">
                    <th className="pb-4">Email</th>
                    <th className="pb-4">Role</th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-slate-700">
                      <td className="py-4 text-white">{user.email}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-500 text-sm">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="p-2 hover:bg-slate-700/50 rounded-lg text-red-500">
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-slate-800 rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
            <p>[TODO] Add activity feed here</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-slate-800 rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-6">System Settings</h2>
            <p>[TODO] Configurable options</p>
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="bg-slate-800 rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-6">Subscription Plans</h2>
            <p>[TODO] Manage plans here</p>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="bg-slate-800 rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-6">Offers</h2>
            <p>[TODO] Add/remove offer codes</p>
          </div>
        )}

        {activeTab === 'apiLinks' && (
          <div className="bg-slate-800 rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-6">API Links</h2>
            <p>[TODO] Zerodha, AngelOne, Dhan, Fyers, Upstox integration</p>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-slate-800 rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-6">Payment Gateway</h2>
            <p>[TODO] Razorpay/Stripe configuration</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
