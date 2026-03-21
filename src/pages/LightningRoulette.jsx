import { useState, useEffect, useCallback } from 'react';

function LightningRoulette({ onBack }) {
  // Game State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [balance, setBalance] = useState(25000);
  const [selectedChip, setSelectedChip] = useState(100);
  const [currentBets, setCurrentBets] = useState({});
  const [gameState, setGameState] = useState('betting'); // betting, spinning, settling
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [spinHistory, setSpinHistory] = useState([]);
  const [sessionProfit, setSessionProfit] = useState(0);
  const [spinsPlayed, setSpinsPlayed] = useState(0);
  const [lastBets, setLastBets] = useState({});
  const [lightningNumbers, setLightningNumbers] = useState([]);
  const [winningNumber, setWinningNumber] = useState(null);
  const [winData, setWinData] = useState(null);
  const [showWinDisplay, setShowWinDisplay] = useState(false);

  // Roulette Configuration
  const numbers = [
    { num: 0, color: 'green' },
    { num: 1, color: 'red' }, { num: 2, color: 'black' }, { num: 3, color: 'red' },
    { num: 4, color: 'black' }, { num: 5, color: 'red' }, { num: 6, color: 'black' },
    { num: 7, color: 'red' }, { num: 8, color: 'black' }, { num: 9, color: 'red' },
    { num: 10, color: 'black' }, { num: 11, color: 'black' }, { num: 12, color: 'red' },
    { num: 13, color: 'black' }, { num: 14, color: 'red' }, { num: 15, color: 'black' },
    { num: 16, color: 'red' }, { num: 17, color: 'black' }, { num: 18, color: 'red' },
    { num: 19, color: 'red' }, { num: 20, color: 'black' }, { num: 21, color: 'red' },
    { num: 22, color: 'black' }, { num: 23, color: 'red' }, { num: 24, color: 'black' },
    { num: 25, color: 'red' }, { num: 26, color: 'black' }, { num: 27, color: 'red' },
    { num: 28, color: 'black' }, { num: 29, color: 'black' }, { num: 30, color: 'red' },
    { num: 31, color: 'black' }, { num: 32, color: 'red' }, { num: 33, color: 'black' },
    { num: 34, color: 'red' }, { num: 35, color: 'black' }, { num: 36, color: 'red' }
  ];

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Timer Management
  useEffect(() => {
    if (gameState !== 'betting') return;

    const timerInterval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          startSpin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameState]);

  // Initialize Lightning Numbers
  const selectLightningNumbers = useCallback(() => {
    const newLightning = [];
    const count = Math.floor(Math.random() * 3) + 3; // 3-5 lightning numbers

    while (newLightning.length < count) {
      const num = Math.floor(Math.random() * 37);
      if (!newLightning.find(n => n.num === num)) {
        const multipliers = [50, 100, 150, 200, 250, 300, 400, 500];
        const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
        newLightning.push({ num, multiplier });
      }
    }

    setLightningNumbers(newLightning);
  }, []);

  // Initialize game
  useEffect(() => {
    selectLightningNumbers();
  }, [selectLightningNumbers]);

  // Chip Selection
  const selectChip = (amount) => {
    if (gameState !== 'betting') return;
    setSelectedChip(amount);
  };

  // Place Bet
  const placeBet = (betType) => {
    if (gameState !== 'betting') return;
    if (balance < selectedChip) {
      alert('Insufficient balance!');
      return;
    }

    setCurrentBets((prev) => {
      const newBets = { ...prev };
      if (!newBets[betType]) newBets[betType] = 0;
      newBets[betType] += selectedChip;
      return newBets;
    });

    setBalance((prev) => prev - selectedChip);
  };

  // Clear Bets
  const clearBets = () => {
    if (gameState !== 'betting') return;

    const total = Object.values(currentBets).reduce((a, b) => a + b, 0);
    setBalance((prev) => prev + total);
    setCurrentBets({});
  };

  // Repeat Bet
  const repeatBet = () => {
    if (gameState !== 'betting' || Object.keys(lastBets).length === 0) return;

    clearBets();
    Object.entries(lastBets).forEach(([type, amount]) => {
      const betCount = Math.floor(amount / selectedChip);
      for (let i = 0; i < betCount; i++) {
        if (balance >= selectedChip) {
          placeBet(type);
        }
      }
    });
  };

  // Start Spin
  const startSpin = () => {
    setGameState('spinning');
    setLastBets({ ...currentBets });

    setTimeout(() => {
      const winNum = Math.floor(Math.random() * 37);
      const lightningHit = lightningNumbers.find(ln => ln.num === winNum);
      settleRound(winNum, lightningHit);
    }, 3000);
  };

  // Settle Round
  const settleRound = (winNum, lightning) => {
    setGameState('settling');
    setWinningNumber(winNum);
    setSpinsPlayed((prev) => prev + 1);

    const numData = numbers.find(n => n.num === winNum);
    let winAmount = 0;

    // Calculate wins
    Object.entries(currentBets).forEach(([bet, amount]) => {
      const won = checkWin(bet, winNum);
      if (won) {
        if (lightning && bet === winNum.toString()) {
          winAmount += amount * lightning.multiplier;
        } else {
          winAmount += amount * getPayout(bet);
        }
      }
    });

    // Update balance and stats
    setBalance((prev) => prev + winAmount);
    setSessionProfit((prev) => prev + winAmount - Object.values(currentBets).reduce((a, b) => a + b, 0));

    // Add to history
    setSpinHistory((prev) => [{ num: winNum, color: numData.color, lightning }, ...prev.slice(0, 9)]);

    // Show win display
    setWinData({
      number: winNum,
      color: numData.color,
      lightning,
      amount: winAmount
    });
    setShowWinDisplay(true);

    // Reset for next round
    setTimeout(() => {
      setCurrentBets({});
      setWinningNumber(null);
      setWinData(null);
      setShowWinDisplay(false);
      selectLightningNumbers();
      setGameState('betting');
      setTimeRemaining(20);
    }, 6000);
  };

  // Check Win
  const checkWin = (bet, winningNum) => {
    const num = parseInt(bet);
    if (!isNaN(num)) return num === winningNum;

    const numData = numbers.find(n => n.num === winningNum);

    switch (bet) {
      case 'red': return numData.color === 'red';
      case 'black': return numData.color === 'black';
      case 'even': return winningNum !== 0 && winningNum % 2 === 0;
      case 'odd': return winningNum % 2 === 1;
      case '1-18': return winningNum >= 1 && winningNum <= 18;
      case '19-36': return winningNum >= 19 && winningNum <= 36;
      case '1st12': return winningNum >= 1 && winningNum <= 12;
      case '2nd12': return winningNum >= 13 && winningNum <= 24;
      case '3rd12': return winningNum >= 25 && winningNum <= 36;
      case '2to1-1': return winningNum % 3 === 0 && winningNum !== 0;
      case '2to1-2': return winningNum % 3 === 2;
      case '2to1-3': return winningNum % 3 === 1;
      default: return false;
    }
  };

  // Get Payout
  const getPayout = (bet) => {
    if (!isNaN(parseInt(bet))) return 35; // Straight up
    if (bet.includes('2to1')) return 2;
    if (bet.includes('12')) return 2;
    return 1; // Even money
  };

  // Get number color class
  const getNumberColor = (num) => {
    const numData = numbers.find(n => n.num === num);
    if (!numData) return 'bg-emerald-500';
    return numData.color === 'red' ? 'bg-red-600' : 'bg-slate-900';
  };

  // Get chip color
  const getChipColor = (amount) => {
    if (amount >= 500) return 'bg-purple-600';
    if (amount >= 100) return 'bg-slate-700';
    if (amount >= 25) return 'bg-emerald-500';
    if (amount >= 5) return 'bg-blue-500';
    return 'bg-red-500';
  };

  // Format money
  const formatMoney = (amount) => {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Get total bet
  const getTotalBet = () => {
    return Object.values(currentBets).reduce((a, b) => a + b, 0);
  };

  // Generate number grid
  const generateGrid = () => {
    const grid = [];
    const rowOrder = [
      [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
      [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
      [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
    ];

    rowOrder.forEach((row, rowIndex) => {
      row.forEach((num) => {
        grid.push({ num, row: rowIndex });
      });
    });

    return grid;
  };

  const totalBet = getTotalBet();
  const timerPercentage = (timeRemaining / 20) * 100;

  return (
    <div className="h-screen overflow-hidden bg-slate-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20 shadow-lg flex-shrink-0">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">P</div>
              <div>
                <h1 className="font-bold text-xl tracking-tight text-slate-800">ProBet</h1>
                <p className="text-xs text-slate-500 font-medium">Casino</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            <button
              onClick={onBack}
              className="w-full sidebar-item flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Casino
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden bg-slate-50">
          {/* Header */}
          <header className="glass-panel border-b border-slate-200 px-8 py-4 z-10 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Lightning Roulette</h2>
                    <p className="text-sm text-slate-500">Table 1 • Min: $1 • Max: $1,000 • Multipliers: 50x-500x</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 bg-amber-500 rounded-full live-indicator"></span>
                  LIVE
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

                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Balance</span>
                  <span className="font-bold text-slate-800">{formatMoney(balance)}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Game Area */}
          <div className="h-[calc(100vh-80px)] p-6">
            <div className="h-full rounded-3xl relative overflow-hidden flex flex-col shadow-2xl border-4 border-slate-800/20"
              style={{
                backgroundColor: '#1a472a',
                backgroundImage: 'radial-gradient(ellipse at center, #1a472a 0%, #0f2918 100%)',
              }}
            >
              {/* Stats Overlay */}
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10 text-white z-20">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-6">
                    <span className="text-white/60">Session P/L</span>
                    <span className={`font-bold ${sessionProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {sessionProfit >= 0 ? '+' : ''}{formatMoney(sessionProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-white/60">Spins Played</span>
                    <span className="font-bold">{spinsPlayed}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-white/60">Last Win</span>
                    <span className="font-bold text-amber-400">
                      {winData?.lightning ? `${winData.lightning.multiplier}x` : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Results */}
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10 text-white z-20">
                <div className="flex gap-2">
                  {spinHistory.slice(0, 10).map((result, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        result.color === 'red' ? 'bg-red-600 border-red-400 text-white' :
                        result.color === 'black' ? 'bg-slate-900 border-slate-600 text-white' :
                        'bg-emerald-500 border-emerald-300 text-white'
                      } ${index === 0 ? 'scale-125' : ''}`}
                    >
                      {result.num}
                    </div>
                  ))}
                </div>
              </div>

              {/* Timer Bar */}
              <div className="w-full bg-black/30 h-2 relative z-10">
                <div
                  className={`h-full transition-all duration-1000 ${
                    timeRemaining <= 5 ? 'bg-gradient-to-r from-red-500 via-orange-500 to-red-500' :
                    'bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500'
                  }`}
                  style={{ width: `${timerPercentage}%` }}
                />
              </div>
              <div className="bg-black/40 text-center py-2 border-b border-white/10 z-10">
                <span className={`text-white font-bold text-lg ${timeRemaining <= 5 ? 'text-rose-400' : ''}`}>
                  {gameState === 'betting' ? `Place your bets - ${timeRemaining}s` :
                   gameState === 'spinning' ? 'No more bets! Spinning...' :
                   'Settling...'}
                </span>
              </div>

              {/* Lightning Multipliers Display */}
              <div className="flex gap-4 justify-center my-6 z-10">
                {lightningNumbers.map((ln, index) => (
                  <div
                    key={index}
                    className="bg-amber-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg border-2 border-amber-300 animate-pulse"
                  >
                    {ln.num}: {ln.multiplier}x ⚡
                  </div>
                ))}
              </div>

              {/* Main Betting Area */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 overflow-auto">
                <div className="grid grid-cols-14 gap-1 bg-slate-900/30 p-4 rounded-xl border border-white/10 max-w-4xl w-full">
                  {/* Zero */}
                  <div className="col-span-1 row-span-3 flex items-center justify-center">
                    <button
                      onClick={() => placeBet('0')}
                      className={`w-full h-full bg-emerald-500 rounded-lg text-white font-bold text-xl border-2 border-white/20 betting-spot transition-all hover:scale-105 ${
                        currentBets['0'] ? 'ring-4 ring-amber-400' : ''
                      }`}
                    >
                      0
                      {currentBets['0'] && (
                        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ${getChipColor(currentBets['0'])}`}>
                          {currentBets['0'] >= 1000 ? `${(currentBets['0']/1000).toFixed(1)}k` : currentBets['0']}
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Numbers 1-36 */}
                  <div className="col-span-12 grid grid-cols-12 gap-1">
                    {generateGrid().map(({ num, row }) => (
                      <button
                        key={num}
                        onClick={() => placeBet(num.toString())}
                        className={`aspect-square rounded text-white font-bold text-sm border border-white/20 betting-spot transition-all hover:scale-105 ${getNumberColor(num)} ${
                          currentBets[num.toString()] ? 'ring-4 ring-amber-400' : ''
                        } ${lightningNumbers.find(ln => ln.num === num) ? 'ring-2 ring-yellow-400 animate-pulse' : ''}`}
                      >
                        {num}
                        {currentBets[num.toString()] && (
                          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ${getChipColor(currentBets[num.toString()])}`}>
                            {currentBets[num.toString()] >= 1000 ? `${(currentBets[num.toString()]/1000).toFixed(1)}k` : currentBets[num.toString()]}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* 2to1 Column */}
                  <div className="col-span-1 flex flex-col gap-1">
                    {['2to1-1', '2to1-2', '2to1-3'].map((bet, index) => (
                      <button
                        key={bet}
                        onClick={() => placeBet(bet)}
                        className={`flex-1 bg-slate-700 rounded text-white text-xs font-bold border border-white/20 betting-spot transition-all hover:scale-105 ${
                          currentBets[bet] ? 'ring-4 ring-amber-400' : ''
                        }`}
                      >
                        2to1
                        {currentBets[bet] && (
                          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ${getChipColor(currentBets[bet])}`}>
                            {currentBets[bet] >= 1000 ? `${(currentBets[bet]/1000).toFixed(1)}k` : currentBets[bet]}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Outside Bets Row */}
                  <div className="col-span-14 grid grid-cols-9 gap-1 mt-1">
                    <button onClick={() => placeBet('1st12')} className="py-3 bg-slate-700 rounded text-white text-sm font-bold border border-white/20 betting-spot hover:scale-105 transition-all">1st 12</button>
                    <button onClick={() => placeBet('2nd12')} className="py-3 bg-slate-700 rounded text-white text-sm font-bold border border-white/20 betting-spot hover:scale-105 transition-all">2nd 12</button>
                    <button onClick={() => placeBet('3rd12')} className="py-3 bg-slate-700 rounded text-white text-sm font-bold border border-white/20 betting-spot hover:scale-105 transition-all">3rd 12</button>
                    <button onClick={() => placeBet('1-18')} className="py-3 bg-slate-700 rounded text-white text-sm font-bold border border-white/20 betting-spot hover:scale-105 transition-all">1-18</button>
                    <button onClick={() => placeBet('even')} className="py-3 bg-slate-700 rounded text-white text-sm font-bold border border-white/20 betting-spot hover:scale-105 transition-all">Even</button>
                    <button onClick={() => placeBet('red')} className="py-3 bg-red-600 rounded text-white text-sm font-bold border border-white/20 betting-spot hover:scale-105 transition-all">Red</button>
                    <button onClick={() => placeBet('black')} className="py-3 bg-slate-900 rounded text-white text-sm font-bold border border-white/20 betting-spot hover:scale-105 transition-all">Black</button>
                    <button onClick={() => placeBet('odd')} className="py-3 bg-slate-700 rounded text-white text-sm font-bold border border-white/20 betting-spot hover:scale-105 transition-all">Odd</button>
                    <button onClick={() => placeBet('19-36')} className="py-3 bg-slate-700 rounded text-white text-sm font-bold border border-white/20 betting-spot hover:scale-105 transition-all">19-36</button>
                  </div>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="bg-black/40 backdrop-blur-md p-4 border-t border-white/10 z-20">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                  {/* Bet Info */}
                  <div className="text-white">
                    <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Total Bet</div>
                    <div className="text-2xl font-bold text-amber-400">{formatMoney(totalBet)}</div>
                  </div>

                  {/* Chip Selection */}
                  <div className="flex gap-3 items-center">
                    <span className="text-white/60 text-xs uppercase tracking-wider font-medium">Select Chip:</span>
                    {[
                      { value: 1, color: 'chip-red' },
                      { value: 5, color: 'chip-blue' },
                      { value: 25, color: 'chip-green' },
                      { value: 100, color: 'chip-black' },
                      { value: 500, color: 'chip-purple' }
                    ].map((chip) => (
                      <div
                        key={chip.value}
                        onClick={() => selectChip(chip.value)}
                        className={`w-11 h-11 rounded-full border-4 border-dashed border-white/80 shadow-lg flex items-center justify-center font-bold text-xs text-white cursor-pointer transition-all hover:scale-115 bg-gradient-to-br ${
                          chip.value === 1 ? 'from-red-500 to-red-700' :
                          chip.value === 5 ? 'from-blue-500 to-blue-700' :
                          chip.value === 25 ? 'from-emerald-500 to-emerald-700' :
                          chip.value === 100 ? 'from-slate-600 to-slate-800' :
                          'from-purple-500 to-purple-700'
                        } ${selectedChip === chip.value ? 'scale-125 ring-4 ring-white/60' : ''}`}
                      >
                        ${chip.value}
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={clearBets}
                      disabled={gameState !== 'betting' || totalBet === 0}
                      className="px-6 py-3 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-600/50 text-white rounded-xl font-bold transition-all border-b-4 border-rose-800 active:border-b-0 active:translate-y-1 disabled:cursor-not-allowed"
                    >
                      Clear
                    </button>
                    <button
                      onClick={repeatBet}
                      disabled={gameState !== 'betting' || Object.keys(lastBets).length === 0}
                      className="px-6 py-3 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-600/50 text-white rounded-xl font-bold transition-all border-b-4 border-slate-800 active:border-b-0 active:translate-y-1 disabled:cursor-not-allowed"
                    >
                      Repeat
                    </button>
                  </div>
                </div>
              </div>

              {/* Win Display Modal */}
              {showWinDisplay && winData && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center">
                  <div className="text-center transform transition-transform duration-500 scale-100">
                    <div className={`text-8xl font-bold mb-4 ${
                      winData.color === 'red' ? 'text-red-500' :
                      winData.color === 'black' ? 'text-slate-800' :
                      'text-emerald-500'
                    } animate-bounce`}>
                      {winData.number}
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{winData.color.toUpperCase()}</div>
                    {winData.lightning && (
                      <div className="text-3xl font-bold text-amber-400 mt-2">
                        ⚡ {winData.lightning.multiplier}x Multiplier!
                      </div>
                    )}
                    <div className={`mt-6 text-4xl font-bold ${winData.amount > 0 ? 'text-emerald-400' : 'text-white/60'}`}>
                      {winData.amount > 0 ? `+${formatMoney(winData.amount)}` : 'Better luck next time!'}
                    </div>
                    <button
                      onClick={() => setShowWinDisplay(false)}
                      className="mt-6 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold transition-all"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LightningRoulette;
