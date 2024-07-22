import React from "react";
import { Dropdown, MenuProps } from "antd";

interface ThemeDropdownProps {
  themes: "PINK" | "DARK" | "PURPLE" | "BLUE";
  handleThemeChange: (theme: "PINK" | "DARK" | "PURPLE" | "BLUE") => void;
}

const ThemeDropdown: React.FC<ThemeDropdownProps> = ({
  themes,
  handleThemeChange,
}) => {
  const themeItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div
          className="font-Teko text-xl select-none"
          onClick={() => handleThemeChange("PINK")}
        >
          PINK
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          className="font-Teko text-xl select-none"
          onClick={() => handleThemeChange("DARK")}
        >
          DARK
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div
          className="font-Teko text-xl select-none"
          onClick={() => handleThemeChange("BLUE")}
        >
          BLUE
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <div
          className="font-Teko text-xl select-none"
          onClick={() => handleThemeChange("PURPLE")}
        >
          PURPLE
        </div>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items: themeItems }}
      trigger={["click"]}
      className="hover:rotate-6"
    >
      <a
        onClick={(e) => e.preventDefault()}
        className="text-3xl cursor-pointer select-none"
      >
        {themes}
      </a>
    </Dropdown>
  );
};

export default ThemeDropdown;
