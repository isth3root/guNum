// ========== React Imports ========== \\
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

// ========== ANT DESIGN imports ========== \\
import type { MenuProps } from "antd";
import { Dropdown, theme } from "antd";

import AuthContext from "../context/AuthContext";

// ========== HOOKS ========== \\
import { useSaveScore } from "../hooks/useSaveScore";
import { useDeleteAccount } from "../hooks/useDeleteAccount";

const Game = () => {
  const [themes, setThemes] = useState<"PINK" | "DARK" | "PURPLE" | "BLUE">(
    () => {
      // Get theme from localStorage, fallback to "DARK" if not found or invalid
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

  // Wrong Numbers
  const [crossedNumbers, setCrossedNumbers] = useState<number[]>([]);

  const [guessCount, setGuessCount] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [toGuessNumber, setToGuessNumber] = useState<number>(1);
  const [correctGuess, setCorrectGuess] = useState<number | null>(null);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

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
      // User clicks on correct Number
      setCrossedNumbers(numbers.filter((num) => num !== clickedNumber));
      setGameOver(true);
      setCorrectGuess(clickedNumber);
      await sc();
    } else {
      // User clicks on wrong Number
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
    setCrossedNumbers([]);
    setGuessCount(0);
    setGameOver(false);
    setToGuessNumber(Math.floor(Math.random() * numbers.length) + 1);
    setCorrectGuess(null);
    setShuffledIndices(
      shuffleArray(Array.from({ length: numbers.length }, (_, i) => i))
    );
  };

  const handleThemeChange = (themes: "PINK" | "DARK" | "PURPLE" | "BLUE") => {
    setThemes(themes);

    // Put theme on localstorage
    localStorage.setItem("theme", themes);
  };

  const handleDifficultyChange = (difficulty: "EASY" | "MEDIUM" | "HARD") => {
    setDifficulty(difficulty);
    handleNewGame();
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

  const themeItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div
          className="font-Teko text-xl select-none"
          onClick={() => handleThemeChange("PINK")}
        >
          PINK
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          className="font-Teko text-xl select-none"
          onClick={() => handleThemeChange("DARK")}
        >
          DARK
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div
          className="font-Teko text-xl select-none"
          onClick={() => handleThemeChange("BLUE")}
        >
          BLUE
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <div
          className="font-Teko text-xl select-none"
          onClick={() => handleThemeChange("PURPLE")}
        >
          PURPLE
        </div>
      ),
    },
  ];

  const difficultyItems: MenuProps["items"] = [
    {
      key: "1",
      label: <div onClick={() => handleDifficultyChange("EASY")}>EASY</div>,
    },
    {
      key: "2",
      label: <div onClick={() => handleDifficultyChange("MEDIUM")}>MEDIUM</div>,
    },
    {
      key: "3",
      label: <div onClick={() => handleDifficultyChange("HARD")}>HARD</div>,
    },
  ];

  const contextItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div onClick={() => handleDifficultyChange("EASY")}>New Game: EASY</div>
      ),
    },
    {
      key: "2",
      label: (
        <div onClick={() => handleDifficultyChange("MEDIUM")}>
          New Game: MEDIUM
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div onClick={() => handleDifficultyChange("HARD")}>New Game: HARD</div>
      ),
    },
  ];

  const userItem: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="font-Teko text-xl" onClick={handleLogOut}>
          LOGOUT
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="font-Teko text-xl" onClick={handleDeleteAccount}>
          DELETE ACCOUNT
        </div>
      ),
      danger: true,
    },
  ];

  const {
    token: { colorBgLayout, colorTextTertiary },
  } = theme.useToken();

  return (
    <Dropdown menu={{ items: contextItems }} trigger={["contextMenu"]}>
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
            <div className="flex flex-row-reverse justify-between items-center gap-20 w-full">
              <Dropdown
                menu={{ items: themeItems }}
                trigger={["click"]}
                className="hover:rotate-6"
              >
                <a
                  onClick={(e) => e.preventDefault()}
                  className="text-3xl cursor-pointer select-none"
                >
                  {themes}
                </a>
              </Dropdown>
              <Dropdown
                menu={{ items: userItem }}
                trigger={["click"]}
                className="hover:-translate-y-1"
              >
                <a
                  onClick={(e) => e.preventDefault()}
                  className="text-3xl cursor-pointer select-none"
                >
                  {user?.username}
                </a>
              </Dropdown>
              <Dropdown
                menu={{ items: difficultyItems }}
                trigger={["click"]}
                className="hover:-rotate-6"
              >
                <a
                  onClick={(e) => e.preventDefault()}
                  className="text-3xl cursor-pointer select-none"
                >
                  {difficulty}
                </a>
              </Dropdown>
            </div>
            <Link to={"/leaderboard"} className="text-xl underline mb-10">
              <p className="text-center animate-pulse font-semibold">Leader Board</p>
            </Link>
          </div>

          <div className="text-3xl select-none">
            Find the special{" "}
            <span className="italic tracking-wider uppercase font-bold text-red-500">
              number
            </span>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-5 text-4xl sm:text-5xl select-none mb-10">
            {shuffledIndices.map((index) => (
              <div key={index}>
                <p
                  className={`cursor-pointer hover:rotate-12 ${
                    crossedNumbers.includes(numbers[index])
                      ? "line-through opacity-5 transition-all duration-1000 ease-in-out"
                      : ""
                  } ${
                    correctGuess === numbers[index]
                      ? "text-red-500 font-extrabold"
                      : ""
                  }`}
                  onClick={() => handleClick(index)}
                >
                  {numbers[index]}
                </p>
              </div>
            ))}
          </div>
          {gameOver && (
            <div className="flex flex-col gap-4 items-center">
              <h1 className="select-none text-3xl">{`You guessed the number with ${guessCount} ${
                guessCount <= 1 ? "guess" : "guesses"
              }`}</h1>
            </div>
          )}
          <button
            className={`select-none mb-10 text-2xl hover:shadow-lg rounded-md py-2 px-5 hover:rotate-6
            ${themes === "PINK" ? "bg-black text-white" : ""} 
            ${themes === "DARK" ? "bg-white text-black" : ""} 
            ${themes === "BLUE" ? "bg-white text-black" : ""} 
            ${themes === "PURPLE" ? "bg-white text-black" : ""} 
            `}
            onClick={handleNewGame}
          >
            New Game
          </button>
        </div>
      </div>
    </Dropdown>
  );
};

export default Game;
