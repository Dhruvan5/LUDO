import { COLOR_HEX } from '../hooks/useLudo';

const Dice = ({ canRoll, value, color, onRoll }) => (
  <button
    type="button"
    disabled={!canRoll}
    onClick={onRoll}
    className="relative h-24 w-24 rounded-3xl border border-white/30 bg-gradient-to-b from-white to-slate-200 text-4xl font-black text-slate-900 shadow-[0_14px_0_#94a3b8,0_20px_30px_rgba(0,0,0,0.45)] transition active:translate-y-1 active:shadow-[0_8px_0_#94a3b8,0_10px_18px_rgba(0,0,0,0.4)] disabled:opacity-60"
    style={{ boxShadow: `0 14px 0 ${COLOR_HEX[color]}aa, 0 20px 30px rgba(0,0,0,0.45)` }}
    aria-label="Roll dice"
  >
    {value || '🎲'}
  </button>
);

export default Dice;
