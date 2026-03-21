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

function Analytics() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveBets, setLiveBets] = useState(18429);
  const [liveUsers, setLiveUsers] = useState(8932);
  const [bps, setBps] = useState(842);
  const [betsPerMin, setBetsPerMin] = useState(4247);
  const [totalHandle, setTotalHandle] = useState(48247593);
  const [ggr, setGgr] = useState(6824150);
  const mainChartRef = useRef(null);
  const miniChart1Ref = useRef(null);
  const velocityChartRef = useRef(null);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Live number fluctuations
  useEffect(() => {
    const intervals = [
      setInterval(() => setLiveBets(prev => prev + Math.floor(Math.random() * 50) - 25), 3000),
      setInterval(() => setLiveUsers(prev => prev + Math.floor(Math.random() * 30) - 15), 3500),
      setInterval(() => setBps(prev => prev + Math.floor(Math.random() * 20) - 10), 2500),
      setInterval(() => setBetsPerMin(prev => prev + Math.floor(Math.random() * 100) - 50), 4000),
      setInterval(() => setTotalHandle(prev => prev + Math.floor(Math.random() * 5000) + 1000), 1500),
      setInterval(() => setGgr(prev => prev + Math.floor(Math.random() * 800) + 200), 2000),
    ];
    return () => intervals.forEach(clearInterval);
  }, []);

  // Main Chart Data
  const [mainChartData, setMainChartData] = useState({
    labels: Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - (29 - i));
      return d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
    }),
    datasets: [
      {
        label: 'Handle',
        data: Array.from({ length: 30 }, () => Math.random() * 2 + 1),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'GGR',
        data: Array.from({ length: 30 }, () => Math.random() * 0.3 + 0.1),
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        tension: 0.4,
        borderDash: [5, 5],
        pointRadius: 0,
      },
    ],
  });

  const mainChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#94a3b8',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#64748b', font: { size: 10 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: {
          color: '#64748b',
          font: { size: 10 },
          callback: (value) => '$' + value.toFixed(1) + 'M',
        },
      },
    },
    animation: { duration: 0 },
  };

  // Update main chart data
  useEffect(() => {
    const interval = setInterval(() => {
      setMainChartData((prev) => {
        const now = new Date();
        const timeLabel = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
        const newLabels = [...prev.labels.slice(1), timeLabel];
        const newData1 = [...prev.datasets[0].data.slice(1), Math.random() * 2 + 1.5];
        const newData2 = [...prev.datasets[1].data.slice(1), Math.random() * 0.3 + 0.15];
        return {
          labels: newLabels,
          datasets: [
            { ...prev.datasets[0], data: newData1 },
            { ...prev.datasets[1], data: newData2 },
          ],
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mini Chart 1 Data
  const [miniChart1Data, setMiniChart1Data] = useState({
    labels: Array.from({ length: 20 }, (_, i) => i),
    datasets: [
      {
        data: Array.from({ length: 20 }, () => Math.random() * 50 + 25),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
      },
    ],
  });

  const miniChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { point: { radius: 0 }, line: { tension: 0.4, borderWidth: 2 } },
    animation: { duration: 0 },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMiniChart1Data((prev) => {
        const newData = [...prev.datasets[0].data.slice(1), Math.random() * 50 + 25];
        return { ...prev, datasets: [{ ...prev.datasets[0], data: newData }] };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Velocity Chart Data
  const [velocityChartData, setVelocityChartData] = useState({
    labels: Array.from({ length: 20 }, (_, i) => i),
    datasets: [
      {
        data: Array.from({ length: 20 }, () => Math.random() * 50 + 25),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setVelocityChartData((prev) => {
        const newData = [...prev.datasets[0].data.slice(1), Math.random() * 50 + 25];
        return { ...prev, datasets: [{ ...prev.datasets[0], data: newData }] };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Recent wins data
  const [recentWins, setRecentWins] = useState([
    { game: 'Lightning Roulette', user: 'lucky_strike_99', amount: 125000, color: 'purple' },
    { game: 'Ascot Gold Cup', user: 'punter_pro', amount: 45000, color: 'emerald' },
    { game: 'Mega Moolah', user: 'jackpot_hunter', amount: 12400, color: 'amber' },
    { game: 'In-Play Acca', user: 'footy_king', amount: 8750, color: 'blue' },
  ]);

  // Add new wins occasionally
  useEffect(() => {
    const games = ['Lightning Roulette', 'Blackjack VIP', 'Ascot Racing', 'Mega Moolah', 'Book of Dead', 'In-Play Football'];
    const users = ['high_roller_1', 'lucky_devil', 'big_winner_99', 'casino_king', 'bet_master'];
    const amounts = [45000, 82000, 15000, 230000, 67000, 12000];
    const colors = ['emerald', 'purple', 'amber', 'blue'];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newWin = {
          game: games[Math.floor(Math.random() * games.length)],
          user: users[Math.floor(Math.random() * users.length)],
          amount: amounts[Math.floor(Math.random() * amounts.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        setRecentWins((prev) => [newWin, ...prev.slice(0, 6)]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const colorClasses = {
    purple: 'border-purple-500 text-purple-400',
    emerald: 'border-emerald-500 text-emerald-400',
    amber: 'border-amber-500 text-amber-400',
    blue: 'border-blue-500 text-blue-400',
    rose: 'border-rose-500 text-rose-400',
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* Top Status Bar */}
      <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full live-indicator"></span>
            <span className="text-emerald-400 font-semibold">SYSTEM ONLINE</span>
          </div>
          <div className="h-4 w-px bg-slate-700"></div>
          <span className="text-slate-400">
            Data Stream: <span className="text-emerald-400 font-mono">ACTIVE</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">
            Latency: <span className="font-mono text-emerald-400">12ms</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">
            Updates: <span className="font-mono text-indigo-400">Real-time</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-500 font-mono">
            {currentTime.toISOString().split('T')[1].split('.')[0]} UTC
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">ProBet Analytics v4.2.1</span>
        </div>
      </div>

      {/* Live Ticker */}
      <div className="h-10 bg-slate-800/50 border-b border-slate-700 flex items-center overflow-hidden">
        <div className="flex items-center gap-8 px-4 text-sm whitespace-nowrap animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Handle (24h):</span>
            <span className="font-mono font-bold text-emerald-400">${(totalHandle / 1000000).toFixed(1)}M</span>
            <span className="text-emerald-500 text-xs">▲ 2.4%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Active Bets:</span>
            <span className="font-mono font-bold text-indigo-400">{liveBets.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">GGR:</span>
            <span className="font-mono font-bold text-amber-400">${(ggr / 1000000).toFixed(1)}M</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Online Users:</span>
            <span className="font-mono font-bold text-blue-400">{liveUsers.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Biggest Win:</span>
            <span className="font-mono font-bold text-purple-400">$125,000</span>
            <span className="text-slate-500 text-xs">Slots • 2m ago</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Horse Racing:</span>
            <span className="font-mono font-bold text-rose-400">Ascot Gold Cup</span>
            <span className="text-rose-500 text-xs">LIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Football:</span>
            <span className="font-mono font-bold text-sky-400">Man City vs Arsenal</span>
            <span className="text-sky-500 text-xs">87'</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-4 p-4 overflow-hidden">
        {/* Left Column: Core Metrics */}
        <div className="col-span-3 row-span-6 flex flex-col gap-4">
          {/* Primary KPIs */}
          <div className="glass-dark rounded-xl p-4 metric-glow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Handle</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full live-indicator"></span>
            </div>
            <div className="text-4xl font-bold text-white font-mono mb-2">${totalHandle.toLocaleString()}</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-emerald-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +18.4%
              </span>
              <span className="text-slate-500">vs 24h ago</span>
            </div>
            <div className="mt-4 h-16">
              <Line ref={miniChart1Ref} data={miniChart1Data} options={miniChartOptions} />
            </div>
          </div>

          {/* GGR */}
          <div className="glass-dark rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Gaming Revenue</span>
              <span className="w-2 h-2 bg-amber-500 rounded-full live-indicator"></span>
            </div>
            <div className="text-4xl font-bold text-white font-mono mb-2">${ggr.toLocaleString()}</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-emerald-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +22.1%
              </span>
              <span className="text-slate-500">Margin 14.1%</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-800/50 rounded p-2">
                <div className="text-xs text-slate-400">Sports</div>
                <div className="text-sm font-bold text-emerald-400 font-mono">42%</div>
              </div>
              <div className="bg-slate-800/50 rounded p-2">
                <div className="text-xs text-slate-400">Casino</div>
                <div className="text-sm font-bold text-amber-400 font-mono">35%</div>
              </div>
              <div className="bg-slate-800/50 rounded p-2">
                <div className="text-xs text-slate-400">Live</div>
                <div className="text-sm font-bold text-purple-400 font-mono">23%</div>
              </div>
            </div>
          </div>

          {/* Live Activity Monitor */}
          <div className="glass-dark rounded-xl p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Activity Monitor</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded font-bold">LIVE</span>
            </div>
            <div className="space-y-3 overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg">🏇</div>
                  <div>
                    <div className="text-sm font-semibold text-white">Horse Racing</div>
                    <div className="text-xs text-slate-400">Ascot • 14:30</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-400 font-mono">$2.4M</div>
                  <div className="text-xs text-emerald-500">▲ 12%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-lg">⚽</div>
                  <div>
                    <div className="text-sm font-semibold text-white">Football</div>
                    <div className="text-xs text-slate-400">MCI vs ARS • 87'</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-400 font-mono">$8.1M</div>
                  <div className="text-xs text-blue-500">Live</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-lg">🎮</div>
                  <div>
                    <div className="text-sm font-semibold text-white">Esports</div>
                    <div className="text-xs text-slate-400">NAVI vs FaZe • BO3</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-400 font-mono">$1.2M</div>
                  <div className="text-xs text-purple-500">Map 2</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-lg">🎰</div>
                  <div>
                    <div className="text-sm font-semibold text-white">Casino</div>
                    <div className="text-xs text-slate-400">2,847 tables active</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-amber-400 font-mono">$12.5M</div>
                  <div className="text-xs text-amber-500">Peak</div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Concurrent Users</span>
                <span className="font-mono text-white">18,247</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 progress-pulse">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{ width: '73%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Main Visualization */}
        <div className="col-span-6 row-span-4 glass-dark rounded-xl p-4 relative" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Real-Time Volume Flow</h3>
              <p className="text-xs text-slate-400">Continuous transaction monitoring</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg font-medium">1H</button>
              <button className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs rounded-lg font-medium hover:bg-slate-600">24H</button>
              <button className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs rounded-lg font-medium hover:bg-slate-600">7D</button>
            </div>
          </div>
          <div className="h-[calc(100%-5rem)]">
            <Line ref={mainChartRef} data={mainChartData} options={mainChartOptions} />
          </div>
          {/* Overlay Stats */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between">
            <div className="glass-dark px-4 py-2 rounded-lg border border-slate-700">
              <div className="text-xs text-slate-400">Peak Volume</div>
              <div className="text-lg font-bold text-white font-mono">
                $2.4M <span className="text-xs text-slate-500">/min</span>
              </div>
            </div>
            <div className="glass-dark px-4 py-2 rounded-lg border border-slate-700">
              <div className="text-xs text-slate-400">Avg Bet Size</div>
              <div className="text-lg font-bold text-white font-mono">$47.50</div>
            </div>
            <div className="glass-dark px-4 py-2 rounded-lg border border-slate-700">
              <div className="text-xs text-slate-400">Bets/Second</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">{bps}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & System */}
        <div className="col-span-3 row-span-6 flex flex-col gap-4">
          {/* Critical Alerts */}
          <div className="glass-dark rounded-xl p-4 border border-rose-500/30 bg-rose-950/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                Risk Alerts
              </span>
              <span className="text-xs text-rose-400 font-mono">3 Active</span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto scroll-hide">
              <div className="p-3 bg-rose-900/30 border border-rose-700/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-rose-200 truncate">Sharp Money: Horse #7</p>
                    <p className="text-xs text-rose-400/80">$450K in 180s • Odds drift 4.5→2.1</p>
                    <p className="text-xs text-rose-500 mt-1 font-mono">2m ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-amber-900/30 border border-amber-700/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-amber-200 truncate">Arbitrage Alert</p>
                    <p className="text-xs text-amber-400/80">MCI-ARS Cross-market • $120K exposure</p>
                    <p className="text-xs text-amber-500 mt-1 font-mono">5m ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-300 truncate">VIP Large Stake</p>
                    <p className="text-xs text-slate-400">whale_2026 • $250K Kentucky Derby</p>
                    <p className="text-xs text-slate-500 mt-1 font-mono">12m ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="glass-dark rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Health</span>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Optimal
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">API Latency</span>
                  <span className="font-mono text-emerald-400">24ms</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full progress-pulse" style={{ width: '12%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Database Load</span>
                  <span className="font-mono text-emerald-400">34%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '34%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Payment Queue</span>
                  <span className="font-mono text-amber-400">78%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Memory Usage</span>
                  <span className="font-mono text-indigo-400">62%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Big Wins */}
          <div className="glass-dark rounded-xl p-4 flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Big Wins</span>
            </div>
            <div className="space-y-2 overflow-y-auto scroll-hide h-full">
              {recentWins.map((win, index) => (
                <div key={index} className={`flex items-center justify-between p-2 bg-slate-800/30 rounded border-l-2 ${colorClasses[win.color]}`}>
                  <div>
                    <div className="text-sm font-semibold text-white">{win.game}</div>
                    <div className="text-xs text-slate-400">User: {win.user}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold font-mono ${colorClasses[win.color].split(' ')[1]}`}>
                      ${win.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-emerald-400">Just now</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Detailed Metrics */}
        <div className="col-span-6 row-span-2 grid grid-cols-3 gap-4">
          {/* Geographic Distribution */}
          <div className="glass-dark rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Geographic Flow</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">🇬🇧</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">UK</span>
                    <span className="font-mono text-white">34.2%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '34.2%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">🇩🇪</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Germany</span>
                    <span className="font-mono text-white">28.7%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '28.7%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">🇧🇷</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Brazil</span>
                    <span className="font-mono text-white">18.4%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '18.4%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Betting Velocity */}
          <div className="glass-dark rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Betting Velocity</span>
              <span className="text-xs text-emerald-400">↑ High</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-white font-mono">{betsPerMin.toLocaleString()}</div>
                <div className="text-xs text-slate-400">Bets/min</div>
              </div>
              <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-white font-mono">${((betsPerMin * 47.5) / 1000).toFixed(0)}K</div>
                <div className="text-xs text-slate-400">Volume/min</div>
              </div>
            </div>
            <div className="h-16">
              <Line ref={velocityChartRef} data={velocityChartData} options={miniChartOptions} />
            </div>
          </div>

          {/* Conversion Funnel Live */}
          <div className="glass-dark rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Funnel</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Visitors</span>
                <span className="font-mono text-white">48,520</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3">
                <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Registered</span>
                <span className="font-mono text-emerald-400">9,704 (20%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3">
                <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Deposited</span>
                <span className="font-mono text-amber-400">3,881 (8%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3">
                <div className="bg-amber-500 h-3 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
