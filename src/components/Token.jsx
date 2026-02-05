import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { COLOR_HEX } from '../hooks/useLudo';

const Token = ({ token, movable, onClick, cellSize, currentPoint, moveEvent }) => {
  const controls = useAnimation();

  useEffect(() => {
    const run = async () => {
      if (!moveEvent) return;
      if (moveEvent.movedId === token.id && moveEvent.movedPath?.length) {
        const xFrames = [moveEvent.movedFrom, ...moveEvent.movedPath].map((p) => p[1] * cellSize + cellSize * 0.5);
        const yFrames = [moveEvent.movedFrom, ...moveEvent.movedPath].map((p) => p[0] * cellSize + cellSize * 0.5);

        await controls.start({
          x: xFrames,
          y: yFrames,
          transition: {
            duration: Math.max(0.28, moveEvent.movedPath.length * 0.15),
            ease: 'easeInOut',
            times: xFrames.map((_, i) => i / (xFrames.length - 1 || 1))
          }
        });

        controls.start({
          scale: [1, 1.18, 1],
          transition: { duration: 0.22 }
        });
      }

      const captured = moveEvent.captured?.find((c) => c.id === token.id);
      if (captured) {
        await controls.start({
          x: [captured.from[1] * cellSize + cellSize * 0.5, captured.to[1] * cellSize + cellSize * 0.5],
          y: [captured.from[0] * cellSize + cellSize * 0.5, captured.to[0] * cellSize + cellSize * 0.5],
          scale: [1, 0.5, 1],
          opacity: [1, 0.65, 1],
          transition: { duration: 0.38, ease: 'easeInOut' }
        });
      }
    };

    run();
  }, [moveEvent, token.id, controls, cellSize]);

  useEffect(() => {
    controls.set({ x: currentPoint.x, y: currentPoint.y, scale: 1, opacity: 1 });
  }, [currentPoint.x, currentPoint.y, controls]);

  return (
    <motion.button
      type="button"
      onClick={() => onClick(token.id)}
      animate={controls}
      initial={false}
      whileTap={{ scale: 0.93 }}
      className={`absolute z-20 flex items-center justify-center rounded-full border border-white/80 shadow-md ${movable ? 'movable-bounce ring-2 ring-white/80' : ''}`}
      style={{
        width: `${cellSize * 0.58}px`,
        height: `${cellSize * 0.58}px`,
        marginLeft: `${-cellSize * 0.29}px`,
        marginTop: `${-cellSize * 0.29}px`,
        background: `radial-gradient(circle at 35% 32%, #ffffffcc 0%, ${COLOR_HEX[token.color]} 52%, #00000044 100%)`
      }}
      aria-label={`${token.color} token`}
    />
  );
};

export default Token;
