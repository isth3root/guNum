import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import useRecordDuelGuesses from "../hooks/useRecordDuelGuesses";
import GameGrid from "../components/common/GameGrid";
import { useTranslation } from 'react-i18next';
type Theme = "PINK" | "DARK" | "PURPLE" | "BLUE";

const DuelGame = () => {
  const {t} = useTranslation()
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
  const [themes] = useState<Theme>(() => {
    const storedTheme = sessionStorage.getItem("theme") as Theme;
    return ["PINK", "DARK", "PURPLE", "BLUE"].includes(storedTheme) ? storedTheme : "DARK";
  });
  const navigate = useNavigate();
  
  useEffect(() => {
  
    let range: [number, number] = [1, 50];
    switch (difficulty) {
      case "MEDIUM":
        range = [1, 100];
        break;
      case "HARD":
        range = [1, 200];
        break;
      default:
        range = [1, 50];
    }
  
    const nums = Array.from({ length: range[1] - range[0] + 1 }, (_, i) => i + range[0]);
    const indices = nums.map((_, index) => index).sort(() => Math.random() - 0.5);
    const randomCorrectNumber = nums[Math.floor(Math.random() * nums.length)];
  
    setNumbers(nums);
    setShuffledIndices(indices);
    setCorrectNumber(randomCorrectNumber);
  }, [difficulty, navigate]);
  

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
      sessionStorage.setItem(`duelGameState-${duelId}`, JSON.stringify(state));
    } else {
      sessionStorage.removeItem(`duelGameState-${duelId}`);
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
          <GameGrid
            numbers={numbers}
            shuffledIndices={shuffledIndices}
            crossedNumbers={crossedNumbers}
            correctGuess={correctNumber}
            handleClick={handleClick}
            highlightCorrectNumber={highlightCorrectNumber}
          />
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
