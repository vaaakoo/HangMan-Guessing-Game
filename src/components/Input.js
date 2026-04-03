const Input = ({ inputValue, handleChange, handleGuess, disabled }) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
      <label className="flex flex-1 flex-col gap-1 text-sm text-slate-400">
        <span className="font-medium text-slate-300">Type a letter</span>
        <input
          className="w-full max-w-[4.5rem] rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-center text-2xl font-semibold uppercase text-white shadow-inner outline-none ring-teal-500/0 transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={1}
          value={inputValue}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleGuess(inputValue);
            }
          }}
        />
      </label>
      <button
        type="button"
        disabled={disabled || !inputValue}
        onClick={() => handleGuess(inputValue)}
        className="rounded-xl bg-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Guess
      </button>
    </div>
  );
};

export default Input;
