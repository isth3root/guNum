// ========== PACKAGES ========== \\
import React, { useState, useEffect } from "react";
import { Input, message, Dropdown, Menu } from "antd";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";

// ========== TYPES & UTILS ========== \\
import i18n from "../utils/i18n";

// ========== HOOKS ========== \\
import { useLogin } from "../hooks/useLogin";
import { useSignup } from "../hooks/useSignup";

interface SignUpProps {}

const SignUp: React.FC<SignUpProps> = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<"PINK" | "DARK" | "PURPLE" | "BLUE">(
    () => (localStorage.getItem("theme") as "PINK" | "DARK" | "PURPLE" | "BLUE") || "DARK"
  );

  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const [userNameLogin, setUserNameLogin] = useState<string>("");
  const [passwordLogin, setPasswordLogin] = useState<string>("");
  const [usernameSignup, setUsernameSignup] = useState<string>("");
  const [passwordSignup, setPasswordSignup] = useState<string>("");

  const { login, loading: loadingLogin, error: errorLogin } = useLogin();
  const { signup, loading: loadingSignup, error: errorSignup } = useSignup();

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(userNameLogin, passwordLogin);
      message.success(t("welcome"));
      setUserNameLogin("");
      setPasswordLogin("");
    } catch {
      message.error(errorLogin || t("loginFailed"));
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signup(usernameSignup, passwordSignup);
      message.success(t("welcome"));
      setUsernameSignup("");
      setPasswordSignup("");
    } catch {
      message.error(errorSignup || t("signupFailed"));
    }
  };

  const handleThemeChange = (theme: "PINK" | "DARK" | "PURPLE" | "BLUE") => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
  };

  const themeMenuItems: MenuProps["items"] = [
    { key: "1", label: "PINK", onClick: () => handleThemeChange("PINK") },
    { key: "2", label: "DARK", onClick: () => handleThemeChange("DARK") },
    { key: "3", label: "BLUE", onClick: () => handleThemeChange("BLUE") },
    { key: "4", label: "PURPLE", onClick: () => handleThemeChange("PURPLE") },
  ];

  const themeMenu = <Menu items={themeMenuItems} />;

  const language = i18n.language;
  const isEnglish = language === 'en';

  return (
    <div
      className={`flex flex-col items-center justify-center ${isEnglish ? "font-Teko" : "font-Yekan"} h-screen ${
        theme === "PINK" ? "bg-themePink text-black" : ""
      }
      ${theme === "DARK" ? "bg-themeDark text-white" : ""}
      ${theme === "BLUE" ? "bg-themeBlue text-white" : ""}
      ${theme === "PURPLE" ? "bg-themePurple text-white" : ""}`}
    >
      <div className="absolute top-4 flex justify-center w-full">
        <Dropdown overlay={themeMenu} trigger={["click"]}>
          <a
            onClick={(e) => e.preventDefault()}
            className="text-3xl cursor-pointer select-none hover:rotate-6 transition-transform"
          >
            {theme}
          </a>
        </Dropdown>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow">
        {isSignUp ? (
          <form dir={isEnglish ? "ltr" : "rtl"} className="flex flex-col gap-5" onSubmit={handleSignup}>
            <h1 className="text-3xl select-none">{t('signup')}</h1>
            <Input
              placeholder={isEnglish ? "Username" : "آیدی"}
              className="w-72 sm:w-80"
              value={usernameSignup}
              onChange={(e) => setUsernameSignup(e.target.value)}
              maxLength={10}
            />
            <Input.Password
              placeholder={isEnglish ? "Password" : "رمز"}
              className="w-72 sm:w-80"
              value={passwordSignup}
              onChange={(e) => setPasswordSignup(e.target.value)}
            />
            <button
              className={`text-white w-72 sm:w-80 rounded-md py-2 ${
                theme === "PINK" ? "bg-[#FF7777]" : ""
              } ${theme === "DARK" ? "bg-[#FF4E88]" : ""} ${
                theme === "BLUE" ? "bg-[#667BC6]" : ""
              } ${theme === "PURPLE" ? "bg-[#E4003A]" : ""}`}
              type="submit"
              disabled={loadingSignup}
            >
              <p className="text-2xl">
                {loadingSignup
                  ? isEnglish
                    ? "Loading..."
                    : "ثبت کاربر..."
                  : isEnglish
                    ? "Sign Up"
                    : "ثبتنام"}
              </p>
            </button>
            <button
              className={`text-center ${isEnglish ? "text-2xl" : "text-xl"}`}
              type="button"
              onClick={() => setIsSignUp((prev) => !prev)}
            >
              {t('loginHere')}
            </button>
          </form>
        ) : (
          <form dir={isEnglish ? "ltr" : "rtl"} className="flex flex-col gap-5" onSubmit={handleLogin}>
            <h1 className="text-3xl select-none">{t('login')}</h1>
            <Input
              placeholder={isEnglish ? "Username" : "آیدی"}
              className="w-72 sm:w-80"
              value={userNameLogin}
              onChange={(e) => setUserNameLogin(e.target.value)}
              maxLength={10}
            />
            <Input.Password
              placeholder={isEnglish ? "Password" : "رمز"}
              className="w-72 sm:w-80"
              value={passwordLogin}
              onChange={(e) => setPasswordLogin(e.target.value)}
            />
            <button
              className={`text-white w-72 sm:w-80 rounded-md py-2 ${
                theme === "PINK" ? "bg-[#FF7777]" : ""
              } ${theme === "DARK" ? "bg-[#7C00FE]" : ""} ${
                theme === "BLUE" ? "bg-[#667BC6]" : ""
              } ${theme === "PURPLE" ? "bg-[#E4003A]" : ""}`}
              type="submit"
              disabled={loadingLogin}
            >
              <p className="text-2xl">
                {loadingLogin
                  ? isEnglish
                    ? "Loading..."
                    : "لودکردن بازی"
                  : isEnglish
                    ? "Login"
                    : "ورود"}
              </p>
            </button>
            <button
              className={`text-center ${isEnglish ? "text-2xl" : "text-xl"}`}
              type="button"
              onClick={() => setIsSignUp((prev) => !prev)}
            >
              {t('signupHere')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
