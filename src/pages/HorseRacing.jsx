import { useState, useEffect } from 'react';
import { getNextToGo } from '../lib/puntersEdge';

function HorseRacing() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState(154);
  const [selectedBet, setSelectedBet] = useState({ horse: 'Stradivarius', odds: 2.75, stake: 50 });
  const [slipCount, setSlipCount] = useState(1);
  const [races, setRaces] = useState([])
  const [selectedRaceId, setSelectedRaceId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState('GB')

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

  // Fetch live races
  useEffect(() => {
    let mounted = true
    async function loadRaces() {
      try {
        setLoading(true)
        const data = await getNextToGo({ numRaces: 20, country: selectedCountry, category: 'horse' })
        if (mounted) {
          setRaces(data)
          if (data.length > 0 && !selectedRaceId) {
            setSelectedRaceId(data[0].race_id)
          }
        }
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadRaces()
    const interval = setInterval(loadRaces, 60000)
    return () => { mounted = false; clearInterval(interval) }
  }, [selectedCountry])

  const selectedRace = races.find(r => r.race_id === selectedRaceId)

  // Live odds fluctuation for selected race
  const [liveOdds, setLiveOdds] = useState({})
  useEffect(() => {
    if (!selectedRace) return
    // Initialize odds from API
    const initialOdds = {}
    selectedRace.runners?.forEach(runner => {
      const bestPrice = runner.bookmakers?.reduce((lowest, bm) => 
        (bm.win_price && (!lowest || bm.win_price < lowest)) ? bm.win_price : lowest, null)
      if (bestPrice) initialOdds[runner.name] = bestPrice
    })
    setLiveOdds(initialOdds)

    const interval = setInterval(() => {
      setLiveOdds((prev) => {
        const newOdds = { ...prev };
        Object.keys(newOdds).forEach((key) => {
          if (Math.random() > 0.7) {
            const change = (Math.random() - 0.5) * 0.2;
            newOdds[key] = Math.max(1.01, Math.round((prev[key] + change) * 10) / 10);
          }
        });
        return newOdds;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedRace])

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateReturn = (stake, odd) => (stake * odd).toFixed(2);

  const runners = selectedRace?.runners?.map(runner => {
    const bestPrice = runner.bookmakers?.reduce((lowest, bm) => 
      (bm.win_price && (!lowest || bm.win_price < lowest)) ? bm.win_price : lowest, null)
    return {
      id: runner.number,
      number: runner.number,
      name: runner.name,
      country: '',
      age: '',
      weight: '',
      jockey: runner.jockey || '',
      trainer: runner.trainer || '',
      form: runner.form || '',
      odds: liveOdds[runner.name] || bestPrice || 0,
      isNap: false,
      isFav: false,
      color: 'from-emerald-500 to-emerald-700',
    }
  }) || []

  const countries = [
    { code: 'GB', name: 'UK', flag: '🇬🇧' },
    { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'US', name: 'USA', flag: '🇺🇸' },
    { code: 'NZ', name: 'NZ', flag: '🇳🇿' },
    { code: 'ZA', name: 'SA', flag: '🇿🇦' },
  ]

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
          {/* Country Selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            {countries.map(c => (
              <button
                key={c.code}
                onClick={() => setSelectedCountry(c.code)}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  selectedCountry === c.code
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-emerald-50'
                }`}
              >
                {c.flag} {c.name}
              </button>
            ))}
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm shadow-md">All Tracks</button>
          {races.slice(0, 6).map(race => (
            <button
              key={race.race_id}
              onClick={() => setSelectedRaceId(race.race_id)}
              className={`px-4 py-2 text-slate-600 hover:bg-emerald-50 border border-slate-200 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                selectedRaceId === race.race_id ? 'bg-emerald-50 border-emerald-300' : ''
              }`}
            >
              {race.venue} R{race.race_number}
            </button>
          ))}
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
            {loading ? (
              <div className="p-4 text-center text-slate-500">Loading races...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-600">Error: {error}</div>
            ) : (
              races.map((race, index) => {
                const isSelected = selectedRaceId === race.race_id
                const startTime = race.start_time ? new Date(race.start_time) : null
                const timeStr = startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'
                const countdownSecs = startTime ? Math.max(0, Math.floor((startTime - new Date()) / 1000)) : 0
                const countdownStr = countdownSecs > 0 
                  ? `${Math.floor(countdownSecs / 60)}m` 
                  : 'OFF'
                const isLive = countdownSecs <= 0 && countdownSecs > -3600 // started within last hour
                
                return (
                  <div
                    key={race.race_id}
                    onClick={() => setSelectedRaceId(race.race_id)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-50 border-l-4 border-emerald-500' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${isSelected ? 'text-emerald-600' : 'text-slate-800'} group-hover:text-emerald-600 transition-colors`}>
                        {timeStr} {race.venue}
                      </span>
                      <span className={`text-xs font-mono ${isLive ? 'text-red-600 animate-pulse' : 'text-slate-500'}`}>
                        {isLive ? 'LIVE' : countdownStr}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">Race {race.race_number} • {race.distance_m ? `${race.distance_m}m` : 'TBD'}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{race.runners?.length || 0} Runners</span>
                      {isLive ? (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold animate-pulse">LIVE</span>
                      ) : (
                        <span className="text-xs text-amber-600 font-medium">
                          Fav: {race.runners?.[0]?.name || '-'}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
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
          {/* Race Header - Live Data */}
          <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold">
                    {selectedRace?.race_class || 'RACE'}
                  </span>
                  {selectedRace && (selectedRace.inplay_at || selectedRace.market_state_source) && (
                    <span className="px-3 py-1 bg-red-500/80 backdrop-blur rounded-full text-xs font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                      LIVE
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  {selectedRace?.venue || 'Ascot'} - Race {selectedRace?.race_number || '1'}
                </h1>
                <p className="text-emerald-100 text-sm">
                  {selectedRace?.distance_m ? `${selectedRace.distance_m}m` : 'TBD'} • {selectedRace?.category || 'horse'} • {selectedRace?.track_condition || 'Good'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold font-mono mb-1">
                  {selectedRace ? (() => {
                    const startTime = new Date(selectedRace.start_time)
                    const diff = startTime - new Date()
                    if (diff > 0) {
                      const mins = Math.floor(diff / 60000)
                      const secs = Math.floor((diff % 60000) / 1000)
                      return `${mins}:${secs.toString().padStart(2, '0')}`
                    }
                    return 'LIVE'
                  })() : 'TBD'}
                </div>
                <p className="text-emerald-200 text-sm">
                  {selectedRace && new Date(selectedRace.start_time) < new Date() ? 'in progress' : 'to start'}
                </p>
              </div>
            </div>

            {/* Race Info Bar */}
            <div className="flex items-center gap-8 mt-6 pt-6 border-t border-white/20 text-sm">
              <div>
                <p className="text-emerald-200 text-xs mb-1">Prize Pool</p>
                <p className="font-bold text-lg">{selectedRace?.prize_total ? `£${selectedRace.prize_total.toLocaleString()}` : 'TBD'}</p>
              </div>
              <div>
                <p className="text-emerald-200 text-xs mb-1">Runners</p>
                <p className="font-bold text-lg">{selectedRace?.runners?.length || 0}</p>
              </div>
              <div>
                <p className="text-emerald-200 text-xs mb-1">Going</p>
                <p className="font-bold text-lg flex items-center gap-2">
                  {selectedRace?.track_condition || 'Good to Firm'}
                  <span className="w-3 h-3 bg-emerald-400 rounded-full"></span>
                </p>
              </div>
              <div>
                <p className="text-emerald-200 text-xs mb-1">Weather</p>
                <p className="font-bold text-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {selectedRace?.weather || '18°C Sunny'}
                </p>
              </div>
              <div>
                <p className="text-emerald-200 text-xs mb-1">Stalls</p>
                <p className="font-bold text-lg">{selectedRace?.rail || 'Centre'}</p>
              </div>
            </div>
          </div>

          {/* Runners & Betting */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* NAP Selection - Favorite Runner */}
            {runners.length > 0 && (
              <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-xl p-4 mb-6 flex items-center justify-between border-l-4 border-red-600">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold text-lg shadow-md">{runners[0].number}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-lg">{runners[0].name}</span>
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded font-bold">NAP</span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-bold">FAV</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Jockey: {runners[0].jockey || '-'} • Trainer: {runners[0].trainer || '-'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Form</p>
                    <div className="flex">
                      {(runners[0]?.form || '').split('').map((f, i) => (
                        <span key={i} className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold mr-1 ${getFormColor(f)}`}>{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-amber-100 to-amber-200 px-4 py-2 rounded-lg text-center border-2 border-amber-500">
                    <p className="text-2xl font-bold text-amber-800 font-mono">{runners[0]?.odds?.toFixed(2) || '-'}</p>
                    <p className="text-xs text-amber-700 font-medium">1/4 1-2-3</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBet({ horse: runners[0]?.name || '', odds: runners[0]?.odds || 0, stake: 50 });
                      setSlipCount(1);
                    }}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    Add to Bet
                  </button>
                </div>
              </div>
            )}

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
                        Age: {runner.age || '-'} • Weight: {runner.weight || '-'} • Jockey: {runner.jockey || '-'} • Trainer: {runner.trainer || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-1">Form</p>
                      <div className="flex">
                        {(runner.form || '').split('').map((f, i) => (
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
