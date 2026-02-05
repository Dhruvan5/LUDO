import { useState } from 'react';
import { Menu } from 'lucide-react';
import Dice from './components/Dice';
import LudoBoard from './components/LudoBoard';
import Overlay from './components/Overlay';
import { COLOR_HEX, COLORS, useLudo } from './hooks/useLudo';

const slotClass = {
  red: 'left-2 top-2',
  green: 'right-2 top-2',
  yellow: 'right-2 bottom-2',
  blue: 'left-2 bottom-2'
};

const App = () => {
  const {
    currentColor,
    diceValue,
    gameState,
    movableTokenIds,
    tokens,
    turn,
    winner,
    lastMoveEvent,
    moveToken,
    resetGame,
    rollDice
  } = useLudo();

  const [menuOpen, setMenuOpen] = useState(false);
  const [rollingColor, setRollingColor] = useState(null);
  const [diceFaces, setDiceFaces] = useState({ red: null, green: null, yellow: null, blue: null });

  const handleRoll = (color) => {
    if (color !== currentColor || gameState !== 'rolling' || rollingColor) return;
    setRollingColor(color);

    setTimeout(() => {
      const roll = rollDice();
      if (roll) {
        setDiceFaces((prev) => ({ ...prev, [color]: roll }));
      }
      setRollingColor(null);
    }, 600);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center bg-slate-900 px-4 pb-4 pt-2 text-white">
      <Overlay winner={winner} onReset={resetGame} />

      <header className="mb-3 flex h-10 w-full max-w-6xl items-center justify-between rounded-xl border border-white/10 bg-slate-800/70 px-4">
        <p className="text-sm font-semibold tracking-wide text-slate-200">LUDO KING STYLE • PASS & PLAY</p>
        <button
          type="button"
          className="rounded-lg p-1.5 hover:bg-white/10"
          onClick={() => setMenuOpen((s) => !s)}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
      </header>

      {menuOpen && (
        <div className="absolute right-4 top-14 z-40 w-52 rounded-xl border border-white/15 bg-slate-800/95 p-3 shadow-2xl">
          <button type="button" onClick={resetGame} className="mb-2 w-full rounded-lg bg-white/10 px-3 py-2 text-left text-sm">Reset Game</button>
          <button type="button" className="mb-2 w-full rounded-lg bg-white/10 px-3 py-2 text-left text-sm">Settings</button>
          <button type="button" className="mb-3 w-full rounded-lg bg-white/10 px-3 py-2 text-left text-sm">Sound (TBD)</button>
          <div className="h-12 rounded-md border border-dashed border-white/20" />
        </div>
      )}

      <section className="mb-3 w-full max-w-6xl text-center">
        <p className="text-lg font-semibold">
          Turn: <span style={{ color: COLOR_HEX[currentColor] }}>{currentColor.toUpperCase()}</span> (P{turn + 1})
        </p>
        <p className="text-sm text-slate-300">State: {gameState} {diceValue ? `• Dice: ${diceValue}` : ''}</p>
      </section>

      <div className="relative w-full max-w-[86vh] aspect-square">
        <LudoBoard tokens={tokens} movableTokenIds={movableTokenIds} onMove={moveToken} lastMoveEvent={lastMoveEvent} />

        {COLORS.map((color) => (
          <div key={color} className={`absolute ${slotClass[color]}`}>
            <Dice
              value={diceFaces[color]}
              color={color}
              isActive={color === currentColor && gameState === 'rolling'}
              isRolling={rollingColor === color}
              onRoll={() => handleRoll(color)}
            />
          </div>
        ))}
      </div>
    </main>
  );
};

export default App;
