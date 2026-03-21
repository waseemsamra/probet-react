import { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import BlackjackGame from './BlackjackGame';
import LightningRoulette from './LightningRoulette';
import SpeedBaccarat from './SpeedBaccarat';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Casino() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [jackpot, setJackpot] = useState(2847293.45);
  const [showBlackjack, setShowBlackjack] = useState(false);
  const [showLightningRoulette, setShowLightningRoulette] = useState(false);
  const [showSpeedBaccarat, setShowSpeedBaccarat] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const chartRef = useRef(null);

  // If showing Speed Baccarat
  if (showSpeedBaccarat) {
    return <SpeedBaccarat onBack={() => setShowSpeedBaccarat(false)} />;
  }

  // If showing Lightning Roulette
  if (showLightningRoulette) {
    return <LightningRoulette onBack={() => setShowLightningRoulette(false)} />;
  }

  // If showing Blackjack game
  if (showBlackjack) {
    return <BlackjackGame onBack={() => setShowBlackjack(false)} />;
  }

  // Chart data
  const chartData = {
    labels: ['Evolution', 'Pragmatic', 'NetEnt', "Play'n GO", 'Microgaming', 'Red Tiger'],
    datasets: [
      {
        label: 'Revenue ($K)',
        data: [145, 132, 98, 87, 76, 64],
        backgroundColor: [
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgb(245, 158, 11)',
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
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
          callback: (value) => '$' + value + 'K',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: { size: 12, weight: '500' },
        },
      },
    },
  };

  const categories = [
    { id: 'all', icon: '🎰', name: 'All Games' },
    { id: 'live', icon: '🎲', name: 'Live Dealer' },
    { id: 'slots', icon: '🎰', name: 'Slots' },
    { id: 'table', icon: '🃏', name: 'Table Games' },
    { id: 'roulette', icon: '🎯', name: 'Roulette' },
    { id: 'poker', icon: '♠️', name: 'Poker' },
  ];

  const liveDealerTables = [
    {
      id: 1,
      name: 'Blackjack Classic',
      icon: '🃏',
      dealer: 'Sarah',
      dealerImg: 'https://i.pravatar.cc/150?img=5',
      status: 'open',
      seats: '7/7',
      minBet: '$10',
      lastWin: '$2,400',
      pot: '$45K',
      isHot: true,
      gradient: 'from-emerald-800 to-emerald-900',
    },
    {
      id: 2,
      name: 'Lightning Roulette',
      icon: '🎰',
      dealer: 'Emma',
      dealerImg: 'https://i.pravatar.cc/150?img=9',
      status: 'full',
      seats: 'Full',
      minBet: '$5',
      lastWin: '500x',
      pot: '$128K',
      isHot: false,
      gradient: 'from-red-700 to-red-900',
    },
    {
      id: 3,
      name: 'Speed Baccarat',
      icon: '🎴',
      dealer: 'James',
      dealerImg: 'https://i.pravatar.cc/150?img=10',
      status: 'waiting',
      seats: '3/7',
      minBet: '$50',
      lastWin: '80+ rounds/hr',
      pot: '$89K',
      isNew: true,
      gradient: 'from-amber-700 to-amber-900',
    },
    {
      id: 4,
      name: "Casino Hold'em",
      icon: '♠️',
      dealer: 'Mike',
      dealerImg: 'https://i.pravatar.cc/150?img=8',
      status: 'open',
      seats: '5/9',
      minBet: '$25',
      lastWin: 'Active',
      pot: '$234K',
      isHot: false,
      gradient: 'from-blue-800 to-indigo-900',
    },
  ];

  const slots = [
    { id: 1, name: 'Irish Riches', icon: '🍀', rtp: '96.5%', win: '$12K', isHot: true, gradient: 'from-purple-600 to-pink-600' },
    { id: 2, name: 'Thunder Strike', icon: '⚡', rtp: '95.8%', win: '$8K', isHot: false, gradient: 'from-blue-600 to-cyan-600' },
    { id: 3, name: 'Golden Empire', icon: '👑', rtp: '97.2%', win: '$24K', isNew: true, gradient: 'from-amber-500 to-orange-600' },
    { id: 4, name: "Dragon's Fire", icon: '🐉', rtp: '96.1%', win: '$15K', isHot: false, gradient: 'from-red-600 to-rose-600' },
    { id: 5, name: 'Starburst XXXtreme', icon: '💎', rtp: '96.2%', win: '$45K', isHot: true, gradient: 'from-indigo-600 to-purple-600' },
    { id: 6, name: 'Tiki Tumble', icon: '🌴', rtp: '95.5%', win: '$6K', isHot: false, gradient: 'from-emerald-600 to-teal-600' },
  ];

  const recentWins = [
    { game: 'Mega Moolah', type: 'Progressive Jackpot', amount: '$124,500', time: '12 mins ago', player: 'lucky_streak_99', icon: '🎰', color: 'amber' },
    { game: 'Lightning Roulette', type: 'Live Dealer', amount: '$45,200', time: '28 mins ago', player: 'high_roller_x', icon: '⚡', color: 'purple' },
    { game: 'Blackjack VIP', type: 'Table Game', amount: '$18,750', time: '45 mins ago', player: 'card_shark', icon: '🃏', color: 'blue' },
    { game: 'Speed Baccarat', type: 'Live Dealer', amount: '$32,100', time: '1 hour ago', player: 'banker_pro', icon: '🎴', color: 'emerald' },
  ];

  const getStatusColor = (status) => {
    if (status === 'open') return 'text-emerald-600';
    if (status === 'full') return 'text-red-600';
    return 'text-amber-600';
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <header className="sticky top-0 z-10 glass-panel border-b border-slate-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Casino</h2>
                <p className="text-sm text-slate-500">Live tables, slots & jackpots</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-amber-500 rounded-full live-indicator"></span>
              2,847 ONLINE PLAYERS
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-mono font-medium">
                {currentTime.toISOString().split('T')[1].split('.')[0]} UTC
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

      {/* Progressive Jackpot Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)' }}></div>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="live-dealer-badge text-xs font-bold px-3 py-1 rounded-full">MEGA JACKPOT</span>
              <span className="text-amber-300 text-sm font-medium">Growing every second...</span>
            </div>
            <h3 className="text-5xl font-bold jackpot-counter mb-2 coin-float">
              ${jackpot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-slate-300 text-sm">Last win: 12 minutes ago • $124,500</p>
          </div>
          <div className="text-right">
            <div className="flex -space-x-4 mb-3">
              <img src="https://i.pravatar.cc/150?img=1" className="w-10 h-10 rounded-full border-2 border-purple-900" alt="Player" />
              <img src="https://i.pravatar.cc/150?img=2" className="w-10 h-10 rounded-full border-2 border-purple-900" alt="Player" />
              <img src="https://i.pravatar.cc/150?img=3" className="w-10 h-10 rounded-full border-2 border-purple-900" alt="Player" />
              <img src="https://i.pravatar.cc/150?img=4" className="w-10 h-10 rounded-full border-2 border-purple-900" alt="Player" />
              <div className="w-10 h-10 rounded-full border-2 border-purple-900 bg-amber-500 flex items-center justify-center text-xs font-bold">+2K</div>
            </div>
            <button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 transition-all transform hover:scale-105">
              View Jackpot Games
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Live Tables</p>
              <h3 className="text-3xl font-bold text-slate-800">156</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +12
            </span>
            <span className="text-slate-400">active now</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Hourly Revenue</p>
              <h3 className="text-3xl font-bold text-slate-800">$84.2K</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +5.8%
            </span>
            <span className="text-slate-400">vs last hour</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Bets</p>
              <h3 className="text-3xl font-bold text-slate-800">45,892</h3>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +8.3%
            </span>
            <span className="text-slate-400">this hour</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Avg Bet Size</p>
              <h3 className="text-3xl font-bold text-slate-800">$28.50</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +$2.10
            </span>
            <span className="text-slate-400">vs yesterday</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center gap-3 overflow-x-auto scroll-hide pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`category-tab px-6 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap flex items-center gap-2 transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Live Dealer Tables */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Live Dealer Tables
          </h3>
          <button className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
            View All Tables
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {liveDealerTables.map((table) => (
            <div
              key={table.id}
              onClick={() => {
                if (table.name === 'Blackjack Classic') setShowBlackjack(true);
                if (table.name === 'Lightning Roulette') setShowLightningRoulette(true);
                if (table.name === 'Speed Baccarat') setShowSpeedBaccarat(true);
              }}
              className={`game-card bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden cursor-pointer ${table.isHot ? 'hot-game' : ''} ${table.isNew ? 'new-game' : ''}`}
            >
              <div className={`h-40 bg-gradient-to-br ${table.gradient} relative flex items-center justify-center`}>
                {table.name === 'Blackjack Classic' && (
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)' }}></div>
                )}
                {table.name === 'Lightning Roulette' && (
                  <div className="absolute inset-0 opacity-20 roulette-bg rounded-full scale-75 blur-sm"></div>
                )}
                <div className="text-6xl relative z-10">{table.icon}</div>
                <div className="absolute top-4 left-4">
                  <span className="live-dealer-badge text-xs font-bold px-2 py-1 rounded text-white">LIVE</span>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-xs font-bold">
                  Min: {table.minBet}
                </div>
                <div className="play-overlay">
                  <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800">{table.name}</h4>
                  <span className={`table-status ${table.status} text-xs text-slate-500 font-medium pl-2`}>{table.seats}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <img src={table.dealerImg} className="w-6 h-6 rounded-full border border-slate-200" alt={table.dealer} />
                  <span className="text-sm text-slate-600">{table.dealer} (Dealer)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    {table.name === 'Lightning Roulette' ? 'Multiplier:' : table.name === 'Speed Baccarat' ? 'Rounds/hr:' : 'Last win:'}{' '}
                    <span className={table.status === 'open' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{table.lastWin}</span>
                  </span>
                  <span className="text-amber-600 font-bold">{table.pot} pot</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Slots */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Trending Slots</h3>
          <div className="flex items-center gap-2">
            <button className="text-sm text-slate-500 hover:text-slate-700 font-medium">View All</button>
            <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`game-card bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${slot.isHot ? 'hot-game' : ''} ${slot.isNew ? 'new-game' : ''}`}
            >
              <div className={`aspect-square bg-gradient-to-br ${slot.gradient} relative flex items-center justify-center`}>
                <div className="text-4xl">{slot.icon}</div>
                {slot.isHot && (
                  <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded">HOT</div>
                )}
                {slot.isNew && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">NEW</div>
                )}
                <div className="play-overlay">
                  <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-3">
                <h5 className="font-bold text-slate-800 text-sm truncate">{slot.name}</h5>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-500">RTP: {slot.rtp}</span>
                  <span className="text-xs text-emerald-600 font-bold">{slot.win} win</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Wins & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Big Wins */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-800 text-lg">Recent Big Wins</h4>
            <span className="text-xs text-slate-500">Last 24 hours</span>
          </div>
          <div className="space-y-4">
            {recentWins.map((win, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-xl border recent-win ${
                  win.color === 'amber' ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${win.color === 'amber' ? 'bg-amber-500' : win.color === 'purple' ? 'bg-purple-500' : win.color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'} rounded-full flex items-center justify-center text-2xl shadow-lg`}>
                    {win.icon}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{win.game}</div>
                    <div className="text-sm text-slate-500">{win.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${win.color === 'amber' ? 'text-amber-600' : win.color === 'purple' ? 'text-purple-600' : win.color === 'blue' ? 'text-blue-600' : 'text-emerald-600'}`}>
                    {win.amount}
                  </div>
                  <div className="text-xs text-slate-500">{win.time} • {win.player}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Stats */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h4 className="font-bold text-slate-800 text-lg mb-6">Live Activity</h4>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Active Players</span>
                <span className="text-lg font-bold text-slate-800">2,847</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full stat-bar" style={{ width: '78%' }}></div>
              </div>
              <div className="text-xs text-slate-500 mt-1">+124 in last 5 mins</div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Tables Occupancy</span>
                <span className="text-lg font-bold text-slate-800">89%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full stat-bar" style={{ width: '89%' }}></div>
              </div>
              <div className="text-xs text-slate-500 mt-1">139 of 156 tables full</div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Slots Spinning</span>
                <span className="text-lg font-bold text-slate-800">4,521</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full stat-bar" style={{ width: '65%' }}></div>
              </div>
              <div className="text-xs text-slate-500 mt-1">2,400+ games available</div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Avg Session Time</span>
                <span className="text-lg font-bold text-slate-800">42m</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full stat-bar" style={{ width: '70%' }}></div>
              </div>
              <div className="text-xs text-slate-500 mt-1">+8m vs yesterday</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm">🏆</div>
              <span className="font-bold text-slate-800">Daily Tournament</span>
            </div>
            <p className="text-sm text-slate-600 mb-3">Slots Championship - $50K prize pool</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Ends in: <span className="font-bold text-amber-600">04:23:15</span></span>
              <button className="text-amber-600 font-bold hover:text-amber-700">Join Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Providers & Performance */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Game Provider Performance</h3>
            <p className="text-sm text-slate-500">Revenue by game provider (last 24h)</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-lg">Revenue</button>
            <button className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Players</button>
            <button className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">RTP</button>
          </div>
        </div>
        <div className="h-64">
          <Bar ref={chartRef} data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-slate-400 text-sm py-6">
        <p>© 2026 ProBet Gaming. All rights reserved. Licensed and regulated.</p>
      </footer>
    </div>
  );
}

export default Casino;
