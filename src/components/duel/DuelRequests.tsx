import { DuelRequest } from "../../types";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import useDuelRequests from "../../hooks/useDuelRequests";
import useAcceptDuelRequest from "../../hooks/useAcceptDuel";
import useDenyDuelRequest from "../../hooks/useDenyDuel";
import { useTranslation } from "react-i18next";
import i18n from "../../utils/i18n";
interface User {
  _id: string;
  username: string;
  score: {
    easy: number;
    medium: number;
    hard: number;
  };
  duelXP: number;
}

interface RequestProps {
  users: User[];
}

const DuelRequests: React.FC<RequestProps> = ({ users }) => {
  const { t } = useTranslation()
  const { user } = useContext(AuthContext);
  const { requests, refetch: refetchRequests } = useDuelRequests(user!.username);

  const { acceptDuelRequest } = useAcceptDuelRequest();
  const { denyDuelRequest } = useDenyDuelRequest();

  const handleAcceptDuel = async (userId: string) => {
    await acceptDuelRequest(userId);
    refetchRequests();
  };

  const handleDeny = async (duelId: string) => {
    await denyDuelRequest(duelId);
    refetchRequests();
  };
  const theme = localStorage.getItem("theme")

  return (
    <div className="">
      {requests.length === 0 ? (
        <p className={`text-center py-5 ${i18n.language === 'en' ? "text-3xl font-semibold font-Teko" : "font-Yekan text-2xl"}
            ${theme === "PINK" ? "text-black" : ""}
            ${theme === "DARK" || theme === "BLUE" || theme === "PURPLE" ? "text-white" : ""}
        `}>
          {t('request message')}
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {requests.map((request: DuelRequest) => (
            <div
              key={request._id}
              className="flex flex-col font-Teko px-16 justify-between items-center border-b-2 w-full bg-white py-5 text-black"
            >
              <h1 className="text-2xl">{request.difficulty}</h1>
              <div className="flex justify-center items-center w-full gap-40">
                <h1 className="text-4xl max-w-30 overflow-hidden">
                  {users.find((user) => user._id === request.sender)?.username}
                </h1>
              </div>
              <div className="flex gap-10 mt-4 items-center">
                <button
                  onClick={() => handleAcceptDuel(request._id)}
                  className="text-2xl bg-greenWinner text-white px-3 rounded-md"
                >
                  {t('accept')}
                </button>
                <button
                  onClick={() => handleDeny(request._id)}
                  className="text-2xl bg-redLoser text-white px-3 rounded-md"
                >
                  {t('deny')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DuelRequests;
