// ========== PACKAGES ========== \\
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Popover } from "antd";
import { AiOutlineArrowUp } from "react-icons/ai";
import { FiMoon, FiUser } from "react-icons/fi";
import { MdOutlineLeaderboard } from "react-icons/md";
import { BiLogoTelegram } from "react-icons/bi";
import { useTranslation } from 'react-i18next';

// ========== TYPES & UTILS ========== \\
import i18n from "../utils/i18n";


const Home = () => {
  const { t } = useTranslation();
  const [themes, setThemes] = useState<"PINK" | "DARK" | "PURPLE" | "BLUE">(
    () => {
      const storedTheme = localStorage.getItem("theme");
      return (storedTheme as "PINK" | "DARK" | "PURPLE" | "BLUE") || "DARK";
    }
  );

  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const themeContect = (
    <div className={`flex flex-col items-center ${i18n.language === "en" ? "font-Teko text-2xl" : "font-Yekan text-xl"} px-5`}>
      <button onClick={() => handleThemeChange("PINK")}>{t('PINK')}</button>
      <button onClick={() => handleThemeChange("DARK")}>{t('DARK')}</button>
      <button onClick={() => handleThemeChange("BLUE")}>{t('BLUE')}</button>
      <button onClick={() => handleThemeChange("PURPLE")}>{t('PURPLE')}</button>
    </div>
  );

  const handleThemeChange = (theme: "PINK" | "DARK" | "PURPLE" | "BLUE") => {
    setThemes(theme);
    localStorage.setItem("theme", theme);
  };

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <div
      className={`relative flex flex-col h-screen font-Teko
    ${themes === "PINK" ? "bg-themePink text-black" : ""}
    ${themes === "DARK" ? "bg-themeDark text-white" : ""}
    ${themes === "BLUE" ? "bg-themeBlue text-white" : ""}
    ${themes === "PURPLE" ? "bg-themePurple text-white" : ""}
    `}
    >
      <div className="relative flex justify-between items-center flex-grow">
        <Link
          to="/gunumber"
          className={`relative text-3xl sm:text-4xl border-r gap-2 h-screen flex justify-center items-center font-semibold flex-1 transition-all duration-300
            ${themes === "DARK" ? "" : "border-black"}
            `}
        >
          <div className={`relative flex items-center justify-center ${i18n.language === 'en' ? "" : "font-Yekan"}`}>
            <div className={`absolute top-9 left-2 text-3xl rotate-12 ${themes === "PINK" ? "text-black" : "text-themePink"}`}>5</div>
            <div className={`absolute bottom-10 left-2 text-4xl -rotate-12 ${themes === "BLUE" ? "text-black" : "text-themeBlue"}`}>8</div>
            <div className="absolute top-7 right-3 text-3xl -rotate-12 text-yellow-200">3</div>
            <div className="absolute bottom-9 right-6 text-xl rotate-12 text-red-400">4</div>
            {t('numbers')}
          </div>
        </Link>
        <Link
          to="/guword"
          className="relative flex flex-col items-center gap-2 text-3xl sm:text-4xl justify-center flex-1 h-screen font-semibold transition-all duration-300"
        >
          <div className={`relative flex flex-col items-center ${i18n.language === 'en' ? "" : "font-Yekan"}`}>
            <div className="absolute -bottom-7 -left-4 text-2xl rotate-12 text-sky-300">{t('B')}</div>
            <div className="absolute -top-6 -left-2 text-2xl -rotate-12 text-purple-500">{t('A')}</div>
            <div className="absolute -top-9 right-2 text-2xl rotate-12 text-green-400">{t('M')}</div>
            <div className="absolute -bottom-6 right-1 text-2xl -rotate-12 text-rose-600">{t('Z')}</div>
            {t('words')}
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
        <div className="fixed flex bottom-16 left-1/2 text-black transform duration-100 transition-all gap-5 -translate-x-1/2 bg-white justify-center shadow-lg rounded-lg px-5 py-1">
          <Link
            aria-label="profile"
            title={t('profile')}
            to="/profile"
            className="block py-2 rounded-full text-2xl"
          >
            <FiUser color="red" />
          </Link>
          <div className="block py-2 rounded-full text-2xl">
            <Popover placement="top" content={themeContect}>
              <FiMoon />
            </Popover>
          </div>
          <Link
            aria-label="leaderboard"
            title={t('leaderboard')}
            to="/leaderboard"
            className="block py-2 rounded-full text-2xl"
          >
            <MdOutlineLeaderboard color="orange" />
          </Link>
          <a href="https://t.me/gunumber" target="_blank" className="self-center" title="Telegram" aria-label="telegram">
            <BiLogoTelegram className="text-2xl" color="blue" />
          </a>
          <button onClick={() => handleLanguageChange('en')} className="text-2xl">EN</button>
          <button onClick={() => handleLanguageChange('fa')} className="text-2xl">فا</button>
        </div>
      )}
    </div>
  );
};

export default Home;
