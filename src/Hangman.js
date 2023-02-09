import React, { useState } from "react";
import "./styles.css";
import words from "./components/words.json";

const Hangman = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [word, setWord] = useState(words[wordIndex]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [isPlayerWinner, setIsPlayerWinner] = useState(false);
  const [winner, setWinner] = useState("");

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

  const playAgain = () => {
    window.location.reload();
  };
  return (
    <div className="container">
      <p>Word: {wordDisplay.join(" ")}</p>
      <p>Incorrect Guesses: {incorrectGuesses}</p>
      <p>Guessed Letters: {guessedLetters.join(", ")}</p>
      <p>Player Score: {playerScore}</p>
      <p>Computer Score: {computerScore}</p>

      {hasLost || isWordGuessed ? (
        <button onClick={reloadPage}>Play Again</button>
      ) : isPlayerWinner ? (
        <div>
          <button onClick={playAgain}>Restart</button>
          <p>
            <strong>{winner}</strong> is the winner!
          </p>
        </div>
      ) : (
        <input
          type="text"
          value={inputValue}
          maxLength={1}
          onChange={handleChange}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleGuess(inputValue.toLowerCase());
            }
          }}
        />
      )}
    </div>
  );
};

export default Hangman;
