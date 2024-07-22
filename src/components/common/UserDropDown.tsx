import React from "react";
import { Dropdown, MenuProps } from "antd";

interface UserDropdownProps {
  user: { username: string } | null;
  handleLogOut: () => void;
  handleDeleteAccount: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  user,
  handleLogOut,
  handleDeleteAccount,
}) => {
  const userItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="font-Teko text-xl" onClick={handleLogOut}>
          LOGOUT
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="font-Teko text-xl" onClick={handleDeleteAccount}>
          DELETE ACCOUNT
        </div>
      ),
      danger: true,
    },
  ];

  return (
    <Dropdown
      menu={{ items: userItems }}
      trigger={["click"]}
      className="hover:-translate-y-1"
    >
      <a
        onClick={(e) => e.preventDefault()}
        className="text-3xl cursor-pointer select-none"
      >
        {user?.username}
      </a>
    </Dropdown>
  );
};

export default UserDropdown;
