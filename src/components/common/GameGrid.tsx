import React from "react";

interface GameGridProps {
  numbers: number[];
  shuffledIndices: number[];
  crossedNumbers: number[];
  correctGuess: number | null;
  handleClick: (index: number) => void;
  highlightCorrectNumber: boolean;
}

const GameGrid: React.FC<GameGridProps> = ({
  numbers,
  shuffledIndices,
  crossedNumbers,
  correctGuess,
  handleClick,
  highlightCorrectNumber,
}) => {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
      {shuffledIndices.map((index) => {
        const number = numbers[index];
        const isCrossed = crossedNumbers.includes(number);
        const isCorrect = number === correctGuess && highlightCorrectNumber;

        return (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`text-5xl select-none ${
              isCrossed
                ? "line-through opacity-5 transition-all duration-1000 ease-in-out"
                : ""
            } ${isCorrect ? "text-red-500 font-bold" : ""}`}
          >
            {number}
          </button>
        );
      })}
    </div>
  );
};

export default GameGrid;
