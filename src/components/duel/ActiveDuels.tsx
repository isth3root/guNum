// ========== PACKAGES ========== \\
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ========== TYPES & UTILS ========== \\
import { Duel } from "../../types";
import { ActiveProps } from "../../types";
import i18n from "../../utils/i18n";

// ========== CONTEXTES ========== \\
import AuthContext from "../../context/AuthContext";

// ========== HOOKS ========== \\
import useActiveDuels from "../../hooks/useActiveDuels";

const ActiveDuels: React.FC<ActiveProps> = ({ users }) => {
  const {t} = useTranslation()
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { duels: activeDuels } = useActiveDuels(user!.username);

  const handlePlay = (duel: Duel) => {
    navigate(`/duel/${duel._id}`, { state: { difficulty: duel.difficulty } });
  };

  const theme = localStorage.getItem("theme")

  return (
    <div>
      {activeDuels.length === 0 ? (
        <p className={`text-center py-5 ${i18n.language === 'en' ? "text-3xl font-semibold font-Teko" : "font-Yekan text-2xl"}
            ${theme === "PINK" ? "text-black" : ""}
            ${theme === "DARK" || theme === "BLUE" || theme === "PURPLE" ? "text-white" : ""}
        `}>
          {t('active message')}
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {activeDuels.map((duel: Duel) => {
            const isDisabled =
              (duel.sender === user?._id && !!duel.senderGuesses) ||
              (duel.receiver === user?._id && !!duel.receiverGuesses);
            return (
              <div
                key={duel._id}
                className="flex flex-col font-Teko px-14 justify-between items-center border-b-2 w-full bg-white py-5 text-black"
              >
                <h1 className="text-2xl">{duel.difficulty}</h1>
                <div className="flex justify-between gap-10 w-full">
                  <h1 className="text-3xl">
                    {users.find((user) => user._id === duel.sender)?.username}
                  </h1>
                  <h1 className="text-3xl">
                    {users.find((user) => user._id === duel.receiver)?.username}
                  </h1>
                </div>
                <div className="flex items-center gap-3 text-2xl">
                  <h1>{duel.senderGuesses}</h1> : <h1>{duel.receiverGuesses}</h1>
                </div>
                <div className="flex gap-10 mt-4 px-14 items-center">
                  <button
                    className={`text-2xl px-4 rounded-md ${
                      isDisabled
                        ? "bg-greyTie text-gray-500 cursor-not-allowed"
                        : "bg-greenWinner text-white"
                    }`}
                    onClick={() => handlePlay(duel)}
                    disabled={isDisabled}
                  >
                    {isDisabled ? i18n.language === 'en' ? "Played" : "بازی شده" : i18n.language === 'en' ? "Play" : "شروع"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveDuels;
