import { useState, useEffect, useRef } from 'react';

function SpeedBaccarat({ onBack }) {
  // Game State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [balance, setBalance] = useState(50000);
  const [selectedChip, setSelectedChip] = useState(500);
  const [currentBets, setCurrentBets] = useState({});
  const [gameState, setGameState] = useState('betting');
  const [timeRemaining, setTimeRemaining] = useState(27);
  const [shoe, setShoe] = useState([]);
  const [history, setHistory] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [bankerCards, setBankerCards] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [bankerScore, setBankerScore] = useState(0);
  const [gameMessage, setGameMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [lastBets, setLastBets] = useState({});

  // Statistics
  const [sessionStats, setSessionStats] = useState({
    handsPlayed: 23,
    playerWins: 42,
    bankerWins: 48,
    tieWins: 10,
    profit: 1250,
    streak: 3,
    streakType: 'W',
  });

  const timerRef = useRef(null);

  // Card Setup
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const chipValues = [
    { value: 5, color: 'chip-red', label: '$5' },
    { value: 25, color: 'chip-blue', label: '$25' },
    { value: 100, color: 'chip-green', label: '$100' },
    { value: 500, color: 'chip-black', label: '$500' },
    { value: 1000, color: 'chip-purple', label: '$1k' },
    { value: 5000, color: 'chip-gold', label: '$5k' },
  ];

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get card value
  const getCardValue = (val) => {
    if (val === 'A') return 1;
    if (['J', 'Q', 'K', '10'].includes(val)) return 0;
    return parseInt(val);
  };

  // Create shoe
  const createShoe = () => {
    const newShoe = [];
    for (let d = 0; d < 8; d++) {
      for (let s of suits) {
        for (let v of values) {
          newShoe.push({ suit: s, value: v, num: getCardValue(v) });
        }
      }
    }
    return shuffle(newShoe);
  };

  // Shuffle
  const shuffle = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Initialize game
  useEffect(() => {
    const newShoe = createShoe();
    setShoe(newShoe);
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer
  const startTimer = () => {
    setTimeRemaining(27);
    setGameState('betting');
    setGameMessage('');
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          startDeal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Deal cards
  const startDeal = () => {
    setGameState('dealing');
    setLastBets({ ...currentBets });
    setPlayerCards([]);
    setBankerCards([]);
    setPlayerScore(0);
    setBankerScore(0);
    setCurrentBets({});

    // Deal sequence
    setTimeout(() => dealCard('player'), 500);
    setTimeout(() => dealCard('banker'), 800);
    setTimeout(() => dealCard('player'), 1100);
    setTimeout(() => dealCard('banker'), 1400);

    setTimeout(() => evaluateHands(), 2000);
  };

  // Deal a card
  const dealCard = (to) => {
    setShoe((prevShoe) => {
      const newShoe = [...prevShoe];
      const card = newShoe.pop();
      
      if (to === 'player') {
        setPlayerCards((prev) => [...prev, card]);
        updateScore('player', [...playerCards, card]);
      } else {
        setBankerCards((prev) => [...prev, card]);
        updateScore('banker', [...bankerCards, card]);
      }
      
      return newShoe;
    });
  };

  // Update score
  const updateScore = (who, hand) => {
    const score = hand.reduce((sum, c) => sum + c.num, 0) % 10;
    if (who === 'player') {
      setPlayerScore(score);
    } else {
      setBankerScore(score);
    }
    return score;
  };

  // Evaluate hands
  const evaluateHands = () => {
    let pScore = playerScore;
    let bScore = bankerScore;

    // Natural win check
    if (pScore >= 8 || bScore >= 8) {
      settleRound(pScore, bScore);
      return;
    }

    // Player third card
    if (pScore <= 5) {
      setTimeout(() => {
        setShoe((prevShoe) => {
          const newShoe = [...prevShoe];
          const card = newShoe.pop();
          setPlayerCards((prev) => [...prev, card]);
          pScore = updateScore('player', [...playerCards, card]);
          setPlayerScore(pScore);

          // Banker third card rules
          setTimeout(() => {
            const playerThird = card.num;
            if (shouldBankerDraw(bScore, playerThird)) {
              setShoe((prevShoe2) => {
                const newShoe2 = [...prevShoe2];
                const bankerCard = newShoe2.pop();
                setBankerCards((prev) => [...prev, bankerCard]);
                return newShoe2;
              });
            }
            setTimeout(() => {
              const finalBScore = bankerCards.length > 2 
                ? updateScore('banker', [...bankerCards]) 
                : bScore;
              settleRound(pScore, finalBScore);
            }, 500);
            return newShoe2;
          }, 600);
          return newShoe;
        });
      }, 600);
    } else if (bScore <= 5) {
      setTimeout(() => {
        setShoe((prevShoe) => {
          const newShoe = [...prevShoe];
          const card = newShoe.pop();
          setBankerCards((prev) => [...prev, card]);
          bScore = updateScore('banker', [...bankerCards, card]);
          setBankerScore(bScore);
          settleRound(pScore, bScore);
          return newShoe;
        });
      }, 600);
    } else {
      settleRound(pScore, bScore);
    }
  };

  // Should banker draw third card
  const shouldBankerDraw = (bankerScore, playerThird) => {
    if (bankerScore <= 2) return true;
    if (bankerScore === 3) return playerThird !== 8;
    if (bankerScore === 4) return [2, 3, 4, 5, 6, 7].includes(playerThird);
    if (bankerScore === 5) return [4, 5, 6, 7].includes(playerThird);
    if (bankerScore === 6) return [6, 7].includes(playerThird);
    return false;
  };

  // Settle round
  const settleRound = (pScore, bScore) => {
    setGameState('settling');
    setSessionStats((prev) => ({ ...prev, handsPlayed: prev.handsPlayed + 1 }));

    let winner;
    if (pScore > bScore) winner = 'player';
    else if (bScore > pScore) winner = 'banker';
    else winner = 'tie';

    // Update stats
    setSessionStats((prev) => ({
      ...prev,
      [winner + 'Wins']: prev[winner + 'Wins'] + 1,
    }));

    // Add to history
    setHistory((prev) => [{ winner, pScore, bScore }, ...prev].slice(0, 100));

    // Calculate winnings
    let winAmount = 0;
    const totalBets = Object.values(currentBets).reduce((a, b) => a + b, 0);

    if (currentBets[winner]) {
      const payout = winner === 'player' ? 2 : winner === 'banker' ? 1.95 : 9;
      winAmount += currentBets[winner] * payout;
    }
    if (winner === 'tie' && currentBets.player) winAmount += currentBets.player;
    if (winner === 'tie' && currentBets.banker) winAmount += currentBets.banker;

    // Side bets
    if (currentBets.playerPair && isPair(playerCards)) {
      winAmount += currentBets.playerPair * 12;
    }
    if (currentBets.bankerPair && isPair(bankerCards)) {
      winAmount += currentBets.bankerPair * 12;
    }
    if (currentBets.eitherPair && (isPair(playerCards) || isPair(bankerCards))) {
      winAmount += currentBets.eitherPair * 6;
    }

    setBalance((prev) => prev + winAmount);
    setSessionStats((prev) => ({
      ...prev,
      profit: prev.profit + winAmount - totalBets,
    }));

    // Update streak
    setSessionStats((prev) => {
      if (winAmount > 0) {
        return {
          ...prev,
          streak: prev.streakType === 'W' ? prev.streak + 1 : 1,
          streakType: 'W',
        };
      } else {
        return {
          ...prev,
          streak: prev.streakType === 'L' ? prev.streak + 1 : 1,
          streakType: 'L',
        };
      }
    });

    // Show message
    displayMessage(
      (winner === 'player' ? 'Player' : winner === 'banker' ? 'Banker' : 'Tie') + ' Wins!'
    );

    // Reset after delay
    setTimeout(() => {
      setPlayerCards([]);
      setBankerCards([]);
      setCurrentBets({});
      startTimer();
    }, 4000);
  };

  // Check if pair
  const isPair = (hand) => {
    if (hand.length < 2) return false;
    return hand[0].value === hand[1].value;
  };

  // Display message
  const displayMessage = (msg) => {
    setGameMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  // Place bet
  const placeBet = (type) => {
    if (gameState !== 'betting') return;
    if (balance < selectedChip) {
      displayMessage('Insufficient balance!');
      return;
    }

    const limits = {
      player: 5000,
      banker: 5000,
      tie: 5000,
      playerPair: 1000,
      bankerPair: 1000,
      eitherPair: 1000,
    };

    setCurrentBets((prev) => {
      const current = prev[type] || 0;
      if (current + selectedChip > limits[type]) {
        displayMessage('Max bet exceeded for this position!');
        return prev;
      }
      setBalance((b) => b - selectedChip);
      return { ...prev, [type]: current + selectedChip };
    });
  };

  // Select chip
  const selectChip = (amount) => {
    setSelectedChip(amount);
  };

  // Clear bets
  const clearBets = () => {
    if (gameState !== 'betting') return;
    const total = Object.values(currentBets).reduce((a, b) => a + b, 0);
    setBalance((prev) => prev + total);
    setCurrentBets({});
  };

  // Double bet
  const doubleBet = () => {
    if (gameState !== 'betting') return;
    const currentTotal = Object.values(currentBets).reduce((a, b) => a + b, 0);
    if (balance < currentTotal) {
      displayMessage('Insufficient balance to double!');
      return;
    }

    Object.keys(currentBets).forEach((type) => {
      const additional = currentBets[type];
      setCurrentBets((prev) => ({ ...prev, [type]: prev[type] * 2 }));
      setBalance((b) => b - additional);
    });
  };

  // Repeat bet
  const repeatBet = () => {
    if (gameState !== 'betting' || Object.keys(lastBets).length === 0) return;
    clearBets();
    Object.entries(lastBets).forEach(([type, amount]) => {
      const times = Math.floor(amount / selectedChip);
      for (let i = 0; i < times && balance >= selectedChip; i++) {
        placeBet(type);
      }
    });
  };

  // Get total bet
  const getTotalBet = () => {
    return Object.values(currentBets).reduce((a, b) => a + b, 0);
  };

  // Timer percentage
  const timerPercent = (timeRemaining / 27) * 100;

  return (
    <div className="p-8 h-screen overflow-hidden">
      {/* Header */}
      <header className="glass-panel border-b border-slate-200 px-8 py-4 mb-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Speed Baccarat</h2>
                <p className="text-sm text-slate-500">Table 3 • 27s rounds • No Commission • $5-$10,000</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              LIVE
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

            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Balance</span>
              <span className="font-bold text-slate-800">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 h-[calc(100vh-140px)]">
        {/* Left Panel: Road Map & Stats */}
        <div className="col-span-3 flex flex-col gap-4">
          {/* Road Map */}
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-xl flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Bead Road</h3>
              <span className="text-xs text-slate-400">Last 100</span>
            </div>
            <div className="grid grid-cols-20 gap-1">
              {history.slice(0, 60).map((h, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white/30 ${
                    h.winner === 'player' ? 'bg-blue-500 text-white' :
                    h.winner === 'banker' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                  }`}
                >
                  {h.winner === 'player' ? 'P' : h.winner === 'banker' ? 'B' : 'T'}
                </div>
              ))}
            </div>

            {/* Big Road Preview */}
            <div className="mt-4 pt-4 border-t border-slate-700">
              <h4 className="text-slate-400 text-xs uppercase tracking-wider mb-2">Big Road</h4>
              <div className="grid grid-cols-12 gap-1">
                {history.slice(0, 24).map((h, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      h.winner === 'player' ? 'bg-blue-600 text-white' :
                      h.winner === 'banker' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {h.winner === 'player' ? 'P' : h.winner === 'banker' ? 'B' : 'T'}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Game Stats */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3">Shoe Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Player Wins</span>
                <span className="font-bold text-blue-600">{sessionStats.playerWins}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(sessionStats.playerWins / (sessionStats.playerWins + sessionStats.bankerWins + sessionStats.tieWins)) * 100}%` }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Banker Wins</span>
                <span className="font-bold text-red-600">{sessionStats.bankerWins}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(sessionStats.bankerWins / (sessionStats.playerWins + sessionStats.bankerWins + sessionStats.tieWins)) * 100}%` }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Ties</span>
                <span className="font-bold text-emerald-600">{sessionStats.tieWins}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(sessionStats.tieWins / (sessionStats.playerWins + sessionStats.bankerWins + sessionStats.tieWins)) * 100}%` }}></div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Cards Remaining</span>
                <span className="font-bold text-slate-800">{shoe.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Game Table */}
        <div className="col-span-6">
          <div className="h-full rounded-3xl relative overflow-hidden flex flex-col shadow-2xl border-4 border-slate-800/20"
            style={{
              background: 'radial-gradient(ellipse at center, #1a3d2e 0%, #0d1f17 100%)',
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)',
              boxShadow: 'inset 0 0 200px rgba(0,0,0,0.8)',
            }}
          >
            {/* Timer */}
            <div className="bg-black/40 backdrop-blur-md p-3 border-b border-white/10 z-20">
              <div className="flex items-center justify-between max-w-lg mx-auto">
                <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
                  {gameState === 'betting' ? 'Place your bets' : gameState === 'dealing' ? 'Dealing...' : 'Settling...'}
                </span>
                <span className={`text-3xl font-bold text-white ${timeRemaining <= 5 ? 'text-rose-400' : ''}`}>
                  {timeRemaining}
                </span>
              </div>
              <div className="w-full bg-black/30 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${timerPercent}%`,
                    background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%)',
                    backgroundSize: '200% 100%',
                  }}
                ></div>
              </div>
            </div>

            {/* Game Message */}
            <div
              className={`absolute top-24 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md rounded-full px-8 py-3 border border-white/20 text-white font-bold text-lg transition-opacity duration-300 z-30 ${
                showMessage ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {gameMessage}
            </div>

            {/* Cards Area */}
            <div className="flex-1 flex items-center justify-center gap-16 py-8 z-10">
              {/* Player Hand */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-blue-400 font-bold text-lg uppercase tracking-wider">Player</span>
                  <div className="bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full">
                    <span className="text-blue-300 font-bold text-sm">{playerScore}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {playerCards.map((card, i) => (
                    <div
                      key={i}
                      className="w-[70px] h-[98px] bg-gradient-to-br from-white to-slate-100 rounded-lg shadow-lg flex flex-col justify-between p-2 border border-slate-200 animate-pulse"
                    >
                      <span className={`text-sm font-bold ${['♥', '♦'].includes(card.suit) ? 'text-red-600' : 'text-slate-900'}`}>
                        {card.value}
                      </span>
                      <span className={`text-2xl text-center ${['♥', '♦'].includes(card.suit) ? 'text-red-600' : 'text-slate-900'}`}>
                        {card.suit}
                      </span>
                      <span className={`text-sm font-bold text-right ${['♥', '♦'].includes(card.suit) ? 'text-red-600' : 'text-slate-900'} rotate-180`}>
                        {card.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-blue-300/60 text-xs">1:1 Payout</div>
              </div>

              {/* VS Indicator */}
              <div className="text-white/20 text-4xl font-black italic">VS</div>

              {/* Banker Hand */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-red-500/20 border border-red-400/30 px-3 py-1 rounded-full">
                    <span className="text-red-300 font-bold text-sm">{bankerScore}</span>
                  </div>
                  <span className="text-red-400 font-bold text-lg uppercase tracking-wider">Banker</span>
                  <div className="absolute -mt-6 ml-8 bg-amber-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded border-2 border-slate-900">
                    5%
                  </div>
                </div>
                <div className="flex gap-2">
                  {bankerCards.map((card, i) => (
                    <div
                      key={i}
                      className="w-[70px] h-[98px] bg-gradient-to-br from-white to-slate-100 rounded-lg shadow-lg flex flex-col justify-between p-2 border border-slate-200 animate-pulse"
                    >
                      <span className={`text-sm font-bold ${['♥', '♦'].includes(card.suit) ? 'text-red-600' : 'text-slate-900'}`}>
                        {card.value}
                      </span>
                      <span className={`text-2xl text-center ${['♥', '♦'].includes(card.suit) ? 'text-red-600' : 'text-slate-900'}`}>
                        {card.suit}
                      </span>
                      <span className={`text-sm font-bold text-right ${['♥', '♦'].includes(card.suit) ? 'text-red-600' : 'text-slate-900'} rotate-180`}>
                        {card.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-red-300/60 text-xs">0.95:1 Payout</div>
              </div>
            </div>

            {/* Betting Areas */}
            <div className="p-6 z-10">
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                {/* Player */}
                <button
                  onClick={() => placeBet('player')}
                  className={`bg-blue-600/20 border-2 border-blue-500/30 rounded-2xl p-6 relative transition-all ${
                    currentBets.player ? 'shadow-lg shadow-blue-500/40 border-blue-500' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="text-blue-400 font-bold text-xl mb-1">PLAYER</div>
                    <div className="text-blue-300/60 text-sm">1:1</div>
                  </div>
                  {currentBets.player > 0 && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-blue-300 font-bold text-sm">
                      ${currentBets.player}
                    </div>
                  )}
                </button>

                {/* Tie */}
                <button
                  onClick={() => placeBet('tie')}
                  className={`bg-emerald-600/20 border-2 border-emerald-500/30 rounded-2xl p-6 relative transition-all ${
                    currentBets.tie ? 'shadow-lg shadow-emerald-500/40 border-emerald-500' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="text-emerald-400 font-bold text-xl mb-1">TIE</div>
                    <div className="text-emerald-300/60 text-sm">8:1</div>
                  </div>
                  {currentBets.tie > 0 && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-emerald-300 font-bold text-sm">
                      ${currentBets.tie}
                    </div>
                  )}
                </button>

                {/* Banker */}
                <button
                  onClick={() => placeBet('banker')}
                  className={`bg-red-600/20 border-2 border-red-500/30 rounded-2xl p-6 relative transition-all ${
                    currentBets.banker ? 'shadow-lg shadow-red-500/40 border-red-500' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="text-red-400 font-bold text-xl mb-1">BANKER</div>
                    <div className="text-red-300/60 text-sm">0.95:1</div>
                  </div>
                  {currentBets.banker > 0 && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-red-300 font-bold text-sm">
                      ${currentBets.banker}
                    </div>
                  )}
                  <div className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded border-2 border-slate-900">
                    5%
                  </div>
                </button>
              </div>

              {/* Side Bets */}
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => placeBet('playerPair')}
                  className="bg-blue-600/10 border border-blue-500/20 rounded-xl px-4 py-2 text-xs text-blue-300 font-medium"
                >
                  Player Pair 11:1
                  {currentBets.playerPair > 0 && (
                    <span className="block text-blue-400 mt-1">${currentBets.playerPair}</span>
                  )}
                </button>
                <button
                  onClick={() => placeBet('eitherPair')}
                  className="bg-purple-600/10 border border-purple-500/20 rounded-xl px-4 py-2 text-xs text-purple-300 font-medium"
                >
                  Either Pair 5:1
                  {currentBets.eitherPair > 0 && (
                    <span className="block text-purple-400 mt-1">${currentBets.eitherPair}</span>
                  )}
                </button>
                <button
                  onClick={() => placeBet('bankerPair')}
                  className="bg-red-600/10 border border-red-500/20 rounded-xl px-4 py-2 text-xs text-red-300 font-medium"
                >
                  Banker Pair 11:1
                  {currentBets.bankerPair > 0 && (
                    <span className="block text-red-400 mt-1">${currentBets.bankerPair}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="bg-black/40 backdrop-blur-md p-4 border-t border-white/10 z-20">
              <div className="flex items-center justify-between max-w-3xl mx-auto">
                {/* Total Bet */}
                <div className="text-white">
                  <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Total Bet</div>
                  <div className="text-2xl font-bold text-amber-400">${getTotalBet().toLocaleString()}</div>
                </div>

                {/* Chip Selection */}
                <div className="flex gap-2 items-center">
                  {chipValues.map((chip) => (
                    <button
                      key={chip.value}
                      onClick={() => selectChip(chip.value)}
                      className={`w-12 h-12 rounded-full border-4 border-dashed border-white/90 shadow-lg flex items-center justify-center font-bold text-xs text-white transition-all ${
                        chip.color.includes('red') ? 'bg-gradient-to-br from-red-500 to-red-700' :
                        chip.color.includes('blue') ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
                        chip.color.includes('green') ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' :
                        chip.color.includes('black') ? 'bg-gradient-to-br from-slate-600 to-slate-800' :
                        chip.color.includes('purple') ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
                        'bg-gradient-to-br from-amber-400 to-amber-600'
                      } ${selectedChip === chip.value ? 'scale-125 ring-4 ring-amber-400/80' : 'hover:scale-110'}`}
                    >
                      ${chip.value >= 1000 ? `$${chip.value / 1000}k` : chip.value}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={clearBets}
                    className="px-4 py-2 bg-rose-600/80 hover:bg-rose-500 text-white rounded-lg font-bold text-sm transition-all"
                  >
                    Clear
                  </button>
                  <button
                    onClick={doubleBet}
                    className="px-4 py-2 bg-slate-600/80 hover:bg-slate-500 text-white rounded-lg font-bold text-sm transition-all"
                  >
                    Double
                  </button>
                  <button
                    onClick={repeatBet}
                    className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm transition-all"
                  >
                    Repeat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: History & Session */}
        <div className="col-span-3 flex flex-col gap-4">
          {/* Session Info */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3">Session Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Current Streak</span>
                <span className={`font-bold ${sessionStats.streakType === 'W' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {sessionStats.streakType}{sessionStats.streak}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Session P/L</span>
                <span className={`font-bold ${sessionStats.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {sessionStats.profit >= 0 ? '+' : ''}${sessionStats.profit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Hands Played</span>
                <span className="font-bold text-slate-800">{sessionStats.handsPlayed}</span>
              </div>
            </div>
          </div>

          {/* Recent Results */}
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-xl flex-1">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Recent Results</h3>
            <div className="space-y-2">
              {history.slice(0, 10).map((h, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                  <span className={`font-bold w-6 ${
                    h.winner === 'player' ? 'text-blue-400' :
                    h.winner === 'banker' ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {h.winner === 'player' ? 'P' : h.winner === 'banker' ? 'B' : 'T'}
                  </span>
                  <span className="text-slate-400 text-sm">{h.pScore} - {h.bScore}</span>
                  <span className="text-slate-500 text-xs">{new Date().toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Limits */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3">Table Limits</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Minimum Bet</span>
                <span className="font-bold text-slate-800">$5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Maximum Bet</span>
                <span className="font-bold text-slate-800">$10,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Max Per Position</span>
                <span className="font-bold text-slate-800">$5,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpeedBaccarat;
