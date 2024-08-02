// ========== PACKAGES ========== \\
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { LuSword, LuSwords } from "react-icons/lu";
import { Badge } from "antd";

// ========== TYPES & UTILS ========== \\
import i18n from "../utils/i18n";

// ========== CONTEXTES ========== \\
import AppContext from "../context/AuthContext";

// ========== HOOKS ========== \\
import useDuelRequests from "../hooks/useDuelRequests";
import useActiveDuels from "../hooks/useActiveDuels";


const Home = () => {
  const { t } = useTranslation();
  const [themes] = useState<"PINK" | "DARK" | "PURPLE" | "BLUE">(
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

  return (
    <div
      className={`relative flex flex-col h-screen ${i18n.language === "en" ? "font-Teko" : "font-Yekan"}
    ${themes === "PINK" ? "bg-themePink text-black" : ""}
    ${themes === "DARK" ? "bg-themeDark text-white" : ""}
    ${themes === "BLUE" ? "bg-themeBlue text-white" : ""}
    ${themes === "PURPLE" ? "bg-themePurple text-white" : ""}
    `}
    >
      <div className="flex justify-between items-center flex-grow">
        <Link
          to="/single"
          className={`text-3xl sm:text-4xl border-r gap-2  h-screen flex justify-center font-semibold flex-1 items-center transition-all duration-300
            ${themes === "DARK" ? "" : "border-black"}
            `}
        >
          {t('Single Play')}
          <LuSword className="text-blue-600" />
        </Link>
            <div className={`flex flex-1 justify-center cursor-not-allowed select-none ${i18n.language === 'en' ? "text-4xl" : "text-2xl font-Yekan"}`}>
              <h1>{t('notAvailable')}</h1>
            </div>
        {/* <Link
          to="/duel"
          className="flex items-center gap-2 text-3xl sm:text-4xl justify-center flex-1 h-screen font-semibold transition-all duration-300"
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
              {t('Duels')}
              <LuSwords className="text-redLoser" />
            </div>
          </div>
        </Link> */}
      </div>
    </div>
  );
};

export default Home;
