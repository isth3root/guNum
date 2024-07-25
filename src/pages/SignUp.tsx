import React, { useState } from "react";
import { Input, message, Dropdown, Menu } from "antd";
import type { MenuProps } from "antd";
import { useLogin } from "../hooks/useLogin";
import { useSignup } from "../hooks/useSignup";

interface SignUpProps {}

const SignUp: React.FC<SignUpProps> = () => {
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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(userNameLogin, passwordLogin);
      message.success("Welcome");
      setUserNameLogin("");
      setPasswordLogin("");
    } catch {
      message.error(errorLogin || "Failed to log in");
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signup(usernameSignup, passwordSignup);
      message.success("Welcome");
      setUsernameSignup("");
      setPasswordSignup("");
    } catch {
      message.error(errorSignup || "Failed to sign up");
    }
  };

  const handleThemeChange = (theme: "PINK" | "DARK" | "PURPLE" | "BLUE") => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
  };

  const themeMenuItems: MenuProps["items"] = [
    {
      key: "1",
      label: "PINK",
      onClick: () => handleThemeChange("PINK"),
    },
    {
      key: "2",
      label: "DARK",
      onClick: () => handleThemeChange("DARK"),
    },
    {
      key: "3",
      label: "BLUE",
      onClick: () => handleThemeChange("BLUE"),
    },
    {
      key: "4",
      label: "PURPLE",
      onClick: () => handleThemeChange("PURPLE"),
    },
  ];

  const themeMenu = (
    <Menu items={themeMenuItems} />
  );

  return (
    <div
      className={`flex flex-col items-center justify-center font-Teko h-screen ${
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
          <form className="flex flex-col gap-5" onSubmit={handleSignup}>
            <h1 className="text-3xl select-none">Signup</h1>
            <Input
              addonBefore="@"
              placeholder="Username"
              className="w-72 sm:w-80"
              value={usernameSignup}
              onChange={(e) => setUsernameSignup(e.target.value)}
              maxLength={10}
            />
            <Input.Password
              placeholder="Password"
              className="w-72 sm:w-80"
              value={passwordSignup}
              onChange={(e) => setPasswordSignup(e.target.value)}
            />
            <button
              className={`text-white w-72 sm:w-80 rounded-md py-2 ${theme === "PINK" ? "bg-[#FF7777]" : ""} ${theme === "DARK" ? "bg-[#405D72]" : ""} ${theme === "BLUE" ? "bg-[#667BC6]" : ""} ${theme === "PURPLE" ? "bg-[#E4003A]" : ""}`}
              type="submit"
              disabled={loadingSignup}
            >
              <p className="text-2xl">{loadingSignup ? "Loading..." : "Continue"}</p>
            </button>
            <button
              className="text-center text-3xl underline"
              type="button"
              onClick={() => setIsSignUp((prev) => !prev)}
            >
              Login here
            </button>
          </form>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <h1 className="text-3xl select-none">Login</h1>
            <Input
              addonBefore="@"
              placeholder="Username"
              className="w-72 sm:w-80"
              value={userNameLogin}
              onChange={(e) => setUserNameLogin(e.target.value)}
              maxLength={10}
            />
            <Input.Password
              placeholder="Password"
              className="w-72 sm:w-80"
              value={passwordLogin}
              onChange={(e) => setPasswordLogin(e.target.value)}
            />
            <button
              className={`text-white w-72 sm:w-80 rounded-md py-2 ${theme === "PINK" ? "bg-[#FF7777]" : ""} ${theme === "DARK" ? "bg-[#405D72]" : ""} ${theme === "BLUE" ? "bg-[#667BC6]" : ""} ${theme === "PURPLE" ? "bg-[#E4003A]" : ""}`}
              type="submit"
              disabled={loadingLogin}
            >
              <p className="text-2xl">{loadingLogin ? "Loading..." : "Continue"}</p>
            </button>
            <button
              className="text-center text-3xl underline"
              type="button"
              onClick={() => setIsSignUp((prev) => !prev)}
            >
              Signup here
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
