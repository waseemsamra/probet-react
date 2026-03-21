import { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Users() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sample users data
  const users = [
    {
      id: 1,
      username: 'john_highroller',
      email: 'john.h@email.com',
      avatar: 'https://i.pravatar.cc/150?img=11',
      status: 'active',
      kycLevel: 3,
      kycStatus: 'Verified',
      riskScore: 15,
      riskLevel: 'Low',
      balance: 45230.00,
      lifetimeVolume: 1200000,
      lastActive: '2 minutes ago',
      ip: '192.168.1.1',
      isVip: true,
      vipTier: 'VIP',
      isOnline: true,
    },
    {
      id: 2,
      username: 'sarah_trader',
      email: 'sarah.t@email.com',
      avatar: 'https://i.pravatar.cc/150?img=12',
      status: 'pending',
      kycLevel: 2,
      kycStatus: 'Level 2/3',
      riskScore: 25,
      riskLevel: 'Low',
      balance: 12450.00,
      lifetimeVolume: 89000,
      lastActive: '15 minutes ago',
      ip: '203.45.67.89',
      isVip: false,
      isOnline: false,
      kycPending: true,
    },
    {
      id: 3,
      username: 'rapid_bettor_99',
      email: 'rapid@email.com',
      avatar: 'https://i.pravatar.cc/150?img=13',
      status: 'restricted',
      kycLevel: 3,
      kycStatus: 'Verified',
      riskScore: 92,
      riskLevel: 'Critical',
      balance: 3200.00,
      lifetimeVolume: 456000,
      lastActive: 'Active now',
      ip: 'Multiple IPs',
      isVip: false,
      isOnline: true,
      isFlagged: true,
    },
    {
      id: 4,
      username: 'mike_casual',
      email: 'mike.c@email.com',
      avatar: 'https://i.pravatar.cc/150?img=14',
      status: 'inactive',
      kycLevel: 3,
      kycStatus: 'Verified',
      riskScore: 10,
      riskLevel: 'Low',
      balance: 450.00,
      lifetimeVolume: 12000,
      lastActive: '3 days ago',
      ip: '45.23.112.8',
      isVip: false,
      isOnline: false,
    },
    {
      id: 5,
      username: 'crypto_whale',
      email: 'whale@proton.me',
      avatar: 'https://i.pravatar.cc/150?img=15',
      status: 'active',
      kycLevel: 3,
      kycStatus: 'Verified',
      riskScore: 55,
      riskLevel: 'Medium',
      balance: 128450.00,
      lifetimeVolume: 4200000,
      lastActive: 'Active now',
      ip: '89.45.23.1',
      isVip: true,
      vipTier: 'VIP GOLD',
      isOnline: true,
    },
  ];

  // Statistics
  const stats = {
    totalUsers: 48293,
    activeNow: 8432,
    pendingKyc: 12,
    riskAlerts: 7,
    weeklyGrowth: 1247,
  };

  // Get status badge styles
  const getStatusStyles = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'restricted':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  // Get risk color
  const getRiskColor = (riskScore) => {
    if (riskScore < 30) return 'bg-emerald-500 text-emerald-600';
    if (riskScore < 60) return 'bg-amber-500 text-amber-600';
    return 'bg-rose-500 text-rose-600';
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(2)}`;
  };

  // Chart data for user growth
  const growthChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'New Users',
        data: [145, 230, 180, 320, 290, 450, 380],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const growthChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(226, 232, 240, 0.5)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: { size: 12 },
        },
      },
    },
  };

  // KYC Overview data
  const kycChartData = {
    labels: ['Verified', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [42156, 12, 89],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(244, 63, 94, 0.8)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(244, 63, 94)',
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <header className="sticky top-0 z-10 glass-panel border-b border-slate-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                <p className="text-sm text-slate-500">Manage users, KYC & risk profiles</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-indigo-500 rounded-full live-indicator"></span>
              {stats.pendingKyc} PENDING KYC
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-mono font-medium">
                {currentTime.toLocaleTimeString('en-GB')} UTC
              </span>
            </div>

            <div className="relative">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.totalUsers.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +{stats.weeklyGrowth.toLocaleString()}
            </span>
            <span className="text-slate-400">this week</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Now</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.activeNow.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +18%
            </span>
            <span className="text-slate-400">vs yesterday</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Pending KYC</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.pendingKyc}</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg kyc-pending">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-amber-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              3 urgent
            </span>
            <span className="text-slate-400">requires review</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Risk Alerts</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.riskAlerts}</h3>
            </div>
            <div className="p-2 bg-rose-100 rounded-lg">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-rose-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              +2
            </span>
            <span className="text-slate-400">since yesterday</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        {/* Tabs */}
        <div className="border-b border-slate-200 px-6">
          <div className="flex items-center gap-8 overflow-x-auto">
            {[
              { id: 'all', label: 'All Users', count: stats.totalUsers },
              { id: 'kyc', label: 'KYC Pending', count: stats.pendingKyc, color: 'amber' },
              { id: 'vip', label: 'VIP Players', count: 342, color: 'purple' },
              { id: 'restricted', label: 'Restricted', count: 23, color: 'rose' },
              { id: 'risk', label: 'Risk Flagged', count: stats.riskAlerts, color: 'red' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  tab.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                  tab.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                  tab.color === 'rose' ? 'bg-rose-100 text-rose-700' :
                  tab.color === 'red' ? 'bg-red-100 text-red-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters & Search */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                {['all', 'active', 'inactive', 'suspended'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`filter-chip px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeFilter === filter
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="action-btn px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
              </button>
              <button className="action-btn px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                  <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">User</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">KYC Level</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Risk Score</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Balance</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Lifetime Volume</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Last Active</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={`user-row transition-all ${
                    user.kycPending ? 'bg-amber-50/50' :
                    user.isFlagged ? 'bg-rose-50/30' :
                    'hover:bg-slate-50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`user-avatar relative ${user.isVip ? 'vip' : ''}`}>
                        <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt={user.username} />
                        <span className={`activity-dot absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          user.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}></span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{user.username}</span>
                          {user.isVip && (
                            <span className="vip-badge text-xs font-bold text-white px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600">
                              {user.vipTier}
                            </span>
                          )}
                          {user.isFlagged && (
                            <span className="suspicious-flag text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
                              ⚠️ FLAGGED
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`status-badge inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(user.status)} transition-transform hover:scale-105`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        user.status === 'active' ? 'bg-emerald-500' :
                        user.status === 'pending' ? 'bg-amber-500' :
                        user.status === 'restricted' ? 'bg-rose-500' :
                        'bg-slate-500'
                      }`}></span>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        {[...Array(user.kycLevel)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white ${
                              i < user.kycLevel ? 'bg-emerald-500' : 'bg-slate-200'
                            }`}
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>
                      <span className={`text-sm font-medium ${user.kycPending ? 'text-amber-600' : 'text-slate-700'}`}>
                        {user.kycStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div className={`h-2 rounded-full transition-all ${getRiskColor(user.riskScore)}`} style={{ width: `${user.riskScore}%` }}></div>
                      </div>
                      <span className={`text-sm font-medium ${
                        user.riskLevel === 'Critical' ? 'text-rose-600 font-bold' :
                        user.riskLevel === 'Medium' ? 'text-amber-600' :
                        'text-emerald-600'
                      }`}>
                        {user.riskLevel}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-slate-800">${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div className="text-xs text-slate-500">USD</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-slate-800">{formatCurrency(user.lifetimeVolume)}</div>
                    <div className={`text-xs ${user.lifetimeVolume > 1000000 ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {user.lifetimeVolume > 1000000 ? '+28% this month' : 'Regular activity'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">{user.lastActive}</div>
                    <div className={`text-xs ${user.ip.includes('Multiple') ? 'text-rose-600 font-medium' : 'text-slate-500'}`}>
                      IP: {user.ip}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Profile">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {user.kycPending ? (
                        <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors">
                          Review KYC
                        </button>
                      ) : user.isFlagged ? (
                        <button className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors">
                          Investigate
                        </button>
                      ) : (
                        <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit User">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-800">1-5</span> of <span className="font-bold text-slate-800">{stats.totalUsers.toLocaleString()}</span> users
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50" disabled>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg">1</button>
            <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg">2</button>
            <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg">3</button>
            <span className="text-slate-400">...</span>
            <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg">9,659</button>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-800">User Growth</h4>
            <select className="text-sm border-slate-200 rounded-lg text-slate-600 focus:ring-indigo-500 focus:border-indigo-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-48">
            <Bar data={growthChartData} options={growthChartOptions} />
          </div>
        </div>

        {/* KYC Statistics */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h4 className="font-bold text-slate-800 mb-6">KYC Overview</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-slate-800">Verified</div>
                  <div className="text-sm text-slate-500">Level 3 complete</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">42,156</div>
                <div className="text-sm text-emerald-600">87.3%</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-slate-800">Pending</div>
                  <div className="text-sm text-slate-500">Awaiting review</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-amber-600">{stats.pendingKyc}</div>
                <div className="text-sm text-amber-600">0.02%</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl border border-rose-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-slate-800">Rejected</div>
                  <div className="text-sm text-slate-500">Failed verification</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-rose-600">89</div>
                <div className="text-sm text-rose-600">0.18%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-800">Recent Activity</h4>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { action: 'New user registered', user: 'player_2026', time: '2m ago', type: 'success' },
              { action: 'KYC submitted', user: 'sarah_trader', time: '5m ago', type: 'warning' },
              { action: 'Large withdrawal', user: 'crypto_whale', time: '12m ago', type: 'info' },
              { action: 'Risk alert triggered', user: 'rapid_bettor_99', time: '18m ago', type: 'danger' },
              { action: 'VIP status upgraded', user: 'john_highroller', time: '25m ago', type: 'success' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-emerald-500' :
                  activity.type === 'warning' ? 'bg-amber-500' :
                  activity.type === 'danger' ? 'bg-rose-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <div className="text-sm text-slate-800">{activity.action}</div>
                  <div className="text-xs text-slate-500">{activity.user} • {activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-slate-400 text-sm py-6">
        <p>© 2026 ProBet Gaming. All rights reserved. Licensed and regulated.</p>
      </footer>
    </div>
  );
}

export default Users;
