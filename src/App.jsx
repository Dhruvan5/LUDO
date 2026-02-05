import Dice from './components/Dice';
import LudoBoard from './components/LudoBoard';
import Overlay from './components/Overlay';
import { COLOR_HEX, useLudo } from './hooks/useLudo';

const App = () => {
  const {
    currentColor,
    diceValue,
    gameState,
    movableTokenIds,
    tokens,
    turn,
    winner,
    moveToken,
    resetGame,
    rollDice
  } = useLudo();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <Overlay winner={winner} onReset={resetGame} />
      <header className="w-full max-w-5xl rounded-2xl bg-slate-800/85 p-4 text-center shadow-xl ring-1 ring-white/10">
        <h1 className="text-2xl font-black tracking-wide">LUDO TABLET PASS-AND-PLAY</h1>
        <p className="mt-2 text-lg font-semibold">
          Turn: <span style={{ color: COLOR_HEX[currentColor] }}>{currentColor.toUpperCase()}</span> (P{turn + 1})
        </p>
        <p className="text-sm text-slate-200">State: {gameState} {diceValue ? `• Dice: ${diceValue}` : ''}</p>
      </header>

      <section className="flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-6 md:flex-row">
        <div className="w-full max-w-[82vh] aspect-square">
          <LudoBoard tokens={tokens} movableTokenIds={movableTokenIds} onMove={moveToken} />
        </div>
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-slate-800/85 p-5 shadow-xl ring-1 ring-white/10">
          <Dice canRoll={gameState === 'rolling'} value={diceValue} color={currentColor} onRoll={rollDice} />
          <button
            type="button"
            onClick={resetGame}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white"
          >
            Reset
          </button>
        </div>
      </section>
    </main>
  );
};

export default App;
