import { message } from "antd";
import React from "react";

interface LeaderBoardListProps {
  users: any[];
  themes: "PINK" | "DARK" | "PURPLE" | "BLUE";
  difficulty: "EASY" | "MEDIUM" | "HARD" | "DuelXP";
  currentUser: any;
  getScoreByDifficulty: (user: any) => number;
}

const LeaderBoardList: React.FC<LeaderBoardListProps> = ({
  users,
  themes,
  currentUser,
  getScoreByDifficulty,
}) => {
  const getRankings = (users: any[]) => {
    let rankings = [];
    let rank = 1;

    for (let i = 0; i < users.length; i++) {
      if (
        i > 0 &&
        getScoreByDifficulty(users[i]) < getScoreByDifficulty(users[i - 1])
      ) {
        rank = i + 1;
      }
      rankings.push({ ...users[i], rank });
    }

    return rankings;
  };

  const rankedUsers = getRankings(users);

  const handleUsernameClick = (username: string) => {
    navigator.clipboard.writeText(username).then(
      () => {
        message.success(`${username} copied to clipboard!`);
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  return (
    <div>
      <div className="flex justify-between text-xl px-1 mb-2">
        <h1>Rank</h1>
        <h1>Username</h1>
        <h1>Score</h1>
      </div>
      <ul className="flex flex-col">
        {rankedUsers.map((userItem) => (
          <li
            key={userItem.username}
            className={`text-3xl border-b-2 py-2 flex gap-5 w-full justify-between px-2 ${
              currentUser?.username === userItem.username ? "text-red-500" : ""
            }
            ${themes === "PINK" ? "border-black" : ""}
            ${themes === "DARK" ? "" : ""}
            ${themes === "BLUE" ? "" : ""}
            ${themes === "PURPLE" ? "" : ""}
            `}
          >
            <div className="w-1/4">{userItem.rank}</div>
            <div className="w-2/4 text-center cursor-pointer" onClick={()=>handleUsernameClick(userItem.username)}>{userItem.username}</div>
            <div className="w-1/4 text-right">
              {getScoreByDifficulty(userItem)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderBoardList;
