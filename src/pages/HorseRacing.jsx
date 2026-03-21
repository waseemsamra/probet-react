import { useState, useEffect } from 'react';

function HorseRacing() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState(154);
  const [selectedBet, setSelectedBet] = useState({ horse: 'Stradivarius', odds: 2.75, stake: 50 });
  const [slipCount, setSlipCount] = useState(1);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Race countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live odds fluctuation
  const [odds, setOdds] = useState({
    stradivarius: 2.75,
    kyprios: 3.50,
    tasso: 8.00,
    coltrane: 12.00,
    princessZoe: 15.00,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setOdds((prev) => {
        const newOdds = { ...prev };
        Object.keys(newOdds).forEach((key) => {
          if (Math.random() > 0.7) {
            const change = (Math.random() - 0.5) * 0.2;
            newOdds[key] = Math.max(1.01, prev[key] + change);
          }
        });
        return newOdds;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateReturn = (stake, odd) => (stake * odd).toFixed(2);

  const runners = [
    {
      id: 1,
      number: 1,
      name: 'Stradivarius',
      country: '',
      age: 8,
      weight: '9-9',
      jockey: 'Frankie Dettori',
      trainer: 'John Gosden',
      form: ['1', '1', '1', '2', '1', '1'],
      odds: odds.stradivarius,
      isNap: true,
      isFav: true,
      color: 'from-red-600 to-red-800',
    },
    {
      id: 2,
      number: 2,
      name: 'Kyprios',
      country: '(IRE)',
      age: 5,
      weight: '9-7',
      jockey: 'Ryan Moore',
      trainer: 'Aidan O\'Brien',
      form: ['1', '1', '2', '1', '0', '1'],
      odds: odds.kyprios,
      isNap: false,
      isFav: false,
      color: 'from-blue-500 to-blue-700',
    },
    {
      id: 3,
      number: 3,
      name: 'Torquator Tasso',
      country: '(GER)',
      age: 6,
      weight: '9-6',
      jockey: 'Rene Piechulek',
      trainer: 'Marcel Weiss',
      form: ['2', '1', '0', '2', '1', '2'],
      odds: odds.tasso,
      isNap: false,
      isFav: false,
      color: 'from-purple-500 to-purple-700',
    },
    {
      id: 4,
      number: 4,
      name: 'Coltrane',
      country: '(IRE)',
      age: 6,
      weight: '9-4',
      jockey: 'Oisin Murphy',
      trainer: 'Andrew Balding',
      form: ['1', '2', '2', '1', '2', '0'],
      odds: odds.coltrane,
      isNap: false,
      isFav: false,
      color: 'from-amber-500 to-amber-700',
    },
    {
      id: 5,
      number: 5,
      name: 'Princess Zoe',
      country: '(IRE)',
      age: 7,
      weight: '9-2',
      jockey: 'Joey Sheridan',
      trainer: 'Tony Mullins',
      form: ['1', '1', '2', '1', '1', '2'],
      odds: odds.princessZoe,
      isNap: false,
      isFav: false,
      isFilly: true,
      color: 'from-rose-500 to-rose-700',
    },
  ];

  const upcomingRaces = [
    { time: '14:50', track: 'Cheltenham', name: 'Novices\' Hurdle', distance: '2m ½f', runners: 8, sp: '3/1', countdown: '18m' },
    { time: '15:05', track: 'Newmarket', name: 'Guineas Trial', distance: '1m • Group 3', runners: 12, sp: '5/2', countdown: '33m' },
    { time: '15:30', track: 'Kentucky', name: 'Kentucky Derby', distance: '1m ¼f • Grade 1', runners: 20, sp: 'Fav', countdown: '58m', major: true },
    { time: '15:45', track: 'Curragh', name: 'Irish 2000 Guineas', distance: '1m • Group 1', runners: 10, sp: '7/4', countdown: '73m' },
    { time: '16:00', track: 'Sha Tin', name: 'Champions Mile', distance: '1m • Group 1', runners: 14, sp: 'HK$18M', countdown: '88m' },
  ];

  const getFormColor = (form) => {
    if (form === '1') return 'bg-emerald-500 text-white';
    if (form === '2') return 'bg-blue-500 text-white';
    if (form === '3') return 'bg-amber-500 text-white';
    return 'bg-slate-200 text-slate-400';
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-emerald-100 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Horse Racing</h2>
                <p className="text-sm text-slate-500">Flat & Jumps • UK, IRE, International</p>
              </div>
            </div>

            <div className="h-8 w-px bg-emerald-200"></div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="font-medium text-emerald-700">12 Races Live</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-amber-700 font-mono">
                  {currentTime.toTimeString().split(' ')[0]}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search races, horses, jockeys..."
                className="w-64 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Track Filter Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm shadow-md">All Tracks</button>
          <button className="px-4 py-2 bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Ascot
            <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">LIVE</span>
          </button>
          <button className="px-4 py-2 bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200 rounded-lg font-medium text-sm transition-colors">Cheltenham</button>
          <button className="px-4 py-2 bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200 rounded-lg font-medium text-sm transition-colors">Newmarket</button>
          <button className="px-4 py-2 bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200 rounded-lg font-medium text-sm transition-colors">Curragh</button>
          <button className="px-4 py-2 bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200 rounded-lg font-medium text-sm transition-colors">Kentucky Downs</button>
          <button className="px-4 py-2 bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200 rounded-lg font-medium text-sm transition-colors">Sha Tin</button>
        </div>
      </header>

      {/* Main Racing Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Race List */}
        <div className="w-80 bg-white border-r border-emerald-100 overflow-y-auto">
          <div className="p-4 border-b border-emerald-100 bg-emerald-50/50">
            <h3 className="font-bold text-slate-800 mb-1">Today's Cards</h3>
            <p className="text-xs text-slate-500">47 races across 8 tracks</p>
          </div>

          {/* Featured Race */}
          <div className="p-4 border-b-2 border-emerald-500 bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Live Now
              </span>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">Racing</span>
            </div>
            <h4 className="font-bold text-slate-800 mb-1">Ascot Gold Cup</h4>
            <p className="text-xs text-slate-500 mb-3">Group 1 • 2m 4f • 4yo+ • Good</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Going:</span>
              <span className="font-medium text-emerald-700">Good to Firm</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            </div>
          </div>

          {/* Upcoming Races */}
          <div className="divide-y divide-slate-100">
            {upcomingRaces.map((race, index) => (
              <div key={index} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                    {race.time} {race.track}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{race.countdown}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{race.name} • {race.distance}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{race.runners} Runners</span>
                  {race.major ? (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold">MAJOR</span>
                  ) : (
                    <span className="text-xs text-amber-600 font-medium">{race.sp}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Ante-Post Section */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <h4 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ante-Post
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Grand National</span>
                <span className="font-bold text-emerald-600">10/1</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Cheltenham Gold Cup</span>
                <span className="font-bold text-emerald-600">5/2</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Royal Ascot (Any Race)</span>
                <span className="font-bold text-emerald-600">8/1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Race Detail View */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Race Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold">GROUP 1</span>
                  <span className="px-3 py-1 bg-red-500/80 backdrop-blur rounded-full text-xs font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    LIVE
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-2">Ascot Gold Cup</h1>
                <p className="text-emerald-100 text-sm">British Champions Series • 2 miles 4 furlongs • 4yo+ • Good to Firm</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold font-mono mb-1">{formatCountdown(countdown)}</div>
                <p className="text-emerald-200 text-sm">to finish</p>
              </div>
            </div>

            {/* Race Info Bar */}
            <div className="flex items-center gap-8 mt-6 pt-6 border-t border-white/20 text-sm">
              <div>
                <p className="text-emerald-200 text-xs mb-1">Prize Pool</p>
                <p className="font-bold text-lg">£500,000</p>
              </div>
              <div>
                <p className="text-emerald-200 text-xs mb-1">Runners</p>
                <p className="font-bold text-lg">14</p>
              </div>
              <div>
                <p className="text-emerald-200 text-xs mb-1">Going</p>
                <p className="font-bold text-lg flex items-center gap-2">
                  Good to Firm
                  <span className="w-3 h-3 bg-emerald-400 rounded-full"></span>
                </p>
              </div>
              <div>
                <p className="text-emerald-200 text-xs mb-1">Weather</p>
                <p className="font-bold text-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  18°C Sunny
                </p>
              </div>
              <div>
                <p className="text-emerald-200 text-xs mb-1">Stalls</p>
                <p className="font-bold text-lg">Centre</p>
              </div>
            </div>
          </div>

          {/* Runners & Betting */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* NAP Selection */}
            <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-xl p-4 mb-6 flex items-center justify-between border-l-4 border-red-600">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold text-lg shadow-md">1</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-lg">Stradivarius</span>
                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded font-bold">NAP</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-bold">FAV</span>
                  </div>
                  <p className="text-sm text-slate-600">Age: 8 • Weight: 9-9 • Jockey: Frankie Dettori • Trainer: John Gosden</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-1">Form</p>
                  <div className="flex">
                    {runners[0].form.map((f, i) => (
                      <span key={i} className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold mr-1 ${getFormColor(f)}`}>{f}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-amber-100 to-amber-200 px-4 py-2 rounded-lg text-center border-2 border-amber-500">
                  <p className="text-2xl font-bold text-amber-800 font-mono">{odds.stradivarius.toFixed(2)}</p>
                  <p className="text-xs text-amber-700 font-medium">1/4 1-2-3</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedBet({ horse: 'Stradivarius', odds: odds.stradivarius, stake: 50 });
                    setSlipCount(1);
                  }}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  Add to Bet
                </button>
              </div>
            </div>

            {/* Runners Grid */}
            <div className="space-y-3">
              {runners.slice(1).map((runner) => (
                <div
                  key={runner.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${runner.color} flex items-center justify-center text-white font-bold shadow-md`}>
                      {runner.number}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{runner.name}</span>
                        {runner.country && <span className="text-xs text-slate-500">{runner.country}</span>}
                        {runner.isFilly && (
                          <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded font-bold">F</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">
                        Age: {runner.age} • Weight: {runner.weight} • Jockey: {runner.jockey} • Trainer: {runner.trainer}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-1">Form</p>
                      <div className="flex">
                        {runner.form.map((f, i) => (
                          <span key={i} className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold mr-1 ${getFormColor(f)}`}>{f}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-lg text-center border border-slate-200">
                      <p className="text-2xl font-bold text-slate-800 font-mono">{runner.odds.toFixed(2)}</p>
                      <p className="text-xs text-slate-500">SP</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedBet({ horse: runner.name, odds: runner.odds, stake: 50 });
                        setSlipCount(1);
                      }}
                      className="px-4 py-2 bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold rounded-lg transition-all"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}

              {/* More Runners Toggle */}
              <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                Show 9 More Runners
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Race Analysis */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {/* Speed Map */}
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Speed Map
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-16 text-slate-500">Early</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ width: '30%' }}>Stradivarius</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-16 text-slate-500">Mid</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ width: '25%', left: '35%' }}>Kyprios</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-16 text-slate-500">Late</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ width: '20%', left: '60%' }}>Tasso</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Movers */}
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Market Movers
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Stradivarius</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 line-through">3.00</span>
                      <span className="text-sm font-bold text-emerald-600">2.75 ▼</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Kyprios</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 line-through">3.25</span>
                      <span className="text-sm font-bold text-rose-600">3.50 ▲</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Coltrane</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 line-through">10.00</span>
                      <span className="text-sm font-bold text-rose-600">12.00 ▲</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Betting Summary */}
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Betting Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total Matched</span>
                    <span className="font-bold text-slate-800 font-mono">£2.4M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Fav % Money</span>
                    <span className="font-bold text-emerald-600">42%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Drifters</span>
                    <span className="font-bold text-rose-600">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Steamers</span>
                    <span className="font-bold text-emerald-600">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Betting Slip */}
        <div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-xl">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800">Betting Slip</h3>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">{slipCount}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg">Singles</button>
              <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50">Multiples</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Bet */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 relative group">
              <button className="absolute top-2 right-2 text-slate-400 hover:text-rose-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-600">WIN</span>
                <span className="text-xs text-slate-500">Ascot 14:30</span>
              </div>
              <p className="font-bold text-slate-800 mb-1">{selectedBet.horse}</p>
              <p className="text-xs text-slate-500 mb-3">Ascot Gold Cup</p>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">Stake</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500">£</span>
                    <input
                      type="number"
                      value={selectedBet.stake}
                      onChange={(e) => setSelectedBet({ ...selectedBet, stake: parseInt(e.target.value) || 0 })}
                      className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <label className="text-xs text-slate-500 mb-1 block">Odds</label>
                  <p className="text-lg font-bold text-emerald-600 font-mono">{selectedBet.odds.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <span className="text-sm text-slate-600">Potential Return</span>
                <span className="text-lg font-bold text-slate-800 font-mono">£{calculateReturn(selectedBet.stake, selectedBet.odds)}</span>
              </div>
            </div>

            {/* Quick Stakes */}
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 25, 50].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedBet({ ...selectedBet, stake: amount })}
                  className="py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                >
                  £{amount}
                </button>
              ))}
            </div>

            {/* Each Way Toggle */}
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="eachWay" className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                <label htmlFor="eachWay" className="text-sm font-medium text-amber-800">Each Way</label>
              </div>
              <span className="text-xs text-amber-600">1/4 odds 1-2-3</span>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-600">Total Stake</span>
              <span className="text-xl font-bold text-slate-800 font-mono">£{selectedBet.stake.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-600">Total Potential Return</span>
              <span className="text-xl font-bold text-emerald-600 font-mono">£{calculateReturn(selectedBet.stake, selectedBet.odds)}</span>
            </div>
            <button className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Place Bet
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">
              18+ • Please gamble responsibly • GambleAware
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HorseRacing;
