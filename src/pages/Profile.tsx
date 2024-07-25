import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useDeleteAccount } from "../hooks/useDeleteAccount";
import { Modal, Input } from "antd";
import { useLogout } from "../hooks/useLogout";

const Profile = () => {
  const [themes] = useState<"PINK" | "DARK" | "PURPLE" | "BLUE">(() => {
    const storedTheme = localStorage.getItem("theme");
    return (storedTheme as "PINK" | "DARK" | "PURPLE" | "BLUE") || "DARK";
  });
  const { user, setUser } = useContext(AuthContext);
  const { deleteAccount } = useDeleteAccount();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const { logout } = useLogout();

  const handleLogOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    logout(user!.username);
    navigate("/signup")
  };

  const handleOk = async () => {
    if (user?.username && password) {
      try {
        await deleteAccount(user.username);
        handleLogOut();
        navigate("/signup")
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    } else {
      console.warn("Username or password is undefined, cannot delete account.");
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div
      className={` flex flex-col justify-between items-center gap-5 h-screen font-Teko
        ${themes === "PINK" ? "bg-themePink text-black" : ""}
        ${themes === "DARK" ? "bg-themeDark text-white" : ""}
        ${themes === "BLUE" ? "bg-themeBlue text-white" : ""}
        ${themes === "PURPLE" ? "bg-themePurple text-white" : ""}
        `}
    >
      <div className="">
        <Link to={"/"} className="text-3xl mt-5 underline">
          Home
        </Link>
      </div>
      <h1 className=" text-3xl px-10 text-center">
        Logged In as <span className="text-red-500 underline">{user?.username}</span>
      </h1>
      <div className="flex gap-10 mb-5 text-3xl">
        <button className="text-orange-500" onClick={handleLogOut}>
          Log out
        </button>
        <button
          className="text-redLoser"
          onClick={() => setIsModalVisible(true)}
        >
          Delete account
        </button>
      </div>
      <Modal
        title="Delete Account"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Please enter your username to delete your account:</p>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="username"
        />
      </Modal>
    </div>
  );
};

export default Profile;
