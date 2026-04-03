const MAX_STAGES = 6;

/**
 * Vector hangman with stages 0..MAX_STAGES (wrong guesses).
 */
const HangmanFigure = ({ wrongCount }) => {
  const stage = Math.min(Math.max(wrongCount, 0), MAX_STAGES);

  return (
    <div
      className="flex w-full max-w-[min(100%,280px)] shrink-0 justify-center text-slate-200"
      role="img"
      aria-label={`Hangman drawing, ${stage} of ${MAX_STAGES} wrong guesses`}
    >
      <svg
        viewBox="0 0 200 260"
        className="h-auto w-full max-h-[220px] sm:max-h-[260px] drop-shadow-md"
        aria-hidden
      >
        <rect width="200" height="260" fill="transparent" />

        {/* Gallows */}
        <line x1="20" y1="240" x2="120" y2="240" stroke="currentColor" strokeWidth="4" />
        <line x1="70" y1="240" x2="70" y2="30" stroke="currentColor" strokeWidth="4" />
        <line x1="70" y1="30" x2="140" y2="30" stroke="currentColor" strokeWidth="4" />
        <line x1="140" y1="30" x2="140" y2="55" stroke="currentColor" strokeWidth="4" />

        {/* Head */}
        {stage >= 1 && (
          <circle cx="140" cy="72" r="18" fill="none" stroke="currentColor" strokeWidth="3" />
        )}
        {/* Body */}
        {stage >= 2 && <line x1="140" y1="90" x2="140" y2="150" stroke="currentColor" strokeWidth="3" />}
        {/* Arms */}
        {stage >= 3 && <line x1="140" y1="110" x2="110" y2="130" stroke="currentColor" strokeWidth="3" />}
        {stage >= 4 && <line x1="140" y1="110" x2="170" y2="130" stroke="currentColor" strokeWidth="3" />}
        {/* Legs */}
        {stage >= 5 && <line x1="140" y1="150" x2="115" y2="195" stroke="currentColor" strokeWidth="3" />}
        {stage >= 6 && <line x1="140" y1="150" x2="165" y2="195" stroke="currentColor" strokeWidth="3" />}
      </svg>
    </div>
  );
};

export default HangmanFigure;
export { MAX_STAGES };
