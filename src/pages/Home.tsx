import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AiOutlineArrowUp } from "react-icons/ai"; // Add this import for the arrow icon
import { FiMoon, FiUser } from "react-icons/fi";
import { LuSword, LuSwords } from "react-icons/lu";
import { MdOutlineLeaderboard } from "react-icons/md";
import AppContext from "../context/AuthContext";
import useDuelRequests from "../hooks/useDuelRequests";
import useActiveDuels from "../hooks/useActiveDuels";

import { Popover, Badge } from "antd";

const Home = () => {
  const [themes, setThemes] = useState<"PINK" | "DARK" | "PURPLE" | "BLUE">(
    () => {
      const storedTheme = localStorage.getItem("theme");
      return (storedTheme as "PINK" | "DARK" | "PURPLE" | "BLUE") || "DARK";
    }
  );
  const { user } = useContext(AppContext);
  const { requests } = useDuelRequests(user!.username);
  const { duels } = useActiveDuels(user!.username);
  const [requestsCount, setRequestsCount] = useState<number>(0);
  const [duelsCount, setDuelsCount] = useState<number>(0);

  useEffect(() => {
    if (requests) {
      setRequestsCount(requests.length);
    }
    if (duels) {
      setDuelsCount(duels.length)
    }
  });

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const themeContect = (
    <div className="flex flex-col items-center font-Teko text-2xl px-5">
      <button onClick={() => handleThemeChange("PINK")}>PINK</button>
      <button onClick={() => handleThemeChange("DARK")}>DARK</button>
      <button onClick={() => handleThemeChange("BLUE")}>BLUE</button>
      <button onClick={() => handleThemeChange("PURPLE")}>PURPLE</button>
    </div>
  );
  const handleThemeChange = (theme: "PINK" | "DARK" | "PURPLE" | "BLUE") => {
    setThemes(theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <div
      className={`relative flex flex-col min-h-screen font-Teko
    ${themes === "PINK" ? "bg-themePink text-black" : ""}
    ${themes === "DARK" ? "bg-themeDark text-white" : ""}
    ${themes === "BLUE" ? "bg-themeBlue text-white" : ""}
    ${themes === "PURPLE" ? "bg-themePurple text-white" : ""}
    `}
    >
      <div className="flex justify-between items-center flex-grow">
        <Link
          to="/single"
          className={`text-3xl sm:text-4xl border-r gap-2  min-h-screen flex justify-center font-semibold flex-1 items-center transition-all duration-300
            ${themes === "DARK" ? "" : "border-black"}
            `}
        >
          Single Play
          <LuSword />
        </Link>
        <Link
          to="/duel"
          className="flex items-center gap-2 text-3xl sm:text-4xl justify-center flex-1 min-h-screen font-semibold transition-all duration-300"
        >
          <div className="relative">
            <Badge
              className="absolute -top-4 -right-4 animate-bounce"
              count={duelsCount}
              showZero
              color="green"
            ></Badge>
            <Badge
              className="absolute -top-4 right-0 animate-bounce"
              count={requestsCount}
              showZero
              color="blue"
            ></Badge>
            <div className="flex gap-2">
              Duels
              <LuSwords />
            </div>
          </div>
        </Link>
      </div>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <button
          onClick={toggleMenu}
          className="bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none"
        >
          <AiOutlineArrowUp size={24} />
        </button>
      </div>

      {menuVisible && (
        <div className="fixed flex bottom-16 left-1/2 text-black transform duration-100 transition-all -translate-x-1/2 bg-white justify-center shadow-lg rounded-lg w-32 px-20 py-1">
          <Link
            to="/profile"
            className="block px-4 py-2 rounded-full text-2xl"
          >
            <FiUser />
          </Link>
          <div className="block px-4 py-2 rounded-full text-2xl">
            <Popover placement="top" content={themeContect}>
              <FiMoon />
            </Popover>
          </div>
          <Link
            to="/leaderboard"
            className="block px-4 py-2 rounded-full text-2xl"
          >
            <MdOutlineLeaderboard />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
