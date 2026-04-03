const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

const Keyboard = ({ guessedLetters, disabled, onLetter }) => {
  const guessed = new Set(guessedLetters.map((c) => c.toLowerCase()));

  return (
    <div className="flex w-full max-w-xl flex-col gap-1.5 sm:gap-2" role="group" aria-label="Letter keyboard">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex flex-wrap justify-center gap-1 sm:gap-1.5">
          {row.map((letter) => {
            const used = guessed.has(letter);
            return (
              <button
                key={letter}
                type="button"
                disabled={disabled || used}
                onClick={() => onLetter(letter)}
                className={[
                  "min-h-[40px] min-w-[32px] flex-1 rounded-lg px-1.5 py-2 text-sm font-semibold uppercase",
                  "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:min-w-[36px] sm:text-base",
                  used
                    ? "cursor-not-allowed bg-slate-700/80 text-slate-500"
                    : "bg-slate-700 text-slate-100 hover:bg-teal-600 active:bg-teal-700",
                  disabled && !used ? "opacity-50" : "",
                ].join(" ")}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
