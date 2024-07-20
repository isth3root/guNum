import { Dropdown, MenuProps } from "antd";
import { useContext, useEffect, useState } from "react";
import { useGetAllUsers } from "../hooks/useGetAllUsers";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const LeaderBoard = () => {
  const [themes, setThemes] = useState<"PINK" | "DARK" | "PURPLE" | "BLUE">(
    () => {
      const storedTheme = localStorage.getItem("theme");
      return (storedTheme as "PINK" | "DARK" | "PURPLE" | "BLUE") || "DARK";
    }
  );

  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(
    "EASY"
  );

  const handleThemeChange = (themes: "PINK" | "DARK" | "PURPLE" | "BLUE") => {
    setThemes(themes);
    localStorage.setItem("theme", themes);
  };

  const { getAllUsers, users, loading, error } = useGetAllUsers();
  useEffect(() => {
    getAllUsers();
  }, []);

  const { user } = useContext(AuthContext);

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

  const handleDifficultyChange = (difficulty: "EASY" | "MEDIUM" | "HARD") => {
    setDifficulty(difficulty);
  };

  const getScoreByDifficulty = (user: any) => {
    return difficulty === "EASY"
      ? user.score.easy
      : difficulty === "MEDIUM"
      ? user.score.medium
      : user.score.hard;
  };

  const sortedUsers = users.sort(
    (a, b) => getScoreByDifficulty(a) - getScoreByDifficulty(b)
  );

  return (
    <div
      className={`min-h-screen font-Teko flex flex-col ${
        themes === "PINK" ? "bg-[#FFEFEF] text-black" : ""
      } 
        ${themes === "DARK" ? "bg-[#1A3636] text-white" : ""} 
        ${themes === "BLUE" ? "bg-[#7C73C0] text-white" : ""} 
        ${themes === "PURPLE" ? "bg-[#4A249D] text-white" : ""}`}
    >
      <div className="sticky top-0 w-full flex justify-center gap-10 py-4 z-30">
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
      <Link to={"/"} className="text-center underline text-4xl">
        Let's Play
      </Link>
      <div className="">
        <div className="mt-10">
          {loading && <p>Loading users...</p>}
          {error && <p>Error: {error}</p>}

          <ul className="flex flex-col">
            {sortedUsers.map((userItem, index) => (
              <li
                key={userItem.username}
                className={`text-3xl border-b-2 py-2 flex gap-5 w-full justify-around ${
                  user?.username === userItem.username ? "text-red-500" : ""
                }
              ${themes === "PINK" ? "border-black" : ""} 
              ${themes === "DARK" ? "" : ""} 
              ${themes === "BLUE" ? "" : ""} 
              ${themes === "PURPLE" ? "" : ""}
              `}
              >
                <div className="w-1/4">{index + 1}</div>
                <div className="w-2/4 self-start">{userItem.username}</div>
                <div className="">{getScoreByDifficulty(userItem)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
