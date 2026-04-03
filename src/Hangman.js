import React, { useCallback, useEffect, useMemo, useState } from "react";
import mathBg from "./image/math.png";
import { fetchRandomWord } from "./api/hangmanApi";
import Score from "./components/Score";
import Input from "./components/Input";
import HangmanFigure, { MAX_STAGES } from "./components/HangmanFigure";
import Keyboard from "./components/Keyboard";

const MATCH_TARGET = 2;

const Hangman = () => {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [dataSource, setDataSource] = useState(null);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [matchWinner, setMatchWinner] = useState(null);
  const [roundOutcome, setRoundOutcome] = useState(null);

  const [loadStatus, setLoadStatus] = useState("loading");
  const [loadError, setLoadError] = useState(null);

  const loadWord = useCallback(async () => {
    setLoadStatus("loading");
    setLoadError(null);
    try {
      const next = await fetchRandomWord();
      setWord(next.word);
      setDefinition(next.definition);
      setDataSource(next.source);
      setGuessedLetters([]);
      setWrongCount(0);
      setInputValue("");
      setRoundOutcome(null);
      setLoadStatus("ready");
    } catch (e) {
      setLoadError(e.message || "Failed to load");
      setLoadStatus("error");
    }
  }, []);

  useEffect(() => {
    loadWord();
  }, [loadWord]);

  const wordDisplay = useMemo(() => {
    if (!word) return [];
    return word.split("").map((letter) => {
      const lower = letter.toLowerCase();
      if (!/[a-z]/i.test(letter)) return letter;
      return guessedLetters.includes(lower) ? letter : "_";
    });
  }, [word, guessedLetters]);

  const isWordGuessed = useMemo(() => {
    if (!word) return false;
    return word.split("").every((ch) => {
      if (!/[a-z]/i.test(ch)) return true;
      return guessedLetters.includes(ch.toLowerCase());
    });
  }, [word, guessedLetters]);

  const hasLost = wrongCount >= MAX_STAGES;

  useEffect(() => {
    if (isWordGuessed && word && !roundOutcome && !matchWinner) {
      setRoundOutcome("win");
    }
  }, [isWordGuessed, word, roundOutcome, matchWinner]);

  useEffect(() => {
    if (hasLost && word && !roundOutcome && !matchWinner) {
      setRoundOutcome("lose");
    }
  }, [hasLost, word, roundOutcome, matchWinner]);

  const handleGuess = useCallback(
    (raw) => {
      if (!word || roundOutcome || matchWinner) return;
      const letter = String(raw).toLowerCase();
      if (!/^[a-z]$/.test(letter)) return;
      if (guessedLetters.includes(letter)) return;

      const inWord = word.toLowerCase().includes(letter);
      setGuessedLetters((prev) => [...prev, letter]);
      if (!inWord) {
        setWrongCount((n) => n + 1);
      }
      setInputValue("");
    },
    [word, guessedLetters, roundOutcome, matchWinner]
  );

  const handleChange = useCallback((event) => {
    const v = event.target.value;
    const last = v.slice(-1).toLowerCase();
    if (last === "" || /^[a-z]$/.test(last)) {
      setInputValue(last);
    }
  }, []);

  const proceedAfterRound = useCallback(async () => {
    const nextPlayer = roundOutcome === "win" ? playerScore + 1 : playerScore;
    const nextComputer = roundOutcome === "lose" ? computerScore + 1 : computerScore;

    if (roundOutcome === "win" && nextPlayer >= MATCH_TARGET) {
      setPlayerScore(nextPlayer);
      setMatchWinner("You");
      return;
    }
    if (roundOutcome === "lose" && nextComputer >= MATCH_TARGET) {
      setComputerScore(nextComputer);
      setMatchWinner("Computer");
      return;
    }

    if (roundOutcome === "win") setPlayerScore(nextPlayer);
    if (roundOutcome === "lose") setComputerScore(nextComputer);

    await loadWord();
  }, [roundOutcome, playerScore, computerScore, loadWord]);

  const restartMatch = useCallback(async () => {
    setPlayerScore(0);
    setComputerScore(0);
    setMatchWinner(null);
    setRoundOutcome(null);
    await loadWord();
  }, [loadWord]);

  const pageBg = {
    backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(15,118,110,0.35) 50%, rgba(15,23,42,0.95) 100%), url(${mathBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  if (loadStatus === "loading") {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-4 text-slate-100"
        style={pageBg}
      >
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" aria-hidden />
        <p className="text-lg text-slate-300">Loading word…</p>
      </div>
    );
  }

  if (loadStatus === "error") {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-4 text-center text-slate-100"
        style={pageBg}
      >
        <p className="max-w-md text-slate-300">{loadError}</p>
        <button
          type="button"
          onClick={() => loadWord()}
          className="rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Try again
        </button>
      </div>
    );
  }

  const roundLocked = Boolean(roundOutcome);
  const inputDisabled = roundLocked || Boolean(matchWinner);

  return (
    <div className="min-h-screen bg-slate-950 px-3 py-6 text-slate-100 sm:px-6 sm:py-10" style={pageBg}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-2xl border border-slate-700/60 bg-slate-900/85 p-4 shadow-2xl backdrop-blur-md sm:p-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Hangman</h1>
            <p className="mt-1 text-sm text-slate-400">Guess the word from the clue. First to {MATCH_TARGET} rounds wins the match.</p>
          </div>
          {dataSource && (
            <span className="w-fit rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-teal-300 ring-1 ring-teal-600/40">
              Words: {dataSource === "api" ? "API" : "offline"}
            </span>
          )}
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:items-start">
          <div className="flex flex-col gap-6">
            <section className="rounded-xl bg-slate-800/50 p-4 ring-1 ring-slate-700/80 sm:p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-400">Clue</h2>
              <p className="mt-2 text-base leading-relaxed text-slate-200 sm:text-lg">{definition}</p>
              <div className="mt-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Word</h2>
                <p
                  className="mt-2 font-mono text-2xl tracking-[0.2em] text-white sm:text-3xl"
                  aria-live="polite"
                >
                  {roundOutcome === "lose" ? (
                    <span className="text-teal-300">{word}</span>
                  ) : (
                    wordDisplay.join(" ")
                  )}
                </p>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:flex sm:flex-wrap sm:gap-6">
                <div>
                  <dt className="text-slate-500">Wrong guesses</dt>
                  <dd className="font-semibold text-amber-300">
                    {wrongCount} / {MAX_STAGES}
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-slate-500">Letters tried</dt>
                  <dd className="font-medium text-slate-300">{guessedLetters.length ? guessedLetters.join(", ") : "—"}</dd>
                </div>
              </dl>
            </section>

            <Score playerScore={playerScore} computerScore={computerScore} matchTarget={MATCH_TARGET} />

            {roundOutcome && !matchWinner && (
              <div className="flex flex-col gap-3 rounded-xl bg-slate-800/70 p-4 ring-1 ring-teal-600/30 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-slate-200">
                  {roundOutcome === "win" ? (
                    <span className="font-semibold text-teal-400">You solved it.</span>
                  ) : (
                    <span className="font-semibold text-amber-400">Out of guesses.</span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => proceedAfterRound()}
                  className="rounded-xl bg-teal-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow hover:bg-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  Next round
                </button>
              </div>
            )}

            {!roundOutcome && !matchWinner && (
              <div className="flex flex-col gap-4">
                <Input
                  handleChange={handleChange}
                  handleGuess={handleGuess}
                  inputValue={inputValue}
                  disabled={inputDisabled}
                />
                <Keyboard guessedLetters={guessedLetters} disabled={inputDisabled} onLetter={handleGuess} />
              </div>
            )}
          </div>

          <aside className="flex flex-col items-center gap-4 lg:sticky lg:top-8">
            <HangmanFigure wrongCount={wrongCount} />
            <p className="text-center text-xs text-slate-500">Classic rules: {MAX_STAGES} wrong letters and the round is over.</p>
          </aside>
        </div>
      </div>

      {matchWinner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="match-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-600 bg-slate-900 p-6 shadow-2xl">
            <h2 id="match-title" className="text-center text-2xl font-bold text-white">
              Match over
            </h2>
            <p className="mt-4 text-center text-lg text-slate-300">
              Winner:{" "}
              <span className="font-semibold text-teal-400">{matchWinner}</span>
            </p>
            <button
              type="button"
              onClick={() => restartMatch()}
              className="mt-6 w-full rounded-xl bg-teal-600 py-3 font-semibold text-white hover:bg-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              New match
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hangman;
