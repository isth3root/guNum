// ========== PACKAGES ========== \\
import React from "react";

// ========== TYPES ========== \\
import { GameGridProps } from "../../types";

const GameGrid: React.FC<GameGridProps> = ({
  numbers,
  shuffledIndices,
  crossedNumbers,
  correctGuess,
  handleClick,
  highlightCorrectNumber,
}) => {
  console.log("GameGrid props:", {
    numbers,
    shuffledIndices,
    crossedNumbers,
    correctGuess,
    highlightCorrectNumber,
  });

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
