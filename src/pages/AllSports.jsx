import { useState, useEffect, useRef } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function AllSports() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('all');
  const volumeChartRef = useRef(null);
  const activityChartRef = useRef(null);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sports data
  const sports = [
    { name: 'Football', icon: '⚽', live: 48, events: 892, leagues: 'Premier, La Liga, UCL', color: 'blue', gradient: 'sport-gradient-football' },
    { name: 'Basketball', icon: '🏀', live: 24, events: 156, leagues: 'NBA, EuroLeague', color: 'orange', gradient: 'sport-gradient-basketball' },
    { name: 'Tennis', icon: '🎾', live: 18, events: 89, leagues: 'ATP, WTA, Grand Slam', color: 'green', gradient: 'sport-gradient-tennis' },
    { name: 'Cricket', icon: '🏏', live: 8, events: 34, leagues: 'IPL, Test, T20', color: 'teal', gradient: 'sport-gradient-cricket' },
    { name: 'Ice Hockey', icon: '🏒', live: 12, events: 56, leagues: 'NHL, KHL', color: 'cyan', gradient: 'sport-gradient-hockey' },
    { name: 'Baseball', icon: '⚾', live: 6, events: 42, leagues: 'MLB, NPB', color: 'indigo', gradient: 'sport-gradient-baseball' },
    { name: 'Rugby', icon: '🏉', live: 4, events: 28, leagues: 'Union, League', color: 'lime', gradient: 'sport-gradient-rugby' },
    { name: 'Golf', icon: '⛳', live: 3, events: 15, leagues: 'PGA, European', color: 'emerald', gradient: 'sport-gradient-golf' },
    { name: 'Esports', icon: '🎮', live: 32, events: 124, leagues: 'CS:GO, LoL, Dota 2', color: 'violet', gradient: 'sport-gradient-esports' },
    { name: 'MMA', icon: '🥊', live: 2, events: 12, leagues: 'UFC, Bellator', color: 'red', gradient: 'sport-gradient-mma' },
    { name: 'Boxing', icon: '🥊', live: 1, events: 8, leagues: 'Heavyweight, Title', color: 'amber', gradient: 'sport-gradient-boxing' },
    { name: 'Motorsport', icon: '🏎️', live: 0, events: 6, leagues: 'F1, MotoGP, NASCAR', color: 'slate', gradient: 'sport-gradient-motorsport' },
  ];

  // Live events data
  const liveEvents = [
    {
      sport: 'Football',
      icon: '⚽',
      event: 'Man United vs Liverpool',
      league: 'Premier League',
      status: "LIVE 67'",
      score: '2 - 1',
      odds1: 3.20,
      oddsX: 4.50,
      odds2: 1.95,
      volume: '$450K',
      volumeLabel: 'High volume',
    },
    {
      sport: 'Basketball',
      icon: '🏀',
      event: 'Lakers vs Warriors',
      league: 'NBA',
      status: 'LIVE Q3',
      score: '78 - 82',
      odds1: 2.10,
      oddsX: '-',
      odds2: 1.75,
      volume: '$380K',
      volumeLabel: 'Active',
    },
    {
      sport: 'Tennis',
      icon: '🎾',
      event: 'Alcaraz vs Djokovic',
      league: 'Wimbledon • Final',
      status: 'LIVE Set 3',
      score: '1 - 1',
      odds1: 1.85,
      oddsX: '-',
      odds2: 2.00,
      volume: '$290K',
      volumeLabel: 'Trending',
    },
    {
      sport: 'Cricket',
      icon: '🏏',
      event: 'India vs Australia',
      league: 'Test Match • Day 3',
      status: 'LIVE 45.2',
      score: '312/4',
      odds1: 1.65,
      oddsX: 3.20,
      odds2: 5.50,
      volume: '$180K',
      volumeLabel: 'Steady',
    },
    {
      sport: 'Esports',
      icon: '🎮',
      event: 'NAVI vs FaZe',
      league: 'CS:GO • IEM Cologne',
      status: 'LIVE Map 2',
      score: '1 - 0',
      odds1: 1.45,
      oddsX: '-',
      odds2: 2.80,
      volume: '$220K',
      volumeLabel: 'Hot',
    },
  ];

  // Upcoming highlights
  const highlights = [
    {
      sport: 'Football',
      icon: '⚽',
      flag: '🇪🇸',
      event: 'Real Madrid vs Barcelona',
      league: "La Liga • El Clásico • Today 20:00",
      volume: '$2.1M volume',
      interest: '+450% interest',
      color: 'blue',
    },
    {
      sport: 'Basketball',
      icon: '🏀',
      flag: '🇺🇸',
      event: 'Celtics vs Heat',
      league: 'NBA Playoffs • Game 7 • Tomorrow 01:30',
      volume: '$1.8M volume',
      interest: '+320% interest',
      color: 'orange',
    },
    {
      sport: 'Tennis',
      icon: '🎾',
      flag: '🇬🇧',
      event: 'Wimbledon Final',
      league: "Men's Singles • Sunday 14:00",
      volume: '$950K volume',
      interest: 'Awaiting finalists',
      color: 'green',
    },
  ];

  // Volume chart data
  const volumeChartData = {
    labels: ['Football', 'Esports', 'Basketball', 'Tennis', 'Others'],
    datasets: [
      {
        data: [42, 18, 15, 12, 13],
        backgroundColor: ['#3b82f6', '#8b5cf6', '#f97316', '#22c55e', '#94a3b8'],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const volumeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Activity chart data
  const activityChartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    datasets: [
      {
        label: 'In-Play',
        data: [120, 80, 200, 350, 480, 620, 450],
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Pre-match',
        data: [200, 150, 300, 400, 350, 280, 220],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const activityChartOptions = {
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

  const getSportColor = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      orange: 'text-orange-600 bg-orange-100',
      green: 'text-green-600 bg-green-100',
      teal: 'text-teal-600 bg-teal-100',
      cyan: 'text-cyan-600 bg-cyan-100',
      indigo: 'text-indigo-600 bg-indigo-100',
      lime: 'text-lime-600 bg-lime-100',
      emerald: 'text-emerald-600 bg-emerald-100',
      violet: 'text-violet-600 bg-violet-100',
      red: 'text-red-600 bg-red-100',
      amber: 'text-amber-600 bg-amber-100',
      slate: 'text-slate-600 bg-slate-100',
    };
    return colors[color] || colors.blue;
  };

  const getHighlightColor = (color) => {
    const colors = {
      blue: 'from-blue-50 to-indigo-50 border-blue-200',
      orange: 'from-orange-50 to-amber-50 border-orange-200',
      green: 'from-green-50 to-emerald-50 border-green-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <header className="sticky top-0 z-10 glass-panel border-b border-slate-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">All Sports</h2>
                <p className="text-sm text-slate-500">Complete sports betting overview</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-rose-500 rounded-full live-indicator"></span>
              156 LIVE EVENTS
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

      {/* Quick Filters */}
      <div className="flex items-center gap-3 overflow-x-auto scroll-hide pb-2">
        {[
          { id: 'all', label: 'All Events', icon: true },
          { id: 'live', label: 'Live Now', pulse: true },
          { id: 'soon', label: 'Starting Soon' },
          { id: 'leagues', label: 'Top Leagues' },
          { id: 'popular', label: 'Popular' },
          { id: 'asian', label: 'Asian Markets' },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`quick-filter px-6 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
              activeFilter === filter.id
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filter.icon && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
            {filter.pulse && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
            {filter.label}
          </button>
        ))}
      </div>

      {/* Sports Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {sports.map((sport, index) => (
          <div
            key={index}
            className={`sport-card ${sport.gradient} rounded-2xl p-5 border border-${sport.color}-200 cursor-pointer hover:shadow-lg transition-all`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="sport-icon-wrap w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm bg-white">
                {sport.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${getSportColor(sport.color)}`}>
                {sport.live} LIVE
              </span>
            </div>
            <h4 className="font-bold text-slate-800 mb-1">{sport.name}</h4>
            <p className="text-xs text-slate-500 mb-3">{sport.leagues}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">{sport.events} events</span>
              <svg className={`w-4 h-4 text-${sport.color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Live Events Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Live Events
            </h3>
            <p className="text-sm text-slate-500">Real-time matches across all sports</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button className="px-4 py-2 bg-rose-100 text-rose-700 font-semibold rounded-lg text-sm hover:bg-rose-200 transition-colors">
              View All Live
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Sport</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Event</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Score</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">1</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">X</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">2</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {liveEvents.map((event, index) => (
                <tr key={index} className="event-row hover:bg-slate-50 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{event.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{event.sport}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{event.event}</div>
                    <div className="text-xs text-slate-500">{event.league}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="match-live text-sm font-bold text-red-600 pl-3">{event.status}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-slate-800">{event.score}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="odds-btn px-4 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg font-bold text-slate-800 hover:text-blue-700 transition-all">
                      {event.odds1}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {event.oddsX === '-' ? (
                      <span className="text-slate-400">-</span>
                    ) : (
                      <button className="odds-btn px-4 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg font-bold text-slate-800 hover:text-blue-700 transition-all">
                        {event.oddsX}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="odds-btn px-4 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg font-bold text-slate-800 hover:text-blue-700 transition-all">
                      {event.odds2}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-bold text-slate-800">{event.volume}</div>
                    <div className={`text-xs ${event.volumeLabel === 'High volume' || event.volumeLabel === 'Active' || event.volumeLabel === 'Trending' || event.volumeLabel === 'Hot' ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {event.volumeLabel}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Highlights & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Highlights */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-800 text-lg">Upcoming Highlights</h4>
            <button className="text-sm text-rose-600 hover:text-rose-700 font-medium">Full Schedule</button>
          </div>
          <div className="space-y-4">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 bg-gradient-to-r rounded-xl border transition-all hover:shadow-md ${getHighlightColor(highlight.color)}`}
              >
                <div className="flex-shrink-0">
                  <div className={`w-14 h-14 bg-${highlight.color}-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                    {highlight.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="country-flag text-xl">{highlight.flag}</span>
                    <span className="font-bold text-slate-800">{highlight.event}</span>
                  </div>
                  <div className="text-sm text-slate-600 mb-2">{highlight.league}</div>
                  <div className="flex items-center gap-2">
                    <span className="stat-pill px-2 py-1 bg-white rounded text-xs font-medium text-slate-600">{highlight.volume}</span>
                    <span className={`stat-pill px-2 py-1 bg-white rounded text-xs font-medium ${highlight.interest.includes('+') ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {highlight.interest}
                    </span>
                  </div>
                </div>
                <button className={`px-4 py-2 bg-${highlight.color}-600 hover:bg-${highlight.color}-700 text-white font-semibold rounded-lg transition-colors`}>
                  Pre-match
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sports Volume Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h4 className="font-bold text-slate-800 text-lg mb-6">Volume by Sport</h4>
          <div className="h-48 mb-4">
            <Doughnut ref={volumeChartRef} data={volumeChartData} options={volumeChartOptions} />
          </div>
          <div className="space-y-3">
            {[
              { name: 'Football', color: 'bg-blue-500', percentage: '42%' },
              { name: 'Esports', color: 'bg-violet-500', percentage: '18%' },
              { name: 'Basketball', color: 'bg-orange-500', percentage: '15%' },
              { name: 'Tennis', color: 'bg-green-500', percentage: '12%' },
              { name: 'Others', color: 'bg-slate-400', percentage: '13%' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{item.percentage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Betting Activity Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-800">24h Betting Activity</h3>
            <p className="text-sm text-slate-500">Volume across all sports categories</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-medium bg-rose-100 text-rose-700 rounded-lg">All Sports</button>
            <button className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">In-Play</button>
            <button className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Pre-match</button>
          </div>
        </div>
        <div className="h-64">
          <Line ref={activityChartRef} data={activityChartData} options={activityChartOptions} />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-slate-400 text-sm py-6">
        <p>© 2026 ProBet Gaming. All rights reserved. Licensed and regulated.</p>
      </footer>
    </div>
  );
}

export default AllSports;
