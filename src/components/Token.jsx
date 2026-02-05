import { COLOR_HEX } from '../hooks/useLudo';

const Token = ({ token, movable, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(token.id)}
    className={`h-5 w-5 rounded-full border-2 border-white/80 shadow-md transition ${movable ? 'movable-bounce ring-2 ring-white/80' : ''}`}
    style={{ backgroundColor: COLOR_HEX[token.color] }}
    aria-label={`${token.color} token`}
  />
);

export default Token;
