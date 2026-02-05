import { useMemo, useState } from 'react';

export const COLORS = ['red', 'green', 'yellow', 'blue'];
export const COLOR_HEX = {
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#eab308',
  blue: '#3b82f6'
};

const START_INDEX = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39
};

const SAFE_PATH_INDEXES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

export const COMMON_PATH = [
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6], [0, 7], [0, 8],
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14], [7, 14], [8, 14],
  [8, 13], [8, 12], [8, 11], [8, 10], [8, 9], [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8], [14, 7], [14, 6],
  [13, 6], [12, 6], [11, 6], [10, 6], [9, 6], [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0], [7, 0], [6, 0]
];

export const HOME_STRETCH = {
  red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  green: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
  blue: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]]
};

const BASE_CELLS = {
  red: [[1, 1], [1, 3], [3, 1], [3, 3]],
  green: [[1, 11], [1, 13], [3, 11], [3, 13]],
  yellow: [[11, 11], [11, 13], [13, 11], [13, 13]],
  blue: [[11, 1], [11, 3], [13, 1], [13, 3]]
};

const createTokens = () =>
  COLORS.flatMap((color) =>
    Array.from({ length: 4 }, (_, index) => ({
      id: `${color}-${index}`,
      color,
      position: null,
      status: 'base'
    }))
  );

const nextTurn = (turn) => (turn + 1) % 4;

export const getTokenCoord = (token) => {
  if (token.status === 'base') {
    const idx = Number(token.id.split('-')[1]);
    return BASE_CELLS[token.color][idx];
  }

  if (token.status === 'home') {
    return [7, 7];
  }

  if (token.position < 52) {
    const pathIndex = (START_INDEX[token.color] + token.position) % 52;
    return COMMON_PATH[pathIndex];
  }

  return HOME_STRETCH[token.color][token.position - 52];
};

export const useLudo = () => {
  const [turn, setTurn] = useState(0);
  const [tokens, setTokens] = useState(createTokens);
  const [diceValue, setDiceValue] = useState(null);
  const [gameState, setGameState] = useState('rolling');
  const [winner, setWinner] = useState(null);

  const currentColor = COLORS[turn];

  const isMoveValid = (token, roll) => {
    if (token.color !== currentColor || token.status === 'home') return false;
    if (token.status === 'base') return roll === 6;
    return token.position + roll <= 57;
  };

  const movableTokenIds = useMemo(() => {
    if (gameState !== 'moving' || !diceValue) return new Set();
    return new Set(
      tokens.filter((token) => isMoveValid(token, diceValue)).map((token) => token.id)
    );
  }, [tokens, gameState, diceValue, currentColor]);

  const checkWinner = (nextTokens, color) => {
    const finished = nextTokens.filter((token) => token.color === color && token.status === 'home').length === 4;
    if (finished) {
      setWinner(color);
      setGameState('finished');
      return true;
    }
    return false;
  };

  const rollDice = () => {
    if (gameState !== 'rolling') return;
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceValue(roll);

    const hasMove = tokens.some((token) => isMoveValid(token, roll));
    if (!hasMove) {
      if (roll === 6) {
        setGameState('rolling');
      } else {
        setTurn((t) => nextTurn(t));
        setGameState('rolling');
      }
      setDiceValue(null);
      return;
    }

    setGameState('moving');
  };

  const moveToken = (tokenId) => {
    if (gameState !== 'moving' || !movableTokenIds.has(tokenId)) return;
    let captured = false;
    let moverColor = null;

    const nextTokens = tokens.map((token) => {
      if (token.id !== tokenId) return token;
      moverColor = token.color;

      if (token.status === 'base') {
        return { ...token, status: 'path', position: 0 };
      }

      const nextPosition = token.position + diceValue;
      if (nextPosition === 57) {
        return { ...token, status: 'home', position: 57 };
      }
      return { ...token, position: nextPosition, status: 'path' };
    });

    const movedToken = nextTokens.find((token) => token.id === tokenId);

    if (movedToken.status === 'path' && movedToken.position < 52) {
      const movedPathIndex = (START_INDEX[movedToken.color] + movedToken.position) % 52;
      const isSafe = SAFE_PATH_INDEXES.has(movedPathIndex) || movedToken.position === 0;

      if (!isSafe) {
        for (let i = 0; i < nextTokens.length; i += 1) {
          const target = nextTokens[i];
          if (
            target.id !== movedToken.id &&
            target.color !== movedToken.color &&
            target.status === 'path' &&
            target.position < 52
          ) {
            const targetPathIndex = (START_INDEX[target.color] + target.position) % 52;
            if (targetPathIndex === movedPathIndex) {
              nextTokens[i] = { ...target, status: 'base', position: null };
              captured = true;
            }
          }
        }
      }
    }

    setTokens(nextTokens);
    const won = checkWinner(nextTokens, moverColor);
    if (won) return;

    const extraTurn = diceValue === 6 || captured;
    setGameState('rolling');
    setDiceValue(null);
    if (!extraTurn) setTurn((t) => nextTurn(t));
  };

  const resetGame = () => {
    setTurn(0);
    setTokens(createTokens());
    setDiceValue(null);
    setGameState('rolling');
    setWinner(null);
  };

  return {
    turn,
    tokens,
    diceValue,
    gameState,
    winner,
    currentColor,
    movableTokenIds,
    rollDice,
    moveToken,
    resetGame
  };
};
