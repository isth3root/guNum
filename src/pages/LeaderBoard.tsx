import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../context/AuthContext";

import { useGetAllUsers } from "../hooks/useGetAllUsers";

import DifficultyDropdown from "../components/common/DifficultyDropDown";
import LeaderBoardList from "../components/LeaderBoardList";

const LeaderBoard = () => {
  const [themes] = useState<"PINK" | "DARK" | "PURPLE" | "BLUE">(
    () => {
      const storedTheme = localStorage.getItem("theme");
      return (storedTheme as "PINK" | "DARK" | "PURPLE" | "BLUE") || "DARK";
    }
  );

  const [difficulty, setDifficulty] = useState<
    "EASY" | "MEDIUM" | "HARD" | "DuelXP"
  >("DuelXP");

  const handleDifficultyChange = (
    difficulty: "EASY" | "MEDIUM" | "HARD" | "DuelXP"
  ) => {
    setDifficulty(difficulty);
  };

  const { getAllUsers, users } = useGetAllUsers();
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
        themes === "PINK" ? "bg-themePink text-black" : ""
      }
        ${themes === "DARK" ? "bg-themeDark text-white" : ""}
        ${themes === "BLUE" ? "bg-themeBlue text-white" : ""}
        ${themes === "PURPLE" ? "bg-themePurple text-white" : ""}`}
    >
      <div className="flex justify-center py-4">
        <Link to={"/"} className="underline text-3xl">
          <p className="hover:rotate-2 font-semibold animate-pulse flex justify-center">
            Let's Play
          </p>
        </Link>
      </div>
      <div className="flex justify-center items-center gap-2 mt-5">
        <h1 className="text-2xl">Sort By :</h1><DifficultyDropdown
          difficulty={difficulty}
          handleDifficultyChange={handleDifficultyChange}
        />
      </div>

      <div className="mt-10 px-1 sm:px-60">
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
