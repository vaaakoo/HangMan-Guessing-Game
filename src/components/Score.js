const Score = ({ playerScore, computerScore, matchTarget }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <div className="rounded-xl bg-teal-950/40 p-4 ring-1 ring-teal-700/40">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-400/90">You</p>
        <p className="mt-1 text-3xl font-bold text-teal-300">
          {playerScore}
          <span className="ml-1 text-base font-normal text-slate-500">/ {matchTarget}</span>
        </p>
      </div>
      <div className="rounded-xl bg-slate-800/80 p-4 ring-1 ring-slate-600/60">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Computer</p>
        <p className="mt-1 text-3xl font-bold text-slate-200">
          {computerScore}
          <span className="ml-1 text-base font-normal text-slate-500">/ {matchTarget}</span>
        </p>
      </div>
    </div>
  );
};

export default Score;
