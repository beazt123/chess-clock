import { useState, useEffect, useCallback } from 'react';
import './ChessClock.css';

type GameState = 'setup' | 'running' | 'paused' | 'timeout';
type ActivePlayer = 1 | 2 | null;

function ChessClock() {
  // Player names
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  
  // Player colors (1 or 2 indicates which player is white)
  const [whitePlayer, setWhitePlayer] = useState<1 | 2>(1);
  
  // Timer setup (in minutes)
  const [player1Setup, setPlayer1Setup] = useState(5);
  const [player2Setup, setPlayer2Setup] = useState(5);
  
  // Timer state (in milliseconds)
  const [player1Time, setPlayer1Time] = useState(player1Setup * 60 * 1000);
  const [player2Time, setPlayer2Time] = useState(player2Setup * 60 * 1000);
  
  // Game state
  const [gameState, setGameState] = useState<GameState>('setup');
  const [activePlayer, setActivePlayer] = useState<ActivePlayer>(null);

  // Start the game with configured times
  const startGame = () => {
    const p1Time = player1Setup * 60 * 1000;
    const p2Time = player2Setup * 60 * 1000;
    setPlayer1Time(p1Time);
    setPlayer2Time(p2Time);
    setActivePlayer(whitePlayer); // White player starts
    setGameState('running');
  };

  // Reset to setup
  const resetGame = () => {
    setGameState('setup');
    setActivePlayer(null);
    setPlayer1Time(player1Setup * 60 * 1000);
    setPlayer2Time(player2Setup * 60 * 1000);
  };

  // Play click sound using Web Audio API
  const playClickSound = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Sharp, short click sound
      oscillator.frequency.value = 1000; // 1000 Hz for a sharp click
      oscillator.type = 'sine';
      
      // Quick attack and decay for snappy sound
      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      
      oscillator.start(now);
      oscillator.stop(now + 0.05);
      
      // Clean up after sound finishes or after timeout fallback
      let cleanedUp = false;
      const cleanup = () => {
        if (!cleanedUp) {
          cleanedUp = true;
          try {
            gainNode.disconnect();
            oscillator.disconnect();
            audioContext.close();
          } catch (e) {
            // Ignore cleanup errors
          }
        }
      };
      oscillator.onended = cleanup;
      // Fallback: cleanup after 60ms in case onended doesn't fire
      setTimeout(cleanup, 60);
    } catch (error) {
      // Silently fail if audio context is not supported
      console.warn('Audio playback not supported:', error);
    }
  }, []);

  // Toggle between players
  const togglePlayer = useCallback(() => {
    if (gameState === 'running' && activePlayer) {
      playClickSound();
      setActivePlayer(activePlayer === 1 ? 2 : 1);
    }
  }, [gameState, activePlayer, playClickSound]);

  // Handle keyboard events for clock toggle (ignores modifier, function, and special keys)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore modifier keys
      if (
        event.altKey ||
        event.metaKey ||
        event.ctrlKey ||
        ['Alt', 'Meta', 'Control', 'Shift'].includes(event.key)
      ) {
        return;
      }

      // Ignore function keys (F1-F12)
      if (event.key.match(/^F([1-9]|1[0-2])$/)) {
        return;
      }

      // Ignore specific keys
      const ignoredKeys = ['Backspace', 'Enter', 'Tab'];
      if (ignoredKeys.includes(event.key)) {
        return;
      }

      // Only toggle player and prevent default for spacebar
      if (gameState === 'running' && (event.key === ' ' || event.key === 'Spacebar')) {
        event.preventDefault();
        togglePlayer();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, togglePlayer]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'running' || !activePlayer) return;

    const interval = setInterval(() => {
      if (activePlayer === 1) {
        setPlayer1Time((prev) => {
          const newTime = prev - 10;
          if (newTime <= 0) {
            setGameState('timeout');
            setActivePlayer(null);
            return 0;
          }
          return newTime;
        });
      } else {
        setPlayer2Time((prev) => {
          const newTime = prev - 10;
          if (newTime <= 0) {
            setGameState('timeout');
            setActivePlayer(null);
            return 0;
          }
          return newTime;
        });
      }
    }, 10);

    return () => clearInterval(interval);
  }, [gameState, activePlayer]);

  // Format time as MM:SS
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`chess-clock-container ${gameState === 'timeout' ? 'timeout' : ''}`}>
      {gameState === 'setup' && (
        <div className="setup-screen">
          <h1>♔ Chess Clock ♚</h1>
          
          <div className="color-selection">
            <div className="color-toggle">
              <div className="player-color-indicator">
                <button 
                  className="king-button"
                  onClick={() => setWhitePlayer(whitePlayer === 1 ? 2 : 1)}
                >
                  {whitePlayer === 1 ? '♔' : '♚'}
                </button>
              </div>
              <button 
                className="swap-button"
                onClick={() => setWhitePlayer(whitePlayer === 1 ? 2 : 1)}
                title="Swap colors"
              >
                ⇄
              </button>
              <div className="player-color-indicator">
                <button 
                  className="king-button"
                  onClick={() => setWhitePlayer(whitePlayer === 1 ? 2 : 1)}
                >
                  {whitePlayer === 2 ? '♔' : '♚'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="setup-controls">
            <div className="player-setup">
              <h2>Player 1</h2>
              <div className="time-input">
                <label>Name:</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value || 'Player 1')}
                  maxLength={20}
                />
              </div>
              <div className="time-input">
                <label>Minutes:</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={player1Setup}
                  onChange={(e) => setPlayer1Setup(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
            </div>

            <div className="player-setup">
              <h2>Player 2</h2>
              <div className="time-input">
                <label>Name:</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value || 'Player 2')}
                  maxLength={20}
                />
              </div>
              <div className="time-input">
                <label>Minutes:</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={player2Setup}
                  onChange={(e) => setPlayer2Setup(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
            </div>
          </div>

          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
        </div>
      )}

      {(gameState === 'running' || gameState === 'paused' || gameState === 'timeout') && (
        <div className="game-screen">
          <div 
            className={`timer player1-timer portrait-rotate-180 ${activePlayer === 1 ? 'active' : ''} ${player1Time === 0 ? 'timeout-player' : ''}`}
            onClick={togglePlayer}
          >
            <div className="player-label">
              {player1Name}
              <span className={`color-badge ${whitePlayer === 1 ? 'white' : 'black'}`}>
                {whitePlayer === 1 ? '⚪' : '⚫'}
              </span>
            </div>
            <div className="time-display">{formatTime(player1Time)}</div>
          </div>

          <div 
            className={`timer player2-timer ${activePlayer === 2 ? 'active' : ''} ${player2Time === 0 ? 'timeout-player' : ''}`}
            onClick={togglePlayer}
          >
            <div className="player-label">
              {player2Name}
              <span className={`color-badge ${whitePlayer === 2 ? 'white' : 'black'}`}>
                {whitePlayer === 2 ? '⚪' : '⚫'}
              </span>
            </div>
            <div className="time-display">{formatTime(player2Time)}</div>
          </div>

          {gameState === 'timeout' && (
            <div className="timeout-message">
              <h1>TIME OUT!</h1>
              <p>{player1Time === 0 ? player2Name : player1Name} Wins!</p>
              <button className="timeout-reset-button" onClick={resetGame} title="Reset">
                ↻ New Game
              </button>
            </div>
          )}

          <div className="game-controls">
            <button className="reset-button" onClick={resetGame} title="Reset">
              ↻
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChessClock;
