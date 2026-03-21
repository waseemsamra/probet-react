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

function Reports() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('sport');
  const [activeDateRange, setActiveDateRange] = useState('today');
  const chartRef = useRef(null);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Chart data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: [380, 420, 390, 450, 520, 680, 590],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Profit',
        data: [120, 145, 130, 165, 195, 245, 210],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Payouts',
        data: [260, 275, 260, 285, 325, 435, 380],
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
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#94a3b8',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
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
          font: { size: 11 },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  // KPI Data
  const kpis = [
    {
      title: 'Gross Revenue',
      value: '$2.84M',
      change: '+12.5%',
      isPositive: true,
      target: '$2.5M',
      achieved: '113%',
      icon: 'emerald',
      type: 'positive',
    },
    {
      title: 'Net Profit',
      value: '$892K',
      change: '+8.3%',
      isPositive: true,
      target: 'Margin: 31.4%',
      achieved: '+2.1% vs target',
      icon: 'emerald',
      type: 'positive',
    },
    {
      title: 'Total Bets',
      value: '1.24M',
      change: '+5.7%',
      isPositive: true,
      target: 'Avg bet: $28.50',
      achieved: '+$2.10 increase',
      icon: 'indigo',
      type: 'neutral',
    },
    {
      title: 'Payout Ratio',
      value: '94.2%',
      change: '+1.2%',
      isPositive: false,
      target: 'Industry avg: 92%',
      achieved: '2.2% above',
      icon: 'rose',
      type: 'negative',
    },
  ];

  // Report Types
  const reportTypes = [
    {
      title: 'Financial Summary',
      description: 'Revenue, profit, and margin analysis across all channels',
      icon: 'blue',
      iconSvg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      badge: 'Popular',
      lastGenerated: '2h ago',
    },
    {
      title: 'User Activity',
      description: 'Registration, retention, and engagement metrics',
      icon: 'emerald',
      iconSvg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      badge: 'Updated',
      lastGenerated: '15m ago',
    },
    {
      title: 'Betting Analytics',
      description: 'Volume, odds, and market performance analysis',
      icon: 'amber',
      iconSvg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      badge: 'New',
      lastGenerated: '1h ago',
    },
    {
      title: 'Risk & Compliance',
      description: 'Fraud detection, AML, and regulatory reports',
      icon: 'violet',
      iconSvg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      badge: 'Alert',
      lastGenerated: '30m ago',
    },
  ];

  // Sports Performance Data
  const sportsData = [
    {
      name: 'Football',
      icon: '⚽',
      bets: '542,893',
      percentage: '43.8%',
      volume: '$1.24M',
      volumeChange: '+15.2%',
      revenue: '$1.08M',
      profit: '$342K',
      margin: '31.7%',
      trend: 'up',
      trendValue: '+12.5%',
    },
    {
      name: 'Esports',
      icon: '🎮',
      bets: '312,456',
      percentage: '25.2%',
      volume: '$684K',
      volumeChange: '+28.4%',
      revenue: '$612K',
      profit: '$198K',
      margin: '32.4%',
      trend: 'up',
      trendValue: '+28.4%',
    },
    {
      name: 'Basketball',
      icon: '🏀',
      bets: '198,234',
      percentage: '16.0%',
      volume: '$456K',
      volumeChange: '+8.7%',
      revenue: '$398K',
      profit: '$124K',
      margin: '31.2%',
      trend: 'up',
      trendValue: '+8.7%',
    },
    {
      name: 'Tennis',
      icon: '🎾',
      bets: '124,567',
      percentage: '10.0%',
      volume: '$298K',
      volumeChange: '-3.2%',
      revenue: '$267K',
      profit: '$89K',
      margin: '33.3%',
      trend: 'down',
      trendValue: '-3.2%',
    },
    {
      name: 'Casino',
      icon: '🎰',
      bets: '62,890',
      percentage: '5.0%',
      volume: '$162K',
      volumeChange: '+18.9%',
      revenue: '$142K',
      profit: '$40K',
      margin: '28.2%',
      trend: 'up',
      trendValue: '+18.9%',
    },
  ];

  // AI Insights
  const insights = [
    {
      icon: '📈',
      color: 'emerald',
      title: 'Esports betting volume up 28%',
      description: 'Driven by IEM Katowice and LCK Spring finals. Consider increasing odds margin for CS:GO markets.',
    },
    {
      icon: '⚠️',
      color: 'amber',
      title: 'Tennis margin below target',
      description: 'Current 33.3% vs 35% target. Review odds compilation for clay court season.',
    },
    {
      icon: '💡',
      color: 'blue',
      title: 'VIP retention opportunity',
      description: '3 high-value players showing decreased activity. Trigger personalized bonus campaign.',
    },
  ];

  // Scheduled Reports
  const scheduledReports = [
    {
      title: 'Daily P&L Summary',
      schedule: 'Email at 08:00 UTC',
      icon: 'emerald',
      status: 'Active',
    },
    {
      title: 'Weekly Risk Report',
      schedule: 'Mondays at 09:00 UTC',
      icon: 'blue',
      status: 'Active',
    },
    {
      title: 'Monthly Performance',
      schedule: '1st of month at 10:00 UTC',
      icon: 'violet',
      status: 'Active',
    },
  ];

  const getIconColor = (color) => {
    const colors = {
      emerald: 'bg-emerald-100 text-emerald-600',
      blue: 'bg-blue-100 text-blue-600',
      amber: 'bg-amber-100 text-amber-600',
      violet: 'bg-violet-100 text-violet-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      rose: 'bg-rose-100 text-rose-600',
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
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Reports</h2>
                <p className="text-sm text-slate-500">Financial & operational analytics</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full live-indicator"></span>
              REAL-TIME DATA
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Mar 14 - Mar 20, 2026</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
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

      {/* Date Range & Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: '7days', label: 'Last 7 Days' },
            { id: '30days', label: 'Last 30 Days' },
            { id: 'month', label: 'This Month' },
            { id: 'custom', label: 'Custom', icon: true },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setActiveDateRange(range.id)}
              className={`date-range-btn px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeDateRange === range.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {range.icon && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              {range.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="export-btn px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
          <button className="export-btn px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Export PDF
          </button>
          <button className="export-btn px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 flex items-center gap-2 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className={`kpi-card ${kpi.type} rounded-2xl p-6 shadow-sm border-l-4 ${
              kpi.type === 'positive' ? 'border-emerald-500' :
              kpi.type === 'negative' ? 'border-rose-500' :
              'border-indigo-500'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{kpi.title}</p>
                <h3 className="text-3xl font-bold text-slate-800">{kpi.value}</h3>
              </div>
              <div className={`p-2 ${getIconColor(kpi.icon)} rounded-lg`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {kpi.icon === 'emerald' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                  {kpi.icon === 'indigo' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  )}
                  {kpi.icon === 'rose' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  )}
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className={`font-semibold flex items-center gap-1 ${kpi.isPositive ? 'text-emerald-600 metric-trend-up' : 'text-rose-600 metric-trend-down'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {kpi.isPositive ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  )}
                </svg>
                {kpi.change}
              </span>
              <span className="text-slate-400">vs last period</span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{kpi.target}</span>
                <span className={`${kpi.isPositive ? 'text-emerald-600' : 'text-rose-600'} font-bold`}>{kpi.achieved}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report, index) => (
          <div
            key={index}
            className="report-card bg-white rounded-2xl p-6 border border-slate-200 shadow-sm cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`report-type-icon w-12 h-12 ${getIconColor(report.icon)} rounded-xl flex items-center justify-center`}>
                {report.iconSvg}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                report.badge === 'Popular' ? 'bg-blue-50 text-blue-600' :
                report.badge === 'Updated' ? 'bg-emerald-50 text-emerald-600' :
                report.badge === 'New' ? 'bg-amber-50 text-amber-600' :
                'bg-violet-50 text-violet-600'
              }`}>
                {report.badge}
              </span>
            </div>
            <h4 className="font-bold text-slate-800 mb-2">{report.title}</h4>
            <p className="text-sm text-slate-500 mb-4">{report.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Last generated: {report.lastGenerated}</span>
              <svg className={`w-5 h-5 ${getIconColor(report.icon).split(' ')[1]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Revenue & Profit Trends</h3>
            <p className="text-sm text-slate-500">Daily performance over selected period</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span className="text-sm text-slate-600">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-sm text-slate-600">Profit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="text-sm text-slate-600">Payouts</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <Line ref={chartRef} data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Sports Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200 px-6">
          <div className="flex items-center gap-8 overflow-x-auto">
            {[
              { id: 'sport', label: 'Sport Performance' },
              { id: 'market', label: 'Market Analysis' },
              { id: 'geographic', label: 'Geographic' },
              { id: 'device', label: 'Device & Platform' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Sport</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Bets</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Volume</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Revenue</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Profit</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Margin</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sportsData.map((sport, index) => (
                  <tr key={index} className="data-table-row hover:bg-slate-50 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${getIconColor(sport.name === 'Football' ? 'blue' : sport.name === 'Esports' ? 'violet' : sport.name === 'Basketball' ? 'amber' : sport.name === 'Tennis' ? 'emerald' : 'rose')} rounded-lg flex items-center justify-center text-xl`}>
                          {sport.icon}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{sport.name}</div>
                          <div className="text-xs text-slate-500">{sport.name === 'Football' ? 'All leagues' : sport.name === 'Esports' ? 'CS:GO, LoL, Dota 2' : sport.name === 'Basketball' ? 'NBA, EuroLeague' : sport.name === 'Tennis' ? 'ATP, WTA' : 'Slots, Live, Table'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-slate-800">{sport.bets}</div>
                      <div className="text-xs text-slate-500">{sport.percentage} of total</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-slate-800">{sport.volume}</div>
                      <div className={`text-xs ${sport.volumeChange.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{sport.volumeChange}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-slate-800">{sport.revenue}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-emerald-600">{sport.profit}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-slate-800">{sport.margin}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold ${
                        sport.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {sport.trend === 'up' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                          )}
                        </svg>
                        {sport.trendValue}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Insights & Scheduled Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <div className="insight-card rounded-2xl p-6 shadow-sm bg-gradient-to-br from-slate-50 to-slate-100 border-l-4 border-indigo-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-bold text-slate-800">AI Insights</h4>
          </div>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="flex items-start gap-3">
                  <span className={`w-8 h-8 ${getIconColor(insight.color)} rounded-full flex items-center justify-center text-lg flex-shrink-0`}>
                    {insight.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800 mb-1">{insight.title}</p>
                    <p className="text-xs text-slate-500">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800">Scheduled Reports</h4>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">+ New</button>
          </div>
          <div className="space-y-3">
            {scheduledReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${getIconColor(report.icon)} rounded-lg flex items-center justify-center`}>
                    {report.icon === 'emerald' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    ) : report.icon === 'blue' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800 text-sm">{report.title}</div>
                    <div className="text-xs text-slate-500">{report.schedule}</div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Active</span>
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

export default Reports;
