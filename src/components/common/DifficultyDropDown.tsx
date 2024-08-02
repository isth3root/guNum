// ========== PACKAGES ========== \\
import React from "react";
import { Dropdown, MenuProps } from "antd";

// ========== TYPES ========== \\
import { DifficultyDropdownProps } from "../../types";

const DifficultyDropdown: React.FC<DifficultyDropdownProps> = ({
  difficulty,
  handleDifficultyChange,
}) => {
  const difficultyItems: MenuProps["items"] = [
    {
      key: "1",
      label: <div onClick={() => handleDifficultyChange("EASY")}>EASY</div>,
    },
    {
      key: "2",
      label: <div onClick={() => handleDifficultyChange("MEDIUM")}>MEDIUM</div>,
    },
    {
      key: "3",
      label: <div onClick={() => handleDifficultyChange("HARD")}>HARD</div>,
    },
    {
      key: "4",
      label: <div onClick={() => handleDifficultyChange("DuelXP")}>DuelXP</div>,
    },
  ];

  return (
    <Dropdown
      menu={{ items: difficultyItems }}
      trigger={["click"]}
      className="hover:-rotate-6"
    >
      <a
        onClick={(e) => e.preventDefault()}
        className="text-3xl cursor-pointer select-none"
      >
        {difficulty}
      </a>
    </Dropdown>
  );
};

export default DifficultyDropdown;
