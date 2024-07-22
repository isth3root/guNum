import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { theme, Modal, Button } from "antd";

import AuthContext from "../context/AuthContext";

import { useSaveScore } from "../hooks/useSaveScore";
import { useDeleteAccount } from "../hooks/useDeleteAccount";

import ThemeDropdown from "../components/common/ThemeDropDown";
import UserDropdown from "../components/common/UserDropDown";
import GameGrid from "../components/common/GameGrid";
import GameControls from "../components/common/GameControls";
import ContextMenu from "../components/common/ContextMenu";

const Game = () => {
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

  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(
    "EASY"
  );
  const [isDifficultyModalVisible, setIsDifficultyModalVisible] =
    useState<boolean>(false);

  const [crossedNumbers, setCrossedNumbers] = useState<number[]>([]);
  const [guessCount, setGuessCount] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [toGuessNumber, setToGuessNumber] = useState<number>(1);
  const [correctGuess, setCorrectGuess] = useState<number | null>(null);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [highlightCorrectNumber, setHighlightCorrectNumber] = useState(false); // New state

  const { user, setUser } = useContext(AuthContext);
  const { saveScore } = useSaveScore();
  const { deleteAccount } = useDeleteAccount();

  const shuffleArray = (array: number[]): number[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    let maxNumber;
    switch (difficulty) {
      case "EASY":
        maxNumber = 50;
        break;
      case "MEDIUM":
        maxNumber = 100;
        break;
      case "HARD":
        maxNumber = 200;
        break;
      default:
        maxNumber = 50;
    }
    const newNumbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
    setNumbers(newNumbers);
    setShuffledIndices(
      shuffleArray(Array.from({ length: maxNumber }, (_, i) => i))
    );
    setToGuessNumber(Math.floor(Math.random() * maxNumber) + 1);
  }, [difficulty]);

  const handleClick = async (i: number) => {
    if (gameOver) return;

    const clickedNumber: number = i + 1;
    if (crossedNumbers.includes(clickedNumber)) return;

    setGuessCount((guessCount) => guessCount + 1);

    if (clickedNumber === toGuessNumber) {
      setCrossedNumbers(numbers.filter((num) => num !== clickedNumber));
      setGameOver(true);
      setCorrectGuess(clickedNumber);
      setHighlightCorrectNumber(true); // Set this state to true
      await sc();
    } else {
      let newCrossedNumbers;
      if (clickedNumber < toGuessNumber) {
        newCrossedNumbers = numbers.filter((num) => num <= clickedNumber);
      } else {
        newCrossedNumbers = numbers.filter((num) => num >= clickedNumber);
      }

      setCrossedNumbers((prevCrossedNumbers) => [
        ...new Set([...prevCrossedNumbers, ...newCrossedNumbers]),
      ]);
    }
  };

  const sc = async () => {
    try {
      if (user?.username) {
        await saveScore(user.username, guessCount + 1, difficulty);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleNewGame = (): void => {
    setIsDifficultyModalVisible(true);
  };

  const handleDifficultyChange = (difficulty: "EASY" | "MEDIUM" | "HARD") => {
    setDifficulty(difficulty);
    setCrossedNumbers([]);
    setGuessCount(0);
    setGameOver(false);
    setToGuessNumber(Math.floor(Math.random() * numbers.length) + 1);
    setCorrectGuess(null);
    setHighlightCorrectNumber(false); // Reset this state
    setShuffledIndices(
      shuffleArray(Array.from({ length: numbers.length }, (_, i) => i))
    );
    setIsDifficultyModalVisible(false);
  };

  const handleThemeChange = (theme: "PINK" | "DARK" | "PURPLE" | "BLUE") => {
    setThemes(theme);
    localStorage.setItem("theme", theme);
  };

  const handleLogOut = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const handleDeleteAccount = async () => {
    handleLogOut();
    if (user?.username) {
      try {
        await deleteAccount(user.username);
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    } else {
      console.warn("Username is undefined, cannot delete account.");
    }
  };

  const {
    token: { colorBgLayout, colorTextTertiary },
  } = theme.useToken();

  return (
    <ContextMenu handleDifficultyChange={handleDifficultyChange}>
      <div
        style={{
          color: colorTextTertiary,
          background: colorBgLayout,
          minHeight: "100vh",
        }}
      >
        <div
          className={`flex flex-col justify-around min-h-screen
            font-Teko items-center gap-5 transition-all duration-500 ease-in-out
            ${themes === "PINK" ? "bg-[#FFEFEF] text-black" : ""}
            ${themes === "DARK" ? "bg-[#0C0C0C] text-white" : ""}
            ${themes === "BLUE" ? "bg-[#4C3BCF] text-white" : ""}
            ${themes === "PURPLE" ? "bg-[#4A249D] text-white" : ""}
          `}
        >
          <div className="flex flex-col items-center gap-5">
            <div className="flex flex-row-reverse justify-between items-center gap-20 w-full mt-5">
              <ThemeDropdown
                themes={themes}
                handleThemeChange={handleThemeChange}
              />
              <UserDropdown
                user={user}
                handleLogOut={handleLogOut}
                handleDeleteAccount={handleDeleteAccount}
              />
            </div>
            <div className="w-full flex justify-between">
              <Link to={"/leaderboard"} className="text-xl underline mb-10">
                <p className="text-center animate-pulse font-semibold">
                  Leader Board
                </p>
              </Link>
              <Link to={"/duel"} className="text-xl underline mb-10">
                <p className="text-center animate-pulse font-semibold">
                  Duel
                </p>
              </Link>
            </div>
          </div>

          <div className="text-3xl select-none">
            Find the special{" "}
            <span className="italic tracking-wider uppercase font-bold text-red-500">
              number
            </span>
          </div>

          <GameGrid
            numbers={numbers}
            shuffledIndices={shuffledIndices}
            crossedNumbers={crossedNumbers}
            correctGuess={correctGuess}
            handleClick={handleClick}
            highlightCorrectNumber={highlightCorrectNumber} // Pass this state to GameGrid
          />

          <GameControls
            themes={themes}
            gameOver={gameOver}
            guessCount={guessCount}
            handleNewGame={handleNewGame}
          />
        </div>

        <Modal
          title="Select Difficulty"
          open={isDifficultyModalVisible}
          footer={null}
          closable={false}
        >
          <div className="flex flex-col items-center gap-4">
            <Button onClick={() => handleDifficultyChange("EASY")}>Easy</Button>
            <Button onClick={() => handleDifficultyChange("MEDIUM")}>
              Medium
            </Button>
            <Button onClick={() => handleDifficultyChange("HARD")}>Hard</Button>
          </div>
        </Modal>
      </div>
    </ContextMenu>
  );
};

export default Game;
