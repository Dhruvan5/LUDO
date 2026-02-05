import { motion } from 'framer-motion';
import { COLOR_HEX } from '../hooks/useLudo';

const Dice = ({ value, color, isActive, isRolling, onRoll }) => (
  <motion.button
    type="button"
    disabled={!isActive || isRolling}
    onClick={onRoll}
    whileTap={isActive ? { scale: 0.95 } : undefined}
    animate={
      isRolling
        ? { rotate: [0, -12, 12, -10, 10, -6, 6, 0], scale: 1.1 }
        : isActive
          ? { boxShadow: [`0 0 0 0 ${COLOR_HEX[color]}66`, `0 0 0 14px ${COLOR_HEX[color]}00`, `0 0 0 0 ${COLOR_HEX[color]}00`], scale: 1 }
          : { rotate: 0, scale: 1 }
    }
    transition={
      isRolling
        ? { duration: 0.6, ease: 'easeInOut' }
        : isActive
          ? { duration: 1.4, repeat: Infinity, ease: 'easeOut' }
          : { duration: 0.2 }
    }
    className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/35 bg-white text-2xl font-black text-slate-900 shadow-lg disabled:opacity-65"
    style={{ borderColor: `${COLOR_HEX[color]}99` }}
    aria-label={`${color} dice`}
  >
    {value ?? '🎲'}
  </motion.button>
);

export default Dice;
