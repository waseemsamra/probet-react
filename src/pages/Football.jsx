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

function Football() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [match1Time, setMatch1Time] = useState(67 * 60 + 24);
  const [match2Time, setMatch2Time] = useState(34 * 60 + 12);
  const [score1, setScore1] = useState({ home: 2, away: 1 });
  const [score2, setScore2] = useState({ home: 1, away: 0 });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeLeague, setActiveLeague] = useState('all');
  const [activeMarket, setActiveMarket] = useState('1X2');
  const chartRef = useRef(null);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Match timers
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoRefresh) {
        setMatch1Time((prev) => prev + 1);
        setMatch2Time((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Chart data
  const chartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    datasets: [
      {
        label: 'Premier League',
        data: [45, 32, 28, 65, 89, 120, 95],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'La Liga',
        data: [35, 28, 25, 55, 78, 105, 82],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'UCL',
        data: [25, 20, 22, 40, 95, 140, 110],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
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
          callback: (value) => '$' + value + 'K',
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

  const leagues = [
    { id: 'all', name: 'All Leagues', icon: '' },
    { id: 'epl', name: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { id: 'laliga', name: 'La Liga', icon: '🇪🇸' },
    { id: 'bundesliga', name: 'Bundesliga', icon: '🇩🇪' },
    { id: 'seriea', name: 'Serie A', icon: '🇮🇹' },
    { id: 'ligue1', name: 'Ligue 1', icon: '🇫🇷' },
    { id: 'ucl', name: 'Champions League', icon: '🇪🇺' },
  ];

  const markets = ['1X2', 'Over/Under', 'Both Teams to Score', 'Asian Handicap', 'Correct Score', 'Double Chance'];

  const liveMatches = [
    {
      id: 1,
      league: 'Premier League',
      timer: formatTime(match1Time),
      homeTeam: 'Man United',
      awayTeam: 'Man City',
      homeIcon: '🔴',
      awayIcon: '🌙',
      score: score1,
      period: '2nd Half',
      stats: { possession: '42% - 58%', shots: '8 - 12', corners: '3 - 5' },
      odds: { home: 3.20, draw: 4.50, away: 1.95 },
      oddsChange: { home: 'up', draw: 'down', away: 'up' },
    },
    {
      id: 2,
      league: 'La Liga',
      timer: formatTime(match2Time),
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      homeIcon: '👑',
      awayIcon: '🔷',
      score: score2,
      period: '1st Half',
      stats: { possession: '55% - 45%', shots: '6 - 4', corners: '4 - 2' },
      odds: { home: 1.75, draw: 3.80, away: 4.20 },
      oddsChange: { home: 'up', draw: '', away: 'down' },
    },
  ];

  const upcomingMatches = [
    {
      time: '20:00',
      date: 'Today',
      league: 'UCL',
      leagueColor: 'purple',
      home: 'Bayern',
      away: 'PSG',
      homeColor: 'bg-red-600',
      awayColor: 'bg-blue-600',
      competition: 'Champions League • Round of 16',
      odds: { home: 1.85, draw: 3.60, away: 4.20 },
      volume: '$450K',
      interest: 'High interest',
    },
    {
      time: '20:30',
      date: 'Today',
      league: 'EPL',
      leagueColor: 'blue',
      home: 'Arsenal',
      away: 'Spurs',
      homeColor: 'bg-red-500',
      awayColor: 'bg-white border border-slate-300',
      competition: 'Premier League • North London Derby',
      odds: { home: 1.95, draw: 3.40, away: 3.80 },
      volume: '$380K',
      interest: 'Trending',
    },
    {
      time: '21:45',
      date: 'Today',
      league: 'SER',
      leagueColor: 'green',
      home: 'Juventus',
      away: 'Inter',
      homeColor: 'bg-black',
      awayColor: 'bg-blue-800',
      competition: 'Serie A • Derby d\'Italia',
      odds: { home: 2.40, draw: 3.10, away: 3.00 },
      volume: '$290K',
      interest: 'Normal',
    },
    {
      time: '18:30',
      date: 'Tomorrow',
      league: 'BUN',
      leagueColor: 'yellow',
      home: 'Dortmund',
      away: 'Bayern',
      homeColor: 'bg-red-600',
      awayColor: 'bg-red-500',
      competition: 'Bundesliga • Der Klassiker',
      odds: { home: 3.20, draw: 3.80, away: 2.10 },
      volume: '$520K',
      interest: 'Hot fixture',
    },
  ];

  const leaguePerformance = [
    { name: 'Premier League', change: '+12.5%', volume: '$450K', width: '85%', color: 'bg-blue-500' },
    { name: 'La Liga', change: '+8.3%', volume: '$320K', width: '72%', color: 'bg-purple-500' },
    { name: 'Champions League', change: '+24.1%', volume: '$290K', width: '68%', color: 'bg-indigo-500' },
    { name: 'Bundesliga', change: '-2.1%', volume: '$180K', width: '45%', color: 'bg-yellow-500' },
  ];

  const popularMarkets = [
    { icon: '⚽', name: 'Match Winner', percentage: '68% of bets' },
    { icon: '🎯', name: 'Over/Under 2.5', percentage: '45% of bets' },
    { icon: '🤝', name: 'BTTS', percentage: '32% of bets' },
    { icon: '📊', name: 'Correct Score', percentage: '18% of bets' },
  ];

  const getOddsChangeIcon = (change) => {
    if (change === 'up') return { symbol: '▲', color: 'text-emerald-600' };
    if (change === 'down') return { symbol: '▼', color: 'text-red-500' };
    return null;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <header className="sticky top-0 z-10 glass-panel border-b border-slate-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Football</h2>
                <p className="text-sm text-slate-500">Live matches & upcoming fixtures</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full live-indicator"></span>
              24 LIVE MATCHES
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Live Matches</p>
              <h3 className="text-3xl font-bold text-slate-800">24</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +3
            </span>
            <span className="text-slate-400">from yesterday</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Volume</p>
              <h3 className="text-3xl font-bold text-slate-800">$1.2M</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +8.4%
            </span>
            <span className="text-slate-400">today</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Bets</p>
              <h3 className="text-3xl font-bold text-slate-800">8,432</h3>
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
              +12%
            </span>
            <span className="text-slate-400">this hour</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Avg Odds</p>
              <h3 className="text-3xl font-bold text-slate-800">2.45</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Market average: 2.38</span>
          </div>
        </div>
      </div>

      {/* League Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center gap-3 overflow-x-auto scroll-hide pb-2">
          {leagues.map((league) => (
            <button
              key={league.id}
              onClick={() => setActiveLeague(league.id)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                activeLeague === league.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {league.icon && <span className="mr-2">{league.icon}</span>}
              {league.name}
            </button>
          ))}
        </div>
      </div>

      {/* Market Type Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scroll-hide">
        {markets.map((market) => (
          <button
            key={market}
            onClick={() => setActiveMarket(market)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
              activeMarket === market
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {market}
          </button>
        ))}
      </div>

      {/* Live Matches Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Live Matches
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Auto-refresh:</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                autoRefresh ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoRefresh ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Live Match Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {liveMatches.map((match) => (
            <div key={match.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden match-card hover:shadow-lg transition-all">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">LIVE</span>
                  <span className="text-sm font-medium">{match.league}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-mono">{match.timer}</div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">
                      {match.homeIcon}
                    </div>
                    <h4 className="font-bold text-slate-800">{match.homeTeam}</h4>
                    <p className="text-sm text-slate-500">Home</p>
                  </div>
                  <div className="px-8">
                    <div className="text-4xl font-bold text-slate-800 mb-1">
                      {match.score.home} - {match.score.away}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">{match.period}</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">
                      {match.awayIcon}
                    </div>
                    <h4 className="font-bold text-slate-800">{match.awayTeam}</h4>
                    <p className="text-sm text-slate-500">Away</p>
                  </div>
                </div>

                {/* Match Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 text-center text-sm">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <div className="text-slate-500 mb-1">Possession</div>
                    <div className="font-bold text-slate-800">{match.stats.possession}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <div className="text-slate-500 mb-1">Shots</div>
                    <div className="font-bold text-slate-800">{match.stats.shots}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <div className="text-slate-500 mb-1">Corners</div>
                    <div className="font-bold text-slate-800">{match.stats.corners}</div>
                  </div>
                </div>

                {/* Odds */}
                <div className="grid grid-cols-3 gap-3">
                  {['home', 'draw', 'away'].map((type) => {
                    const change = getOddsChangeIcon(match.oddsChange[type]);
                    return (
                      <button
                        key={type}
                        className="odds-button bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl p-3 text-center group transition-all"
                      >
                        <div className="text-xs text-slate-500 mb-1 group-hover:text-blue-600 uppercase">{type === 'home' ? '1' : type === 'draw' ? 'X' : '2'}</div>
                        <div className="font-bold text-slate-800 text-lg group-hover:text-blue-700">{match.odds[type].toFixed(2)}</div>
                        {change && (
                          <div className={`text-xs mt-1 ${change.color}`}>
                            {change.symbol} {Math.abs((Math.random() * 0.2).toFixed(2))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Matches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Upcoming Fixtures</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View Calendar
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Time</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">League</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Match</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">1</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">X</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">2</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Volume</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingMatches.map((match, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-800">{match.time}</div>
                      <div className="text-xs text-slate-500">{match.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 bg-${match.leagueColor}-100 text-${match.leagueColor}-700 text-xs font-bold rounded`}>
                        {match.league}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          <div className={`w-8 h-8 ${match.homeColor} rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white`}>
                            {match.home.substring(0, 3).toUpperCase()}
                          </div>
                          <div className={`w-8 h-8 ${match.awayColor} rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white`}>
                            {match.away.substring(0, 3).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{match.home} vs {match.away}</div>
                          <div className="text-xs text-slate-500">{match.competition}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="odds-button px-4 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg font-bold text-slate-800 hover:text-blue-700 transition-all">
                        {match.odds.home.toFixed(2)}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="odds-button px-4 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg font-bold text-slate-800 hover:text-blue-700 transition-all">
                        {match.odds.draw.toFixed(2)}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="odds-button px-4 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg font-bold text-slate-800 hover:text-blue-700 transition-all">
                        {match.odds.away.toFixed(2)}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-bold text-slate-800">{match.volume}</div>
                      <div className={`text-xs ${match.interest === 'Normal' ? 'text-slate-500' : 'text-emerald-600'}`}>
                        {match.interest}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">More Markets</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Betting Volume Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Football Betting Volume</h3>
            <p className="text-sm text-slate-500">Hourly distribution across top leagues</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg">Today</button>
            <button className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Week</button>
            <button className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Month</button>
          </div>
        </div>
        <div className="h-64">
          <Line ref={chartRef} data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Top Leagues Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h4 className="font-bold text-slate-800 mb-4">League Performance</h4>
          <div className="space-y-4">
            {leaguePerformance.map((league, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{league.name}</span>
                  <span className={`font-bold ${league.change.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                    {league.change}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`stat-bar ${league.color} h-2 rounded-full`} style={{ width: league.width }}></div>
                </div>
                <div className="text-xs text-slate-500 mt-1">{league.volume} volume</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800">Popular Markets</h4>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularMarkets.map((market, index) => (
              <div
                key={index}
                className="p-4 bg-slate-50 rounded-xl text-center hover:bg-blue-50 transition-colors cursor-pointer border border-slate-200 hover:border-blue-300"
              >
                <div className="text-2xl mb-2">{market.icon}</div>
                <div className="font-semibold text-slate-800 text-sm">{market.name}</div>
                <div className="text-xs text-slate-500 mt-1">{market.percentage}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-slate-800 mb-1">Featured Match</h5>
                <p className="text-sm text-slate-600">Liverpool vs Chelsea • Premier League • Tomorrow 20:00</p>
              </div>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                Pre-match Odds
              </button>
            </div>
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

export default Football;
