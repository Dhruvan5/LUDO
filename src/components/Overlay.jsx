import { COLOR_HEX } from '../hooks/useLudo';

const Overlay = ({ winner, onReset }) => {
  if (!winner) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="rounded-3xl bg-slate-900/95 p-8 text-center shadow-2xl ring-1 ring-white/20">
        <h2 className="text-3xl font-black" style={{ color: COLOR_HEX[winner] }}>
          {winner.toUpperCase()} Wins!
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="mt-6 rounded-xl bg-white px-6 py-3 font-bold text-slate-900"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default Overlay;
