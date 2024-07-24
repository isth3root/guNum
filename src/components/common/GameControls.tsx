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
  return (
    <div className="flex flex-col items-center sticky bottom-0 left-0 z-20 bg-inherit w-full pt-5">
      {gameOver && (
        <div className="flex flex-col gap-4 items-center">
          <h1 className="select-none text-3xl">{`You guessed the number with ${guessCount} ${
            guessCount <= 1 ? "guess" : "guesses"
          }`}</h1>
        </div>
      )}
      {!gameOver && <div className="text-2xl">Guess Count : {guessCount}</div>}
      <button
        className={`select-none mb-5 text-2xl hover:shadow-lg rounded-md py-2 px-5 hover:rotate-6
        ${themes === "PINK" ? "bg-black text-white" : ""}
        ${themes === "DARK" ? "bg-white text-black" : ""}
        ${themes === "BLUE" ? "bg-white text-black" : ""}
        ${themes === "PURPLE" ? "bg-white text-black" : ""}`}
        onClick={handleNewGame}
      >
        New Game
      </button>
    </div>
  );
};

export default GameControls;
