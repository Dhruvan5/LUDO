import Token from './Token';
import { COLOR_HEX, COMMON_PATH, getTokenCoord, HOME_STRETCH } from '../hooks/useLudo';

const safeSet = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

const baseAreas = {
  red: [
    [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5],
    [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5],
    [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5],
    [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5]
  ],
  green: [
    [0, 9], [0, 10], [0, 11], [0, 12], [0, 13], [0, 14],
    [1, 9], [1, 10], [1, 11], [1, 12], [1, 13], [1, 14],
    [2, 9], [2, 10], [2, 11], [2, 12], [2, 13], [2, 14],
    [3, 9], [3, 10], [3, 11], [3, 12], [3, 13], [3, 14],
    [4, 9], [4, 10], [4, 11], [4, 12], [4, 13], [4, 14],
    [5, 9], [5, 10], [5, 11], [5, 12], [5, 13], [5, 14]
  ],
  yellow: [
    [9, 9], [9, 10], [9, 11], [9, 12], [9, 13], [9, 14],
    [10, 9], [10, 10], [10, 11], [10, 12], [10, 13], [10, 14],
    [11, 9], [11, 10], [11, 11], [11, 12], [11, 13], [11, 14],
    [12, 9], [12, 10], [12, 11], [12, 12], [12, 13], [12, 14],
    [13, 9], [13, 10], [13, 11], [13, 12], [13, 13], [13, 14],
    [14, 9], [14, 10], [14, 11], [14, 12], [14, 13], [14, 14]
  ],
  blue: [
    [9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [9, 5],
    [10, 0], [10, 1], [10, 2], [10, 3], [10, 4], [10, 5],
    [11, 0], [11, 1], [11, 2], [11, 3], [11, 4], [11, 5],
    [12, 0], [12, 1], [12, 2], [12, 3], [12, 4], [12, 5],
    [13, 0], [13, 1], [13, 2], [13, 3], [13, 4], [13, 5],
    [14, 0], [14, 1], [14, 2], [14, 3], [14, 4], [14, 5]
  ]
};

const entries = {
  red: [6, 1],
  green: [1, 8],
  yellow: [8, 13],
  blue: [13, 6]
};

const isCoord = (coord, r, c) => coord[0] === r && coord[1] === c;

const getCellStyle = (r, c) => {
  for (const [color, cells] of Object.entries(baseAreas)) {
    if (cells.some((coord) => isCoord(coord, r, c))) {
      return { backgroundColor: `${COLOR_HEX[color]}33` };
    }
  }

  const pathIndex = COMMON_PATH.findIndex((coord) => isCoord(coord, r, c));
  if (pathIndex > -1) {
    const isSafe = safeSet.has(pathIndex);
    return {
      backgroundColor: isSafe ? '#f8fafc' : '#ffffff',
      color: isSafe ? '#f59e0b' : '#0f172a'
    };
  }

  for (const [color, cells] of Object.entries(HOME_STRETCH)) {
    if (cells.some((coord) => isCoord(coord, r, c))) {
      return { backgroundColor: `${COLOR_HEX[color]}99` };
    }
  }

  if (r === 7 && c === 7) {
    return {
      background: 'conic-gradient(#22c55e 0deg 90deg, #eab308 90deg 180deg, #3b82f6 180deg 270deg, #ef4444 270deg 360deg)'
    };
  }

  return { backgroundColor: '#e2e8f0' };
};

const LudoBoard = ({ tokens, movableTokenIds, onMove }) => {
  const tokensByCell = new Map();

  tokens.forEach((token) => {
    const [r, c] = getTokenCoord(token);
    const key = `${r}-${c}`;
    if (!tokensByCell.has(key)) tokensByCell.set(key, []);
    tokensByCell.get(key).push(token);
  });

  return (
    <div className="grid h-full w-full gap-px overflow-hidden rounded-3xl bg-slate-300 p-1 shadow-2xl"
      style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))", gridTemplateRows: "repeat(15, minmax(0, 1fr))" }}>
      {Array.from({ length: 15 }).map((_, r) =>
        Array.from({ length: 15 }).map((__, c) => {
          const key = `${r}-${c}`;
          const cellTokens = tokensByCell.get(key) ?? [];
          const pathIndex = COMMON_PATH.findIndex((coord) => isCoord(coord, r, c));

          return (
            <div
              key={key}
              className="relative flex items-center justify-center"
              style={getCellStyle(r, c)}
            >
              {pathIndex > -1 && safeSet.has(pathIndex) && (
                <span className="absolute text-xs">★</span>
              )}
              {Object.entries(entries).map(([color, coord]) =>
                isCoord(coord, r, c) ? (
                  <span key={color} className="absolute text-[10px] font-black" style={{ color: COLOR_HEX[color] }}>
                    S
                  </span>
                ) : null
              )}
              <div className="flex flex-wrap items-center justify-center gap-0.5 p-0.5">
                {cellTokens.map((token) => (
                  <Token
                    key={token.id}
                    token={token}
                    movable={movableTokenIds.has(token.id)}
                    onClick={onMove}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default LudoBoard;
