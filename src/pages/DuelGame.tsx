import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

import AuthContext from "../context/AuthContext";

import useRecordDuelGuesses from "../hooks/useRecordDuelGuesses";

import GameGrid from "../components/common/GameGrid";
import ThemeDropdown from "../components/common/ThemeDropDown";

const DuelGame = () => {
  const { duelId } = useParams();
  const location = useLocation();
  const { difficulty } = location.state;
  const { recordDuelGuesses } = useRecordDuelGuesses();
  const [numbers, setNumbers] = useState<number[]>([]);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [crossedNumbers, setCrossedNumbers] = useState<number[]>([]);
  const [correctNumber, setCorrectNumber] = useState<number | null>(null);
  const [guessCount, setGuessCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highlightCorrectNumber, setHighlightCorrectNumber] = useState(false);
  const { user } = useContext(AuthContext);
  const [themes, setThemes] = useState<"PINK" | "DARK" | "PURPLE" | "BLUE">(
    () => {
      const storedTheme = localStorage.getItem("theme");
      if (
        storedTheme === "PINK" ||
        storedTheme === "DARK" ||
        storedTheme === "PURPLE" ||
        storedTheme === "BLUE"
      ) {
        return storedTheme;
      }
      return "DARK";
    }
  );

  useEffect(() => {
    const savedState = localStorage.getItem(`duelGameState-${duelId}`);
    if (savedState) {
      const state = JSON.parse(savedState);
      setNumbers(state.numbers);
      setShuffledIndices(state.shuffledIndices);
      setCrossedNumbers(state.crossedNumbers);
      setCorrectNumber(state.correctNumber);
      setGuessCount(state.guessCount);
      setGameOver(state.gameOver);
      setHighlightCorrectNumber(state.highlightCorrectNumber);
    } else {
      let range: [number, number] = [1, 50];
      switch (difficulty) {
        case "MEDIUM":
          range = [1, 100];
          break;
        case "HARD":
          range = [1, 200];
          break;
      }

      const nums = Array.from(
        { length: range[1] - range[0] + 1 },
        (_, i) => i + range[0]
      );
      const indices = nums
        .map((_, index) => index)
        .sort(() => Math.random() - 0.5);

      const randomCorrectNumber = nums[Math.floor(Math.random() * nums.length)];

      setNumbers(nums);
      setShuffledIndices(indices);
      setCorrectNumber(randomCorrectNumber);
    }
  }, [difficulty, duelId]);

  useEffect(() => {
    if (!gameOver) {
      const state = {
        numbers,
        shuffledIndices,
        crossedNumbers,
        correctNumber,
        guessCount,
        gameOver,
        highlightCorrectNumber,
      };
      localStorage.setItem(`duelGameState-${duelId}`, JSON.stringify(state));
    }
  }, [
    numbers,
    shuffledIndices,
    crossedNumbers,
    correctNumber,
    guessCount,
    gameOver,
    highlightCorrectNumber,
    duelId,
  ]);

  useEffect(() => {
    if (gameOver) {
      localStorage.removeItem(`duelGameState-${duelId}`);
    }
  }, [gameOver, duelId]);

  const handleClick = async (index: number) => {
    if (gameOver) return;

    const clickedNumber = numbers[index];
    if (correctNumber === null || duelId === undefined) return;

    if (clickedNumber === correctNumber) {
      if (user) {
        await recordDuelGuesses(duelId, user.username, guessCount + 1);
      } else {
        console.error("User is not logged in or context is missing.");
      }
      setHighlightCorrectNumber(true);
      setGameOver(true);
    } else {
      if (clickedNumber > correctNumber) {
        setCrossedNumbers([
          ...crossedNumbers,
          ...numbers.filter((n) => n >= clickedNumber),
        ]);
      } else {
        setCrossedNumbers([
          ...crossedNumbers,
          ...numbers.filter((n) => n <= clickedNumber),
        ]);
      }
      setGuessCount(guessCount + 1);
    }
  };

  const handleThemeChange = (theme: "PINK" | "DARK" | "PURPLE" | "BLUE") => {
    setThemes(theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <div
      className={`flex flex-col min-h-screen items-center py-5 px-5 font-Teko
        ${themes === "PINK" ? "bg-[#FFEFEF] text-black" : ""}
        ${themes === "DARK" ? "bg-[#0C0C0C] text-white" : ""}
        ${themes === "BLUE" ? "bg-[#4C3BCF] text-white" : ""}
        ${themes === "PURPLE" ? "bg-[#4A249D] text-white" : ""}
    `}
    >
      <div className="mb-10">
        <ThemeDropdown themes={themes} handleThemeChange={handleThemeChange} />
      </div>
      {!gameOver && (
        <div>
          <GameGrid
            numbers={numbers}
            shuffledIndices={shuffledIndices}
            crossedNumbers={crossedNumbers}
            correctGuess={correctNumber}
            handleClick={handleClick}
            highlightCorrectNumber={highlightCorrectNumber}
          />
        </div>
      )}
      {gameOver && (
        <div className="flex flex-col justify-center gap-5 items-center min-h-screen">
          <h1 className="text-2xl font-bold">
            Game Over! Your guesses: {guessCount + 1}
          </h1>
          <Link to={"/duel"} className="text-3xl">
            Go Back
          </Link>
        </div>
      )}
    </div>
  );
};

export default DuelGame;
