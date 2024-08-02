// ========== PACKAGES ========== \\
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// ========== TYPES & UTILS ========== \\
import { User } from "../types";
import { LeaderBoardListProps } from "../types";


const LeaderBoardList: React.FC<LeaderBoardListProps> = ({
  users,
  themes,
  currentUser,
  difficulty,
  getScoreByDifficulty,
}) => {

  const getRankings = (users: User[]): { rank: number; user: User }[] => {
    const sortedUsers = [...users].sort((a, b) => {
      const scoreA = getScoreByDifficulty(a, difficulty);
      const scoreB = getScoreByDifficulty(b, difficulty);

      return difficulty === "DuelXP" ? scoreB - scoreA : scoreA - scoreB;
    });

    let rankings: { rank: number; user: User }[] = [];
    let rank = 1;
    let lastScore = -1;

    for (let i = 0; i < sortedUsers.length; i++) {
      const score = getScoreByDifficulty(sortedUsers[i], difficulty);

      if (score !== lastScore) {
        rank = i + 1;
      }

      rankings.push({ rank, user: sortedUsers[i] });
      lastScore = score;
    }

    return rankings;
  };

  const rankedUsers = getRankings(users);

  const handleUsernameClick = (username: string) => {
    navigator.clipboard.writeText(username).then(
      () => {
        toast.success(`${username} copied to clipboard!`, {
          position: "bottom-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  return (
    <div>
      <div className="flex justify-between text-xl px-1 mb-2 select-none">
        <h1>Rank</h1>
        <h1>Username</h1>
        <h1>Score</h1>
      </div>
      <ul className="flex flex-col select-none">
        {rankedUsers.map(({ rank, user }) => (
          <li
            key={user._id}
            className={`text-3xl border-b-2 py-2 flex gap-5 w-full justify-between px-2 ${
              currentUser?.username === user.username ? "text-red-500" : ""
            }
            ${themes === "PINK" ? "border-black" : ""}
            ${themes === "DARK" ? "" : ""}
            ${themes === "BLUE" ? "" : ""}
            ${themes === "PURPLE" ? "" : ""}
            `}
          >
            <div className="w-1/4">{rank}</div>
            <div className="w-2/4 text-center cursor-pointer" onClick={() => handleUsernameClick(user.username)}>
              {user.username}
            </div>
            <div className="w-1/4 text-right">
              {getScoreByDifficulty(user, difficulty)}
            </div>
          </li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default LeaderBoardList;
