import { Duel } from "../../types";
import { AiOutlineDelete } from "react-icons/ai";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import useFinishedDuels from "../../hooks/useFinishedDuels";
import useDeleteDuel from "../../hooks/useDeleteDuel";

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

interface FinishedProps {
  users: User[];
}

const FinishedDuels: React.FC<FinishedProps> = ({ users }) => {
  const { user } = useContext(AuthContext);
  const {
    duels: finishedDuels,
    refetch: refetchFinished,
  } = useFinishedDuels(user!.username);

  const { deleteDuel } = useDeleteDuel();

  const handleDeleteDuel = async (duelId: string) => {
    await deleteDuel(duelId);
    refetchFinished();
  };

  const theme = localStorage.getItem("theme")

  return (
    <div>
      {finishedDuels.length === 0 ? (
         <p className={`text-center text-3xl font-semibold font-Teko py-5
            ${theme === "PINK" ? "text-black" : ""}
            ${theme === "DARK" || theme === "BLUE" || theme === "PURPLE" ? "text-white" : ""}
        `}>
          You have no Finished duel.
        </p>
      ) : (
        <div className="flex flex-col gap-5 font-Teko">
          {finishedDuels.map((duel: Duel) => (
            <div
              key={duel._id}
              className={`relative flex flex-col justify-between items-center border-b-4 w-full px-2 py-2 ${
                duel.winner
                  ? user?._id === duel.winner
                    ? "bg-greenWinner text-black"
                    : "bg-redLoser text-white"
                  : "bg-greyTie text-black"
              }`}
            >
              <div className="absolute top-1 right-1 text-black text-2xl">
                <AiOutlineDelete
                  onClick={() => handleDeleteDuel(duel._id)}
                  className="cursor-pointer hover:text-red-500"
                />
              </div>
              <h1 className="text-2xl">{duel.difficulty}</h1>
              <div className="flex justify-between w-full gap-40">
                <h1 className="text-3xl max-w-20 overflow-hidden">
                  {users.find((user) => user._id === duel.sender)?.username}
                </h1>
                <h1 className="text-3xl max-w-20 overflow-hidden">
                  {users.find((user) => user._id === duel.receiver)?.username}
                </h1>
              </div>
              <div className="flex gap-3 items-center">
                <h1 className="text-3xl">{duel.senderGuesses}</h1> :{" "}
                <h1 className="text-3xl">{duel.receiverGuesses}</h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinishedDuels;
