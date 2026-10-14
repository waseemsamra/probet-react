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

function Cricket() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [match1Time, setMatch1Time] = useState(45 * 60 + 30); // 45:30
  const [match2Time, setMatch2Time] = useState(22 * 60 + 15); // 22:15
  const [score1, setScore1] = useState({ home: 145, away: 128 }); // Runs
  const [score2, setScore2] = useState({ home: 87, away: 92 }); // Runs
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeLeague, setActiveLeague] = useState('all');
  const [activeMarket, setActiveMarket] = useState('Match Winner');
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

   // Enhanced live match updates - simulate realistic cricket progression
   useEffect(() => {
     if (!autoRefresh) return;

     const interval = setInterval(() => {
       // Update match timers
       setMatch1Time(prev => prev + 1);
       setMatch2Time(prev => prev + 1);
       
       // Update match 1 (IPL) scores and stats periodically
       if (Math.random() < 0.2) { // 20% chance each second
         setScore1(prev => {
           const homeIncrement = Math.floor(Math.random() * 8); // 0-7 runs
           const awayIncrement = Math.floor(Math.random() * 8); // 0-7 runs
           const homeWicket = Math.random() < 0.1; // 10% chance of wicket
           const awayWicket = Math.random() < 0.1; // 10% chance of wicket
           
           return {
             home: prev.home + homeIncrement,
             away: prev.away + awayIncrement
           };
         });
         
         // Update match 1 odds based on score changes
         setTimeout(() => {
           // Simulate odds movement - home team doing well lowers their odds
           // This is simplified - real odds calculation is more complex
         }, 50);
       }
       
       // Update match 2 (International) scores and stats periodically
       if (Math.random() < 0.15) { // 15% chance each second (slightly less active)
         setScore2(prev => {
           const homeIncrement = Math.floor(Math.random() * 6); // 0-5 runs
           const awayIncrement = Math.floor(Math.random() * 6); // 0-5 runs
           
           return {
             home: prev.home + homeIncrement,
             away: prev.away + awayIncrement
           };
         });
       }
       
       // Occasionally update match status/period
       if (Math.random() < 0.05) { // 5% chance each second
         // In a real app, we'd update period, stats, etc. based on actual match progression
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
        label: 'IPL',
        data: [25, 18, 22, 45, 68, 95, 72],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'International',
        data: [35, 28, 32, 55, 78, 110, 85],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'T20 Leagues',
        data: [20, 15, 18, 35, 52, 78, 60],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
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
    { id: 'ipl', name: 'IPL', icon: '🏆' },
    { id: 'intl', name: 'International', icon: '🌍' },
    { id: 'bbll', name: 'Big Bash', icon: '🎪' },
    { id: 'cpl', name: 'Caribbean Premier', icon: '🏝️' },
    { id: 't20w', name: 'T20 World Cup', icon: '🏆' },
  ];

  const markets = ['Match Winner', 'Top Batsman', 'Top Bowler', 'Total Runs', 'Over/Under', 'Method of Dismissal'];

  const liveMatches = [
    {
      id: 1,
      league: 'IPL',
      timer: formatTime(match1Time),
      homeTeam: 'Mumbai Indians',
      awayTeam: 'Chennai Super Kings',
      homeIcon: '💙',
      awayIcon: '💛',
      score: score1,
      period: '2nd Innings',
      stats: { overs: '18.4/20', runRate: '8.9', wickets: '3/10' },
      odds: { home: 1.85, draw: 0, away: 2.00 }, // No draw in cricket limited overs
      oddsChange: { home: 'up', draw: null, away: 'down' },
    },
    {
      id: 2,
      league: 'International',
      timer: formatTime(match2Time),
      homeTeam: 'Australia',
      awayTeam: 'England',
      homeIcon: '🦘',
      awayIcon: '🦁',
      score: score2,
      period: '45th Over',
      stats: { overs: '45/50', runRate: '5.8', wickets: '6/10' },
      odds: { home: 2.10, draw: 0, away: 1.75 },
      oddsChange: { home: 'down', draw: null, away: 'up' },
    },
  ];

  const upcomingMatches = [
    {
      time: '14:00',
      date: 'Today',
      league: 'IPL',
      leagueColor: 'emerald',
      home: 'RCB',
      away: 'KKR',
      homeColor: 'bg-red-600',
      awayColor: 'bg-purple-600',
      competition: 'Indian Premier League • Eliminator',
      odds: { home: 1.95, draw: 0, away: 1.90 },
      volume: '$280K',
      interest: 'High interest',
    },
    {
      time: '15:30',
      date: 'Today',
      league: 'Intl',
      leagueColor: 'red',
      home: 'IND',
      away: 'PAK',
      homeColor: 'bg-orange-500',
      awayColor: 'bg-green-600',
      competition: 'Asia Cup • Super Four',
      odds: { home: 1.80, draw: 0, away: 2.10 },
      volume: '$420K',
      interest: 'Hot fixture',
    },
    {
      time: '19:45',
      date: 'Today',
      league: 'BBL',
      leagueColor: 'orange',
      home: 'PER',
      away: 'SYD',
      homeColor: 'bg-purple-600',
      awayColor: 'bg-yellow-500',
      competition: 'Big Bash League • Semi Final',
      odds: { home: 2.20, draw: 0, away: 1.70 },
      volume: '$190K',
      interest: 'Normal',
    },
    {
      time: '10:00',
      date: 'Tomorrow',
      league: 'CPL',
      leagueColor: 'yellow',
      home: 'JAM',
      away: 'TT',
      homeColor: 'bg-yellow-500',
      awayColor: 'bg-red-600',
      competition: 'Caribbean Premier League • Final',
      odds: { home: 1.75, draw: 0, away: 2.15 },
      volume: '$150K',
      interest: 'Trending',
    },
  ];

  const leaguePerformance = [
    { name: 'IPL', change: '+18.5%', volume: '$380K', width: '80%', color: 'bg-emerald-500' },
    { name: 'International', change: '+12.3%', volume: '$320K', width: '75%', color: 'bg-red-500' },
    { name: 'T20 Leagues', change: '+24.1%', volume: '$290K', width: '70%', color: 'bg-yellow-500' },
    { name: 'Big Bash', change: '-3.2%', volume: '$180K', width: '50%', color: 'bg-orange-500' },
  ];

  const popularMarkets = [
    { icon: '🏆', name: 'Match Winner', percentage: '52% of bets' },
    { icon: '⚾', name: 'Top Batsman', percentage: '28% of bets' },
    { icon: '🎯', name: 'Top Bowler', percentage: '22% of bets' },
    { icon: '📊', name: 'Total Runs', percentage: '18% of bets' },
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
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <div className="w-6 h-6 flex items-center justify-center">
                  🏏
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Cricket</h2>
                <p className="text-sm text-slate-500">Live matches & upcoming fixtures</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full live-indicator"></span>
              12 LIVE MATCHES
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
      <div className="overflow-x-auto flex flex-nowrap gap-6 px-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover flex-shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Live Matches</p>
              <h3 className="text-3xl font-bold text-slate-800">12</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <div className="w-6 h-6 flex items-center justify-center">
                🏏
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +2
            </span>
            <span className="text-slate-400">from yesterday</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover flex-shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Volume</p>
              <h3 className="text-3xl font-bold text-slate-800">$850K</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +6.8%
            </span>
            <span className="text-slate-400">today</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover flex-shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Bets</p>
              <h3 className="text-3xl font-bold text-slate-800">5,240</h3>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 002-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +15%
            </span>
            <span className="text-slate-400">this hour</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover flex-shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Avg Odds</p>
              <h3 className="text-3xl font-bold text-slate-800">2.15</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Market average: 2.08</span>
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
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg'
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
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
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
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                autoRefresh ? 'bg-emerald-600' : 'bg-slate-300'
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
        <div className="overflow-x-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {liveMatches.map((match) => (
            <div key={match.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden match-card hover:shadow-lg transition-all">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 flex items-center justify-between text-white">
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
                    <div className="text-slate-500 mb-1">Overs</div>
                    <div className="font-bold text-slate-800">{match.stats.overs}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <div className="text-slate-500 mb-1">Run Rate</div>
                    <div className="font-bold text-slate-800">{match.stats.runRate}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <div className="text-slate-500 mb-1">Wickets</div>
                    <div className="font-bold text-slate-800">{match.stats.wickets}</div>
                  </div>
                </div>

                {/* Odds */}
                <div className="grid grid-cols-3 gap-3">
                  {['home', 'draw', 'away'].map((type) => {
                    const change = getOddsChangeIcon(match.oddsChange[type]);
                    return (
                      <button
                        key={type}
                        className="odds-button bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl p-3 text-center group transition-all"
                      >
                        <div className="text-xs text-slate-500 mb-1 group-hover:text-emerald-600 uppercase">{type === 'home' ? '1' : type === 'draw' ? 'X' : '2'}</div>
                        <div className="font-bold text-slate-800 text-lg group-hover:text-emerald-700">{match.odds[type] === 0 ? '-' : match.odds[type].toFixed(2)}</div>
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
          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
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
                            {match.home.substring(0, 2).toUpperCase()}
                          </div>
                          <div className={`w-8 h-8 ${match.awayColor} rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white`}>
                            {match.away.substring(0, 2).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{match.home} vs {match.away}</div>
                          <div className="text-xs text-slate-500">{match.competition}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="odds-button px-4 py-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg font-bold text-slate-800 hover:text-emerald-700 transition-all">
                        {match.odds.home === 0 ? '-' : match.odds.home.toFixed(2)}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="odds-button px-4 py-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg font-bold text-slate-800 hover:text-emerald-700 transition-all">
                        {match.odds.draw === 0 ? '-' : match.odds.draw.toFixed(2)}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="odds-button px-4 py-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg font-bold text-slate-800 hover:text-emerald-700 transition-all">
                        {match.odds.away === 0 ? '-' : match.odds.away.toFixed(2)}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-bold text-slate-800">{match.volume}</div>
                      <div className={`text-xs ${match.interest === 'Normal' ? 'text-slate-500' : 'text-emerald-600'}`}>
                        {match.interest}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">More Markets</button>
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
            <h3 className="font-bold text-lg text-slate-800">Cricket Betting Volume</h3>
            <p className="text-sm text-slate-500">Hourly distribution across top leagues</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-lg">Today</button>
            <button className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Week</button>
            <button className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Month</button>
          </div>
        </div>
        <div className="h-64">
          <Line ref={chartRef} data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Top Leagues Performance */}
      <div className="overflow-x-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">View All</button>
          </div>
          <div className="overflow-x-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularMarkets.map((market, index) => (
              <div
                key={index}
                className="p-4 bg-slate-50 rounded-xl text-center hover:bg-emerald-50 transition-colors cursor-pointer border border-slate-200 hover:border-emerald-300"
              >
                <div className="text-2xl mb-2">{market.icon}</div>
                <div className="font-semibold text-slate-800 text-sm">{market.name}</div>
                <div className="text-xs text-slate-500 mt-1">{market.percentage}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-slate-800 mb-1">Featured Match</h5>
                <p className="text-sm text-slate-600">IND vs PAK • Asia Cup • Tomorrow 15:30</p>
              </div>
              <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors">
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

export default Cricket;