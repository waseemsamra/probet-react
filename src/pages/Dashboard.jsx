import { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const chartRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Chart data
  const chartData = {
    labels: ['10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45'],
    datasets: [
      {
        label: 'Sports',
        data: [1200, 1900, 1500, 2200, 1800, 2800, 2400, 3100, 2900, 3500, 3200, 3800],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Casino',
        data: [800, 1200, 1600, 1400, 2000, 1800, 2400, 2200, 2800, 2600, 3200, 3000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
        },
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
          color: '#94a3b8',
          font: { size: 11 },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const recentBets = [
    {
      user: 'john_highroller',
      avatar: 'https://i.pravatar.cc/150?img=33',
      event: 'Man City vs Arsenal',
      category: 'Football',
      categoryColor: 'blue',
      odds: 2.10,
      stake: '$5,000',
      potential: '$10,500',
      status: 'Pending',
      statusColor: 'amber',
    },
    {
      user: 'sarah_races',
      avatar: 'https://i.pravatar.cc/150?img=47',
      event: 'Royal Ascot Gold Cup',
      category: 'Horse Racing',
      categoryColor: 'emerald',
      odds: 4.50,
      stake: '$2,500',
      potential: '$11,250',
      status: 'Won',
      statusColor: 'emerald',
    },
    {
      user: 'esports_king',
      avatar: 'https://i.pravatar.cc/150?img=12',
      event: 'NAVI vs FaZe - Map 1',
      category: 'Esports',
      categoryColor: 'purple',
      odds: 1.85,
      stake: '$3,200',
      potential: '$5,920',
      status: 'Lost',
      statusColor: 'red',
    },
    {
      user: 'casino_vip',
      avatar: 'https://i.pravatar.cc/150?img=59',
      event: 'Lightning Roulette',
      category: 'Casino',
      categoryColor: 'amber',
      odds: '35:1',
      stake: '$1,000',
      potential: '$35,000',
      status: 'Won',
      statusColor: 'emerald',
    },
  ];

  const categoryColors = {
    blue: 'bg-blue-100 text-blue-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    purple: 'bg-purple-100 text-purple-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
          <p className="text-sm text-slate-500">Welcome back, Alex!</p>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
          <span className="w-2 h-2 bg-emerald-500 rounded-full live-indicator"></span>
          SYSTEM ONLINE
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-slate-800">$2.4M</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              +12.5%
            </span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Bets</p>
              <h3 className="text-3xl font-bold text-slate-800">18,429</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              +5.2%
            </span>
            <span className="text-slate-400">vs yesterday</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Online Users</p>
              <h3 className="text-3xl font-bold text-slate-800">8,932</h3>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              +18.1%
            </span>
            <span className="text-slate-400">peak traffic</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Payout Rate</p>
              <h3 className="text-3xl font-bold text-slate-800">94.2%</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Industry avg: 92%</span>
          </div>
        </div>
      </div>

      {/* Betting Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Horse Racing */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sport-card">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white sport-icon shadow-lg shadow-emerald-200">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Horse Racing</h3>
                  <p className="text-sm text-slate-500">Live odds & markets</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full animate-pulse">LIVE</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🐎</span>
                  <div>
                    <p className="font-semibold text-slate-800">Royal Ascot - Gold Cup</p>
                    <p className="text-xs text-slate-500">14:30 GMT • 3m 2f</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-600">2.75</p>
                  <p className="text-xs text-emerald-600">▼ 0.25</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏇</span>
                  <div>
                    <p className="font-semibold text-slate-800">Kentucky Derby</p>
                    <p className="text-xs text-slate-500">18:45 EST • 1m ¼f</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-800">4.20</p>
                  <p className="text-xs text-emerald-600">▲ 0.15</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
              View All Races
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

        {/* Football */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sport-card">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white sport-icon shadow-lg shadow-blue-200">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Football</h3>
                  <p className="text-sm text-slate-500">Premier & League matches</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">HOT</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">MUN</div>
                    <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">MCI</div>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Man Utd vs Man City</p>
                    <p className="text-xs text-slate-500">Premier League • 20:00</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">1.95</p>
                  <p className="text-xs text-slate-500">1X2</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">LIV</div>
                    <div className="w-8 h-8 bg-white border border-slate-300 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold border-2 border-white">ARS</div>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Liverpool vs Arsenal</p>
                    <p className="text-xs text-slate-500">Premier League • Tomorrow</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-800">2.10</p>
                  <p className="text-xs text-slate-500">1X2</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
              View All Matches
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

        {/* Esports */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sport-card">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white sport-icon shadow-lg shadow-purple-200">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Esports</h3>
                  <p className="text-sm text-slate-500">CS:GO, LoL, Dota 2</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">TRENDING</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-purple-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black text-xs font-bold border-2 border-white">NAV</div>
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">FAZ</div>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">NAVI vs FaZe</p>
                    <p className="text-xs text-slate-500">IEM Katowice • BO3</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">1.65</p>
                  <p className="text-xs text-purple-600">Match Winner</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-purple-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">T1</div>
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">GEN</div>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">T1 vs Gen.G</p>
                    <p className="text-xs text-slate-500">LCK Spring • BO5</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-800">2.30</p>
                  <p className="text-xs text-slate-500">Match Winner</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
              View All Matches
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

        {/* Casino */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sport-card">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white sport-icon shadow-lg shadow-amber-200">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Casino</h3>
                  <p className="text-sm text-slate-500">Slots, Poker, Live Games</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">VIP</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-center hover:border-amber-300 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">🎰</div>
                <p className="font-semibold text-slate-800 text-sm">Slots</p>
                <p className="text-xs text-slate-500">2,400+ games</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-center hover:border-amber-300 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">🃏</div>
                <p className="font-semibold text-slate-800 text-sm">Poker</p>
                <p className="text-xs text-slate-500">147 tables</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-center hover:border-amber-300 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">🎱</div>
                <p className="font-semibold text-slate-800 text-sm">Roulette</p>
                <p className="text-xs text-slate-500">Live & RNG</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-center hover:border-amber-300 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">🎯</div>
                <p className="font-semibold text-slate-800 text-sm">Bingo</p>
                <p className="text-xs text-slate-500">24 rooms</p>
              </div>
            </div>
            <button className="w-full mt-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
              Enter Casino
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

        {/* All Sports */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sport-card lg:col-span-2 xl:col-span-1">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-rose-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center text-white sport-icon shadow-lg shadow-rose-200">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">All Sports</h3>
                  <p className="text-sm text-slate-500">Hundreds of markets</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">ALL</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏀</span>
                  <span className="font-medium text-slate-700">Basketball</span>
                </div>
                <span className="text-sm text-slate-500">142 events</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎾</span>
                  <span className="font-medium text-slate-700">Tennis</span>
                </div>
                <span className="text-sm text-slate-500">89 events</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏏</span>
                  <span className="font-medium text-slate-700">Cricket</span>
                </div>
                <span className="text-sm text-slate-500">34 events</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏒</span>
                  <span className="font-medium text-slate-700">Ice Hockey</span>
                </div>
                <span className="text-sm text-slate-500">56 events</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
              Browse All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

        {/* Live Activity Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2 xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-800">Live Betting Activity</h3>
              <p className="text-sm text-slate-500">Real-time volume across categories</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-lg">1H</button>
              <button className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">24H</button>
              <button className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">7D</button>
            </div>
          </div>
          <div className="h-64">
            <Line ref={chartRef} data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Bets Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Recent High-Value Bets</h3>
            <p className="text-sm text-slate-500">Latest transactions over $1,000</p>
          </div>
          <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">User</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Event</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Category</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Odds</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Stake</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Potential</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentBets.map((bet, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={bet.avatar} className="w-8 h-8 rounded-full" alt={bet.user} />
                      <span className="font-medium text-slate-800">{bet.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">{bet.event}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${categoryColors[bet.categoryColor]}`}>{bet.category}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{bet.odds}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{bet.stake}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">{bet.potential}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 text-sm font-medium ${
                      bet.statusColor === 'amber' ? 'text-amber-600' :
                      bet.statusColor === 'emerald' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${bet.status === 'Pending' ? 'bg-amber-500 animate-pulse' : bet.status === 'Won' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {bet.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-slate-400 text-sm py-6">
        <p>© 2026 ProBet Gaming. All rights reserved. Licensed and regulated.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
