// ========== PACKAGES ========== \\
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// ========== COMPONENTS ========== \\
import DifficultyDropdown from '../components/common/DifficultyDropDown';
import LeaderBoardList from '../components/LeaderBoardList';

// ========== CONTEXTES ========== \\
import AuthContext from '../context/AuthContext';

// ========== HOOKS ========== \\
import { useSortedUsers } from '../hooks/useSortedUsers';

// ========== TYPES & UTILS ========== \\
import i18n from '../utils/i18n';
import { User } from '../types';


const LeaderBoard = () => {
  const { t } = useTranslation();
  const [themes] = useState<'PINK' | 'DARK' | 'PURPLE' | 'BLUE'>(
    () => {
      const storedTheme = localStorage.getItem('theme');
      return (storedTheme as 'PINK' | 'DARK' | 'PURPLE' | 'BLUE') || 'DARK';
    }
  );

  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD' | 'DuelXP'>('DuelXP');

  const handleDifficultyChange = (difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'DuelXP') => {
    setDifficulty(difficulty);
  };

  const { users, getSortedUsers } = useSortedUsers();

  useEffect(() => {
    getSortedUsers(difficulty);
  }, [difficulty, getSortedUsers]);

  const { user } = useContext(AuthContext);

  const getScoreByDifficulty = (user: User, difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'DuelXP') => {
    switch (difficulty) {
      case 'EASY':
        return user.numSinglePlayScore.easy;
      case 'MEDIUM':
        return user.numSinglePlayScore.medium;
      case 'HARD':
        return user.numSinglePlayScore.hard;
      case 'DuelXP':
        return user.numDuelXP;
      default:
        return 0;
    }
  };

  return (
    <div
      className={`min-h-screen font-Teko flex flex-col ${
        themes === 'PINK' ? 'bg-themePink text-black' : ''
      }
        ${themes === 'DARK' ? 'bg-themeDark text-white' : ''}
        ${themes === 'BLUE' ? 'bg-themeBlue text-white' : ''}
        ${themes === 'PURPLE' ? 'bg-themePurple text-white' : ''}`}
    >
      <div className="flex justify-center py-4">
        <Link to={'/'} className="underline text-3xl">
          <p className="hover:rotate-2 font-semibold animate-pulse flex justify-center">
            {t('Home')}
          </p>
        </Link>
      </div>
      <div dir={i18n.language === 'en' ? "ltr" : "rtl"} className="flex justify-center items-center gap-2 mt-5">
        <h1 className="text-2xl">{t('sort')} :</h1>
        <DifficultyDropdown
          difficulty={difficulty}
          handleDifficultyChange={handleDifficultyChange}
        />
      </div>

      <div className="mt-10 px-1 sm:px-60">
        <LeaderBoardList
          users={users}
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
