import { useState, useEffect, useCallback } from 'react';

function BlackjackGame({ onBack }) {
  // Game State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [balance, setBalance] = useState(25000);
  const [currentBet, setCurrentBet] = useState(0);
  const [selectedChip, setSelectedChip] = useState(100);
  const [deck, setDeck] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [gameState, setGameState] = useState('betting');
  const [gameResult, setGameResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState('');
  const [isDealing, setIsDealing] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    handsPlayed: 0,
    handsWon: 0,
    handsLost: 0,
    pushes: 0,
    blackjacks: 0,
    totalProfit: 0,
    currentStreak: 0,
    bestStreak: 0,
  });

  // Bet History
  const [betHistory, setBetHistory] = useState([]);

  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const chipValues = [
    { value: 5, color: 'from-red-500 to-red-700', label: '$5' },
    { value: 25, color: 'from-blue-500 to-blue-700', label: '$25' },
    { value: 50, color: 'from-emerald-500 to-emerald-700', label: '$50' },
    { value: 100, color: 'from-slate-600 to-slate-800', label: '$100' },
    { value: 500, color: 'from-purple-500 to-purple-700', label: '$500' },
  ];

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Create deck
  const createDeck = useCallback(() => {
    const newDeck = [];
    for (let d = 0; d < 6; d++) {
      for (let suit of suits) {
        for (let value of values) {
          newDeck.push({ suit, value });
        }
      }
    }
    return shuffle(newDeck);
  }, []);

  // Shuffle
  const shuffle = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Calculate hand value
  const calculateHandValue = useCallback((cards) => {
    let value = 0;
    let aces = 0;
    for (let card of cards) {
      if (card.value === 'A') {
        aces++;
        value += 11;
      } else if (['K', 'Q', 'J'].includes(card.value)) {
        value += 10;
      } else {
        value += parseInt(card.value);
      }
    }
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    return value;
  }, []);

  // Select chip
  const selectChip = (value) => {
    if (gameState !== 'betting' || isDealing) return;
    setSelectedChip(value);
  };

  // Place bet
  const placeBet = () => {
    if (gameState !== 'betting' || isDealing) return;
    if (currentBet + selectedChip <= balance && currentBet + selectedChip <= 5000) {
      setCurrentBet((prev) => prev + selectedChip);
      setMessage('');
    } else if (currentBet + selectedChip > 5000) {
      setMessage('Maximum bet is $5,000');
    } else {
      setMessage('Insufficient funds');
    }
  };

  // Clear bet
  const clearBet = () => {
    if (gameState !== 'betting' || isDealing) return;
    setCurrentBet(0);
    setMessage('');
  };

  // Deal card animation
  const dealCardAnimated = async (currentDeck, target, delay = 300) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const card = currentDeck.pop();
        target.push(card);
        resolve(card);
      }, delay);
    });
  };

  // Start round
  const startRound = async () => {
    if (currentBet === 0 || currentBet > balance) {
      setMessage('Please place a valid bet');
      return;
    }
    if (isDealing) return;

    setIsDealing(true);
    setMessage('');

    const newDeck = createDeck();
    const playerStartCards = [];
    const dealerStartCards = [];

    // Deal cards with animation
    await dealCardAnimated(newDeck, playerStartCards, 300);
    setPlayerCards([...playerStartCards]);
    setDeck([...newDeck]);

    await dealCardAnimated(newDeck, dealerStartCards, 300);
    setDealerCards([...dealerStartCards]);
    setDeck([...newDeck]);

    await dealCardAnimated(newDeck, playerStartCards, 300);
    setPlayerCards([...playerStartCards]);
    setDeck([...newDeck]);

    await dealCardAnimated(newDeck, dealerStartCards, 300);
    setDealerCards([...dealerStartCards]);
    setDeck([...newDeck]);

    // Deduct bet
    setBalance((prev) => prev - currentBet);
    setGameState('playing');

    // Check for natural blackjack
    const playerValue = calculateHandValue(playerStartCards);
    const dealerValue = calculateHandValue(dealerStartCards);

    if (playerValue === 21) {
      if (dealerValue === 21) {
        await new Promise((r) => setTimeout(r, 500));
        endRound('push', playerStartCards, dealerStartCards);
      } else {
        await new Promise((r) => setTimeout(r, 500));
        endRound('blackjack', playerStartCards, dealerStartCards);
      }
    } else if (dealerValue === 21) {
      await new Promise((r) => setTimeout(r, 500));
      endRound('lose', playerStartCards, dealerStartCards);
    }

    setIsDealing(false);
  };

  // Hit
  const hit = async () => {
    if (gameState !== 'playing' || isDealing) return;

    setIsDealing(true);
    const currentDeck = [...deck];
    const newPlayerCards = [...playerCards];

    await dealCardAnimated(currentDeck, newPlayerCards, 300);
    setPlayerCards(newPlayerCards);
    setDeck(currentDeck);

    const value = calculateHandValue(newPlayerCards);
    if (value > 21) {
      await new Promise((r) => setTimeout(r, 500));
      endRound('lose', newPlayerCards, dealerCards);
    } else if (value === 21) {
      await new Promise((r) => setTimeout(r, 500));
      stand();
    }

    setIsDealing(false);
  };

  // Stand
  const stand = () => {
    if (gameState !== 'playing' || isDealing) return;
    setGameState('dealer');
    dealerPlay();
  };

  // Double down
  const doubleDown = async () => {
    if (gameState !== 'playing' || isDealing || balance < currentBet) return;

    setIsDealing(true);
    setBalance((prev) => prev - currentBet);
    setCurrentBet((prev) => prev * 2);

    const currentDeck = [...deck];
    const newPlayerCards = [...playerCards];

    await dealCardAnimated(currentDeck, newPlayerCards, 300);
    setPlayerCards(newPlayerCards);
    setDeck(currentDeck);

    const value = calculateHandValue(newPlayerCards);
    if (value > 21) {
      await new Promise((r) => setTimeout(r, 500));
      endRound('lose', newPlayerCards, dealerCards);
    } else {
      setGameState('dealer');
      dealerPlay(newPlayerCards, currentDeck);
    }

    setIsDealing(false);
  };

  // Dealer plays
  const dealerPlay = (playerHand = playerCards, currentDeck = deck) => {
    let hand = [...dealerCards];
    let deckCopy = [...currentDeck];

    const playDealerCard = async () => {
      const value = calculateHandValue(hand);
      if (value < 17) {
        await new Promise((r) => setTimeout(r, 600));
        const newCard = deckCopy.pop();
        hand.push(newCard);
        setDealerCards([...hand]);
        setDeck(deckCopy);
        await playDealerCard();
      } else {
        determineWinner(playerHand, hand);
      }
    };

    playDealerCard();
  };

  // Determine winner
  const determineWinner = (playerHand, dealerHand) => {
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    if (dealerValue > 21) {
      endRound('win', playerHand, dealerHand);
    } else if (playerValue > dealerValue) {
      endRound('win', playerHand, dealerHand);
    } else if (playerValue < dealerValue) {
      endRound('lose', playerHand, dealerHand);
    } else {
      endRound('push', playerHand, dealerHand);
    }
  };

  // End round
  const endRound = (resultType, finalPlayerCards, finalDealerCards) => {
    setGameState('ended');
    let winnings = 0;
    let resultMessage = '';
    let resultTitle = '';

    const newStats = { ...stats, handsPlayed: stats.handsPlayed + 1 };

    switch (resultType) {
      case 'blackjack':
        winnings = currentBet * 2.5;
        setBalance((prev) => prev + winnings);
        resultMessage = `+${(winnings - currentBet).toFixed(2)}`;
        resultTitle = 'Blackjack!';
        newStats.handsWon++;
        newStats.blackjacks++;
        newStats.totalProfit += winnings - currentBet;
        newStats.currentStreak = newStats.currentStreak > 0 ? newStats.currentStreak + 1 : 1;
        newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak);
        break;
      case 'win':
        winnings = currentBet * 2;
        setBalance((prev) => prev + winnings);
        resultMessage = `+${currentBet.toFixed(2)}`;
        resultTitle = 'You Win!';
        newStats.handsWon++;
        newStats.totalProfit += currentBet;
        newStats.currentStreak = newStats.currentStreak > 0 ? newStats.currentStreak + 1 : 1;
        newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak);
        break;
      case 'lose':
        resultMessage = `-${currentBet.toFixed(2)}`;
        resultTitle = 'Dealer Wins';
        newStats.handsLost++;
        newStats.totalProfit -= currentBet;
        newStats.currentStreak = newStats.currentStreak < 0 ? newStats.currentStreak - 1 : -1;
        break;
      case 'push':
        winnings = currentBet;
        setBalance((prev) => prev + winnings);
        resultMessage = 'Bet Returned';
        resultTitle = 'Push';
        newStats.pushes++;
        break;
      default:
        break;
    }

    setStats(newStats);

    // Add to bet history
    const historyEntry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      result: resultType,
      bet: currentBet,
      winnings: winnings - currentBet,
      message: resultMessage,
    };
    setBetHistory((prev) => [historyEntry, ...prev.slice(0, 9)]);

    setGameResult({
      type: resultType,
      title: resultTitle,
      message: resultMessage,
      playerValue: calculateHandValue(finalPlayerCards),
      dealerValue: calculateHandValue(finalDealerCards),
    });
    setShowResult(true);
  };

  // New round
  const newRound = () => {
    setGameState('betting');
    setCurrentBet(0);
    setPlayerCards([]);
    setDealerCards([]);
    setGameResult(null);
    setShowResult(false);
    setMessage('');
    setSelectedChip(100);
    setIsDealing(false);
  };

  // Render card
  const renderCard = (card, hidden = false, index = 0) => {
    if (hidden) {
      return (
        <div
          key={index}
          className="w-16 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-lg border-2 border-white shadow-xl transform transition-all duration-300 hover:scale-105"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)`,
          }}
        />
      );
    }

    const isRed = card.suit === '♥' || card.suit === '♦';
    const color = isRed ? 'text-red-600' : 'text-slate-900';

    return (
      <div
        key={index}
        className={`w-16 h-24 bg-white rounded-lg shadow-xl p-2 flex flex-col justify-between border border-slate-200 transform transition-all duration-300 hover:scale-105 animate-deal-card ${color}`}
      >
        <div className="text-left font-bold text-sm leading-none">{card.value}</div>
        <div className="text-center text-2xl leading-none">{card.suit}</div>
        <div className="text-right font-bold text-sm leading-none rotate-180">{card.value}</div>
      </div>
    );
  };

  const playerValue = calculateHandValue(playerCards);
  const dealerValue = calculateHandValue(dealerCards);
  const winRate = stats.handsPlayed > 0 ? ((stats.handsWon / stats.handsPlayed) * 100).toFixed(1) : 0;

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
              className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Casino
            </button>

            {/* Statistics Panel */}
            <div className="mt-8">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Session Stats</h3>
              <div className="space-y-2 px-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Hands Played</span>
                  <span className="font-semibold text-slate-800">{stats.handsPlayed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Win Rate</span>
                  <span className={`font-semibold ${winRate >= 50 ? 'text-emerald-600' : 'text-slate-800'}`}>{winRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Profit/Loss</span>
                  <span className={`font-semibold ${stats.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Current Streak</span>
                  <span className={`font-semibold ${stats.currentStreak > 0 ? 'text-emerald-600' : stats.currentStreak < 0 ? 'text-red-600' : 'text-slate-800'}`}>
                    {stats.currentStreak > 0 ? `W${stats.currentStreak}` : stats.currentStreak < 0 ? `L${Math.abs(stats.currentStreak)}` : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bet History */}
            {betHistory.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Recent Hands</h3>
                <div className="space-y-1 px-3 max-h-48 overflow-y-auto">
                  {betHistory.map((hand) => (
                    <div key={hand.id} className="flex justify-between text-xs py-1 border-b border-slate-100">
                      <span className="text-slate-500">{hand.time}</span>
                      <span className={`font-medium ${hand.winnings >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {hand.winnings >= 0 ? '+' : ''}${hand.winnings.toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden bg-slate-50">
          {/* Header */}
          <header className="glass-panel border-b border-slate-200 px-8 py-4 z-10 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <span className="text-xl">🃏</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Blackjack Classic</h2>
                    <p className="text-sm text-slate-500">Table 7 • Min: $10 • Max: $5,000 • Decks: 6</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full live-indicator"></span>
                  RNG CERTIFIED
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
                <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-3 rounded-xl border border-emerald-200 shadow-sm">
                  <div>
                    <span className="text-xs text-emerald-700 uppercase tracking-wider font-semibold block">Balance</span>
                    <span className="font-bold text-emerald-800 text-xl">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Game Area */}
          <div className="h-[calc(100vh-80px)] p-6 overflow-auto">
            <div
              className="h-full rounded-3xl relative overflow-hidden flex flex-col shadow-2xl border-4 border-slate-800/20"
              style={{
                backgroundColor: '#0f5132',
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 2px, transparent 2px), radial-gradient(circle at 25% 25%, rgba(0,0,0,0.2) 1px, transparent 1px)`,
                backgroundSize: '30px 30px, 15px 15px',
              }}
            >
              {/* Dealer Section */}
              <div className="flex-1 flex flex-col items-center justify-center pt-8 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Dealer</span>
                  <div className={`px-4 py-1.5 rounded-full text-white text-sm font-bold backdrop-blur-sm transition-all ${
                    dealerValue > 21 ? 'bg-red-600' : dealerValue === 21 && dealerCards.length === 2 ? 'bg-amber-500' : 'bg-black/70'
                  }`}>
                    {gameState === 'playing' || gameState === 'betting'
                      ? dealerCards.length > 0
                        ? '?'
                        : '--'
                      : dealerValue || '--'}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 min-h-[96px]">
                  {dealerCards.map((card, index) => {
                    if (gameState === 'playing' && index === 1) {
                      return renderCard(card, true, index);
                    }
                    return renderCard(card, false, index);
                  })}
                </div>
                <div className="mt-3 text-white/50 text-xs uppercase tracking-widest">Dealer stands on 17</div>
              </div>

              {/* Message Display */}
              {message && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md rounded-full px-6 py-2 border border-white/20 text-white font-medium text-sm z-10 animate-fade-in">
                  {message}
                </div>
              )}

              {/* Betting Area */}
              <div className="flex items-center justify-center py-4">
                <div className="flex gap-8 items-end">
                  <div className="flex flex-col items-center gap-3">
                    <div
                      onClick={gameState === 'betting' && !isDealing ? (currentBet > 0 ? startRound : placeBet) : null}
                      className={`w-36 h-36 border-4 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        currentBet > 0
                          ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/30 scale-105'
                          : 'border-white/40 bg-black/10 hover:border-white/60'
                      } ${isDealing ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <div className="text-center">
                        {gameState === 'betting' && !isDealing ? (
                          <>
                            <span className="text-white font-bold text-lg block">
                              {currentBet > 0 ? '🎴 Deal Cards' : '💰 Place Bet'}
                            </span>
                            {currentBet > 0 && (
                              <span className="text-white/80 text-sm block mt-1">Click to start</span>
                            )}
                          </>
                        ) : (
                          <span className="text-white/60 text-sm font-medium">Bet: ${currentBet}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-white/60 text-xs font-medium uppercase tracking-wider block mb-1">Current Bet</span>
                      <span className="text-white font-bold text-2xl">${currentBet}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Player Section */}
              <div className="flex-1 flex flex-col items-center justify-center pt-4 pb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Your Hand</span>
                  <div className={`px-4 py-1.5 rounded-full text-white text-sm font-bold backdrop-blur-sm transition-all ${
                    playerValue > 21 ? 'bg-red-600' : playerValue === 21 && playerCards.length === 2 ? 'bg-amber-500' : 'bg-black/70'
                  }`}>
                    {playerValue || '--'}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 min-h-[96px] mb-6">
                  {playerCards.map((card, index) => renderCard(card, false, index))}
                </div>

                {/* Action Buttons */}
                {gameState === 'playing' && !isDealing && (
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={hit}
                      disabled={isDealing}
                      className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-white rounded-xl font-bold shadow-lg border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all disabled:cursor-not-allowed"
                    >
                      Hit
                    </button>
                    <button
                      onClick={stand}
                      disabled={isDealing}
                      className="px-8 py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-white rounded-xl font-bold shadow-lg border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 transition-all disabled:cursor-not-allowed"
                    >
                      Stand
                    </button>
                    <button
                      onClick={doubleDown}
                      disabled={isDealing || balance < currentBet || playerCards.length !== 2}
                      className="px-8 py-4 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 text-white rounded-xl font-bold shadow-lg border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all disabled:cursor-not-allowed"
                    >
                      Double
                    </button>
                  </div>
                )}

                {/* Result Display */}
                {gameState === 'ended' && gameResult && (
                  <div className="mb-6 animate-fade-in">
                    <div className={`px-8 py-4 rounded-xl font-bold text-xl text-center shadow-xl ${
                      gameResult.type === 'win' || gameResult.type === 'blackjack'
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                        : gameResult.type === 'lose'
                        ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                        : 'bg-gradient-to-r from-slate-500 to-gray-500 text-white'
                    }`}>
                      <div className="text-lg mb-1">{gameResult.title}</div>
                      <div className="text-4xl font-bold">{gameResult.message}</div>
                    </div>
                  </div>
                )}

                {/* New Round Button */}
                {gameState === 'ended' && !isDealing && (
                  <button
                    onClick={newRound}
                    className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg shadow-xl border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all"
                  >
                    🎲 New Round
                  </button>
                )}

                {/* Chip Selection */}
                {gameState === 'betting' && !isDealing && (
                  <div className="flex gap-3 items-center bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <span className="text-white/60 text-xs uppercase tracking-wider mr-2 font-medium">Select Chip:</span>
                    {chipValues.map((chip) => (
                      <div
                        key={chip.value}
                        onClick={() => selectChip(chip.value)}
                        className={`w-14 h-14 rounded-full border-4 border-dashed border-white/80 shadow-lg flex items-center justify-center font-bold text-xs text-white cursor-pointer transition-all hover:scale-110 bg-gradient-to-br ${chip.color} ${
                          selectedChip === chip.value ? 'scale-115 ring-4 ring-white/60' : ''
                        }`}
                      >
                        {chip.label}
                      </div>
                    ))}
                    {currentBet > 0 && (
                      <button
                        onClick={clearBet}
                        className="ml-2 px-4 py-2 bg-red-500 hover:bg-red-400 text-white text-sm font-bold rounded-lg transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes deal-card {
          from {
            transform: translateY(-100px) rotateY(180deg);
            opacity: 0;
          }
          to {
            transform: translateY(0) rotateY(0);
            opacity: 1;
          }
        }
        .animate-deal-card {
          animation: deal-card 0.5s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default BlackjackGame;
