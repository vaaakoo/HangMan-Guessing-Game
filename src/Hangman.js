import React, { useEffect, useState } from "react";
import dead from "./image/dead.png";
import words from "./components/words.json";
import Score from "./components/Score";
import Input from "./components/Input";
import Images from "./components/Images";
import hangman from "./image/hangman.gif";

const Hangman = () => {
  const [wordIndex, setWordIndex] = useState(
    Math.floor(Math.random() * words.length)
  );
  const [word, setWord] = useState(words[wordIndex]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [isPlayerWinner, setIsPlayerWinner] = useState(false);
  const [winner, setWinner] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col mx-auto p-5">
        <h1 className="text-5xl text-center font-bold">Hangman Game</h1>
        <div className="mt-5 w-[300px] h-[300px] mx-auto shadow-gray-600 rounded-md shadow-md p-4">
          <img src={hangman} alt="gif" className="w-full h-full" />
        </div>
        <p className="text-4xl text-center py-8">Loading...</p>
      </div>
    );
  }

  const handleGuess = (letter) => {
    if (
      !guessedLetters.includes(letter) &&
      !word.toLowerCase().includes(letter)
    ) {
      setIncorrectGuesses(incorrectGuesses + 1);
    }
    setGuessedLetters([...guessedLetters, letter]);
    setInputValue("");
  };

  const wordDisplay = word
    .split("")
    .map((letter) =>
      guessedLetters.includes(letter.toLowerCase()) ? letter : "_"
    );

  const isWordGuessed = wordDisplay.join("") === word;
  const hasLost = incorrectGuesses >= 5;

  const reloadPage = () => {
    setIncorrectGuesses(0);
    setGuessedLetters([]);
    setInputValue("");
    if (isWordGuessed) {
      setPlayerScore(playerScore + 1);
      setWordIndex((wordIndex + 1) % words.length);
      setWord(words[wordIndex]);
    } else {
      setComputerScore(computerScore + 1);
    }

    if (playerScore >= 2) {
      setIsPlayerWinner(true);
      setWinner("You");
    } else if (computerScore >= 2) {
      setIsPlayerWinner(true);
      setWinner("Computer");
    } else {
      setIsPlayerWinner(false);
      setIncorrectGuesses(0);
      setGuessedLetters([]);
      setInputValue("");
    }
  };

  const handleChange = (event) => {
    const inputValue = event.target.value;

    if (isNaN(inputValue)) {
      setInputValue(inputValue);
    }
  };

  const restart = () => {
    window.location.reload();
  };

  return (
    <div className="h-screen max-w-full m-0 bg-slate-300 pt-3">
      <div className=" w-[85%] md:w-[650px] h-[85%] mx-auto py-4 px-8 bg-hero bg-no-repeat shadow-lg">
        <h1 className="text-3xl font-extrabold text-center mb-6 ">
          HangMan Game
        </h1>
        <div className="flex flex-col w-full gap-3">
          <div className="font-semibold text-xl text-gray-800">
            <p>
              Word:{" "}
              <span className="p-4 mx-2 italic"> {wordDisplay.join(" ")}</span>
            </p>
            <p>
              Incorrect Guesses: <span> {incorrectGuesses}</span>
            </p>
            <p>
              Guessed Letters: <span> {guessedLetters.join(", ")}</span>
            </p>
            <Score playerScore={playerScore} computerScore={computerScore} />
          </div>
          {hasLost || isWordGuessed ? (
            <>
              <button
                className="w-48 px-8 py-2 rounded-xl cursor-pointer outline-none shadow-md hover:opacity-80 bg-gray-500 text-lg font-bold text-white"
                onClick={reloadPage}
              >
                Play Again
              </button>
              <div className="mt-5 w-[300px] h-[300px] mx-auto shadow-gray-600 rounded-md shadow-md p-4">
                <img src={dead} alt="dead" />
              </div>
            </>
          ) : isPlayerWinner ? (
            <div className="bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                <div className="bg-gray-200 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex flex-col items-center gap-5">
                  <button
                    className=" w-48 px-8 py-2 rounded-xl cursor-pointer outline-none shadow-md hover:opacity-80 bg-gray-500 text-lg font-bold text-white"
                    onClick={restart}
                  >
                    Restart
                  </button>
                  <p className="text-2xl text-gray-700">
                    winner is the
                    <strong className="text-green-600 font-bold text-3xl">
                      {" "}
                      {winner}!
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Input
              handleChange={handleChange}
              handleGuess={handleGuess}
              inputValue={inputValue}
            />
          )}

          <Images incorrectGuesses={incorrectGuesses} />
        </div>
      </div>
    </div>
  );
};

export default Hangman;
