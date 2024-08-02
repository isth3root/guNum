// ========== PACKAGES ========== \\
import React from "react";
import { Dropdown, MenuProps } from "antd";

// ========== TYPES ========== \\
import { ContextMenuProps } from "../../types";

const ContextMenu: React.FC<ContextMenuProps> = ({
  handleDifficultyChange,
  children,
}) => {
  const contextItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div onClick={() => handleDifficultyChange("EASY")}>New Game: EASY</div>
      ),
    },
    {
      key: "2",
      label: (
        <div onClick={() => handleDifficultyChange("MEDIUM")}>
          New Game: MEDIUM
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div onClick={() => handleDifficultyChange("HARD")}>New Game: HARD</div>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items: contextItems }} trigger={["contextMenu"]}>
      <div style={{ minHeight: "100vh" }}>{children}</div>
    </Dropdown>
  );
};

export default ContextMenu;
