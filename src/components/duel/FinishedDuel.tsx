import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineDelete } from 'react-icons/ai';
import Swipeable from './Swipeable';

// ========== TYPES & UTILS ========== \\
import { Duel } from '../../types';
import { FinishedProps } from '../../types';
import i18n from '../../utils/i18n';

// ========== CONTEXTES ========== \\
import AuthContext from '../../context/AuthContext';

// ========== HOOKS ========== \\
import useFinishedDuels from '../../hooks/useFinishedDuels';
import useDeleteDuel from '../../hooks/useDeleteDuel';

const FinishedDuels: React.FC<FinishedProps> = ({ users }) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { duels: finishedDuels, refetch: refetchFinished } = useFinishedDuels(user!.username);
  const { deleteDuel } = useDeleteDuel();

  const handleDeleteDuel = async (duelId: string) => {
    await deleteDuel(duelId);
    refetchFinished();
  };

  const theme = localStorage.getItem('theme');

  return (
    <div>
      {finishedDuels.length === 0 ? (
        <p
          className={`text-center py-5 ${i18n.language === 'en' ? 'text-3xl font-semibold font-Teko' : 'font-Yekan text-2xl'}
            ${theme === 'PINK' ? 'text-black' : ''}
            ${theme === 'DARK' || theme === 'BLUE' || theme === 'PURPLE' ? 'text-white' : ''}
        `}
        >
          {t('finished message')}
        </p>
      ) : (
        <div className="flex flex-col gap-5 font-Teko">
          {finishedDuels.map((duel: Duel) => (
            <Swipeable
              key={duel._id}
            >
              <div
                className={`relative flex flex-col justify-between items-center border-b-4 w-full px-2 py-2 ${
                  duel.winner
                    ? user?._id === duel.winner
                      ? 'bg-greenWinner text-black'
                      : 'bg-redLoser text-white'
                    : 'bg-greyTie text-black'
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
                  <h1 className="text-3xl">{duel.senderGuesses}</h1> :{' '}
                  <h1 className="text-3xl">{duel.receiverGuesses}</h1>
                </div>
              </div>
            </Swipeable>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinishedDuels;
