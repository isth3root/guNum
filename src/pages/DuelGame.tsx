// ========== PACKAGES ========== \\
import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ========== TYPES & UTILS ========== \\
import { Theme } from "../types";

// ========== COMPONENTS ========== \\
import GameGrid from "../components/common/GameGrid";

// ========== HOOKS ========== \\
import useRecordDuelGuesses from "../hooks/useRecordDuelGuesses";

// ========== CONTEXTES ========== \\
import AuthContext from "../context/AuthContext";

const DuelGame = () => {
  const { t } = useTranslation();
  const { duelId } = useParams();
  const location = useLocation();
  const { difficulty } = location.state as { difficulty: "EASY" | "MEDIUM" | "HARD" };
  const { recordDuelGuesses } = useRecordDuelGuesses();
  const [numbers, setNumbers] = useState<number[]>([]);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [crossedNumbers, setCrossedNumbers] = useState<number[]>([]);
  const [correctNumber, setCorrectNumber] = useState<number | null>(null);
  const [guessCount, setGuessCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highlightCorrectNumber, setHighlightCorrectNumber] = useState(false);
  const { user } = useContext(AuthContext);
  const [themes] = useState<Theme>(() => {
    const storedTheme = sessionStorage.getItem("theme") as Theme;
    return ["PINK", "DARK", "PURPLE", "BLUE"].includes(storedTheme) ? storedTheme : "DARK";
  });
  const navigate = useNavigate();

  // Load game state from session storage or initialize new game
  useEffect(() => {
    if (!duelId) return;

    const savedState = sessionStorage.getItem(`duelGameState-${duelId}`);
    console.log("Loaded State from Session Storage:", savedState); // Debugging

    if (savedState) {
      const state = JSON.parse(savedState);
      if (state.gameOver) {
        sessionStorage.setItem(`gameCompleted-${duelId}`, "true");
        navigate("/duel");
        return;
      }
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
      const nums = Array.from({ length: range[1] - range[0] + 1 }, (_, i) => i + range[0]);
      const indices = nums.map((_, index) => index).sort(() => Math.random() - 0.5);
      const randomCorrectNumber = nums[Math.floor(Math.random() * nums.length)];
      setNumbers(nums);
      setShuffledIndices(indices);
      setCorrectNumber(randomCorrectNumber);
    }
  }, [difficulty, duelId, navigate]);

  // Save game state to session storage
  useEffect(() => {
    if (!duelId) return;

    const state = {
      numbers,
      shuffledIndices,
      crossedNumbers,
      correctNumber,
      guessCount,
      gameOver,
      highlightCorrectNumber,
    };

    if (gameOver) {
      sessionStorage.removeItem(`duelGameState-${duelId}`);
      sessionStorage.setItem(`gameCompleted-${duelId}`, "true");
    } else {
      console.log("Saving State to Session Storage:", state); // Debugging
      sessionStorage.setItem(`duelGameState-${duelId}`, JSON.stringify(state));
    }
  }, [numbers, shuffledIndices, crossedNumbers, correctNumber, guessCount, gameOver, highlightCorrectNumber, duelId]);

  const handleClick = async (index: number) => {
    if (gameOver) return;

    const clickedNumber = numbers[index];
    if (correctNumber === null || duelId === undefined) return;
    if (crossedNumbers.includes(clickedNumber)) return;

    if (clickedNumber === correctNumber) {
      if (user) {
        await recordDuelGuesses(duelId, user.username, guessCount + 1);
      } else {
        console.error("User is not logged in or context is missing.");
      }
      setHighlightCorrectNumber(true);
      setGameOver(true);
      sessionStorage.setItem(`gameCompleted-${duelId}`, "true");
      navigate("/duel");
    } else {
      const updatedCrossedNumbers = clickedNumber > correctNumber
        ? [...crossedNumbers, ...numbers.filter((n) => n >= clickedNumber)]
        : [...crossedNumbers, ...numbers.filter((n) => n <= clickedNumber)];
      setCrossedNumbers(updatedCrossedNumbers);
      setGuessCount(guessCount + 1);
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen items-center justify-around py-5 px-5 font-Teko
        ${themes === "PINK" ? "bg-themePink text-black" : ""}
        ${themes === "DARK" ? "bg-themeDark text-white" : ""}
        ${themes === "BLUE" ? "bg-themeBlue text-white" : ""}
        ${themes === "PURPLE" ? "bg-themePurple text-white" : ""}
      `}
    >
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
      <div
        className={`text-4xl sticky bottom-0 w-full left-0 z-20 text-center py-5
              ${themes === "PINK" ? "bg-themePink text-black" : ""}
              ${themes === "DARK" ? "bg-themeDark text-white" : ""}
              ${themes === "BLUE" ? "bg-themeBlue text-white" : ""}
              ${themes === "PURPLE" ? "bg-themePurple text-white" : ""}
            `}
      >
        {t('guessCount')} : {guessCount}
      </div>
    </div>
  );
};

export default DuelGame;
