// ========== PACKAGES ========== \\
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Input } from "antd";
import { useTranslation } from "react-i18next";

// ========== TYPES & UTILS ========== \\
import i18n from "../utils/i18n";

// ========== CONTEXTES ========== \\
import AuthContext from "../context/AuthContext";

// ========== HOOKS ========== \\
import { useDeleteAccount } from "../hooks/useDeleteAccount";
import { useLogout } from "../hooks/useLogout";


const Profile = () => {
  const { t } = useTranslation();
  const [themes, setThemes] = useState<"PINK" | "DARK" | "PURPLE" | "BLUE">("DARK");
  const [language, setLanguage] = useState("en");
  const { user, setUser } = useContext(AuthContext);
  const { deleteAccount } = useDeleteAccount();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { logout } = useLogout();

  useEffect(() => {
    // Set theme from localStorage
    const storedTheme = localStorage.getItem("theme") as "PINK" | "DARK" | "PURPLE" | "BLUE";
    setThemes(storedTheme || "DARK");

    // Set language from localStorage
    const storedLanguage = localStorage.getItem("language") || "en";
    setLanguage(storedLanguage);
    i18n.changeLanguage(storedLanguage); // Ensure i18next uses the stored language
  }, []);

  const handleLogOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    logout(user!.username);
    navigate("/signup");
  };

  const handleOk = async () => {
    if (user?.username && password) {
      try {
        await deleteAccount(user.username);
        handleLogOut();
        navigate("/signup");
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
      className={`flex flex-col justify-between items-center gap-5 h-screen font-Teko
        ${themes === "PINK" ? "bg-themePink text-black" : ""}
        ${themes === "DARK" ? "bg-themeDark text-white" : ""}
        ${themes === "BLUE" ? "bg-themeBlue text-white" : ""}
        ${themes === "PURPLE" ? "bg-themePurple text-white" : ""}
      `}
    >
      <div className="w-full flex justify-center px-5">
        <Link to="/" className="text-3xl mt-5 underline">
          {t('Home')}
        </Link>
      </div>
      <h1 dir={language === 'en' ? "ltr" : "rtl"} className="text-3xl px-10 text-center">
        {t('loggedInAs')}: <span className="text-red-500 underline">{user?.username}</span>
      </h1>
      <div className={`flex gap-10 mb-5 ${language === 'en' ? "text-3xl" : "text-xl"}`}>
        <button className="text-orange-500" onClick={handleLogOut}>
          {t('logout')}
        </button>
        <button
          className="text-red-500"
          onClick={() => setIsModalVisible(true)}
        >
          {t('deleteAccount')}
        </button>
      </div>
      <Modal
        title={language === "en" ? "Delete Account" : "حذف حساب"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText={language === 'en' ? "Cancel" : "لغو"}
        okText={language === 'en' ? "Delete" : "حذف"}
        okButtonProps={{ danger: true }}
        className={language === 'en' ? "ltr" : "rtl"}
      >
        <p>{t('deleteAccountText')}</p>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={language === 'en' ? "Enter your password" : "رمز عبور خود را وارد کنید"}
        />
      </Modal>
    </div>
  );
};

export default Profile;
