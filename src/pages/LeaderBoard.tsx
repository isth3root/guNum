import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../context/AuthContext";

import { useGetAllUsers } from "../hooks/useGetAllUsers";

import ThemeDropdown from "../components/common/ThemeDropDown";
import DifficultyDropdown from "../components/common/DifficultyDropDown";
import LeaderBoardList from "../components/LeaderBoardList";

const LeaderBoard = () => {
  const [themes, setThemes] = useState<"PINK" | "DARK" | "PURPLE" | "BLUE">(
    () => {
      const storedTheme = localStorage.getItem("theme");
      return (storedTheme as "PINK" | "DARK" | "PURPLE" | "BLUE") || "DARK";
    }
  );

  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD" | "DuelXP">(
    "DuelXP"
  );

  const handleThemeChange = (themes: "PINK" | "DARK" | "PURPLE" | "BLUE") => {
    setThemes(themes);
    localStorage.setItem("theme", themes);
  };

  const handleDifficultyChange = (difficulty: "EASY" | "MEDIUM" | "HARD" | "DuelXP") => {
    setDifficulty(difficulty);
  };

  const { getAllUsers, users, loading, error } = useGetAllUsers();
  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const { user } = useContext(AuthContext);

  const getScoreByDifficulty = (user: any) => {
    return difficulty === "EASY"
      ? user.score.easy
      : difficulty === "MEDIUM"
      ? user.score.medium
      : difficulty === "HARD"
      ? user.score.hard
      : user.duelXP;
  };

  const sortedUsers = users.slice().sort((a, b) => {
    const scoreA = getScoreByDifficulty(a);
    const scoreB = getScoreByDifficulty(b);

    if (difficulty === "DuelXP") {
      return (b.duelXP || 0) - (a.duelXP || 0);
    } else {
      return (scoreA || 0) - (scoreB || 0);
    }
  });

  return (
    <div
      className={`min-h-screen font-Teko flex flex-col ${
        themes === "PINK" ? "bg-[#FFEFEF] text-black" : ""
      }
        ${themes === "DARK" ? "bg-[#0C0C0C] text-white" : ""}
        ${themes === "BLUE" ? "bg-[#4C3BCF] text-white" : ""}
        ${themes === "PURPLE" ? "bg-[#4A249D] text-white" : ""}`}
    >
      <div className="sticky top-0 w-full flex flex-row-reverse justify-around gap-10 py-4 z-30">
        <ThemeDropdown themes={themes} handleThemeChange={handleThemeChange} />
        <DifficultyDropdown
          difficulty={difficulty}
          handleDifficultyChange={handleDifficultyChange}
        />
      </div>
      <Link to={"/"} className="underline text-3xl">
        <p className="hover:rotate-2 font-semibold animate-pulse flex justify-center">
          Let's Play
        </p>
      </Link>
      <div className="mt-10">
        {loading && <p>Loading users...</p>}
        {error && <p>Error: {error}</p>}
        <LeaderBoardList
          users={sortedUsers}
          themes={themes}
          difficulty={difficulty}
          currentUser={user}
          getScoreByDifficulty={getScoreByDifficulty}
        />
      </div>
    </div>
  );
};

export default LeaderBoard;
