import { useTranslation } from "react-i18next";
import i18n from "../../utils/i18n";
interface GameControlsProps {
  themes: "PINK" | "DARK" | "PURPLE" | "BLUE";
  gameOver: boolean;
  guessCount: number;
  handleNewGame: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  themes,
  gameOver,
  guessCount,
  handleNewGame,
}) => {
  const {t} = useTranslation()
  return (
    <div className="flex flex-col items-center sticky bottom-0 left-0 z-20 bg-inherit w-full pt-5">
      {gameOver && (
          i18n.language === 'en' ? <h1 className="select-none text-2xl">{`You guessed the number with ${guessCount} ${
            guessCount <= 1 ? "guess" : "guesses"
          }`}</h1> : <h1 className="select-none text-2xl font-Yekan">{`شما با ${guessCount} حدس عدد را پیدا کردید`}</h1>
      )}
      {!gameOver && <div className={`text-2xl ${i18n.language === 'en' ? "" : "font-Yekan"}`}>{t('guessCount')} : {guessCount}</div>}
      <button
        className={`select-none mb-5 text-xl hover:shadow-lg rounded-md py-2 px-5 ${i18n.language === 'en' ? "" : "font-Yekan"}
        ${themes === "PINK" ? "bg-black text-white" : ""}
        ${themes === "DARK" ? "bg-white text-black" : ""}
        ${themes === "BLUE" ? "bg-white text-black" : ""}
        ${themes === "PURPLE" ? "bg-white text-black" : ""}`}
        onClick={handleNewGame}
      >
        {t('newGame')}
      </button>
    </div>
  );
};

export default GameControls;
