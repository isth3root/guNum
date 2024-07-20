import React, { useState, useContext } from 'react';
import { Input, message, Dropdown } from 'antd';
import type { MenuProps } from "antd";
import { useAuth } from '../hooks/useAuth';
import AuthContext from '../context/AuthContext';

interface SignUpProps {}

const SignUp: React.FC<SignUpProps> = () => {
  const [themes, setThemes] = useState<"PINK" | "DARK" | "PURPLE" | "BLUE">(() => {
    // get theme from localstorage. Default is Dark.
    const storedTheme = localStorage.getItem("theme");
    return (storedTheme as "PINK" | "DARK" | "PURPLE" | "BLUE") || "DARK";
  });
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setUser } = useContext(AuthContext);
  const { signUp, loading, error } = useAuth();
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await signUp(userName, password); 
      message.success("Welcome");
      setUser(data);
      setUserName('');
      setPassword('');
    } catch (err) {
      message.error(error || 'Failed to sign up');
    }
  };

  // Handle input changes with filtering
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filteredValue = value.replace(
      /[^a-zA-Z0-9!@#$%^&*()_+={}[\]:;"'<>,.?/|\\-]/g,
      ''
    );
    setUserName(filteredValue);
  };

  // Handle theme change and save to localStorage
  const handleThemeChange = (theme: "PINK" | "DARK" | "PURPLE" | "BLUE") => {
    setThemes(theme);
    localStorage.setItem("theme", theme);
  };

  // Define menu items for the dropdown
  const themeItems: MenuProps['items'] = [
    { key: '1', label: <div className="font-Teko text-xl select-none" onClick={() => handleThemeChange('PINK')}>PINK</div>},
    { key: '2', label: <div className="font-Teko text-xl select-none" onClick={() => handleThemeChange('DARK')}>DARK</div>},
    { key: '3', label: <div className="font-Teko text-xl select-none" onClick={() => handleThemeChange('BLUE')}>BLUE</div>},
    { key: '4', label: <div className="font-Teko text-xl select-none" onClick={() => handleThemeChange('PURPLE')}>PURPLE</div>},
  ];

  return (
    <div className={`flex flex-col items-center justify-center font-Teko h-screen ${themes === 'PINK' ? 'bg-[#FFEFEF] text-black' : ''} 
        ${themes === 'DARK' ? 'bg-[#1A3636] text-white' : ''} 
        ${themes === 'BLUE' ? 'bg-[#7C73C0] text-white' : ''} 
        ${themes === 'PURPLE' ? 'bg-[#4A249D] text-white' : ''}`}>
      
      <div className="absolute top-4 flex justify-center w-full">
        <Dropdown menu={{ items: themeItems }} trigger={['click']} className="hover:rotate-6">
          <a onClick={(e) => e.preventDefault()} className="text-3xl cursor-pointer select-none">
            {themes}
          </a>
        </Dropdown>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <h1 className="text-2xl select-none">Login / Signup</h1>
          <Input
            addonBefore="@"
            placeholder="Username"
            className="w-72 sm:w-80"
            value={userName}
            onChange={handleInputChange}
            title="Username can only contain English letters, numbers, and symbols"
            required
            maxLength={10}
          />
          <Input.Password
            placeholder="Password"
            className="w-72 sm:w-80"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className={`text-white w-72 sm:w-80 rounded-md py-2
              ${themes === "PINK" ? "bg-[#FF7777]" : ""}
              ${themes === "DARK" ? "bg-[#FF4191]" : ""}
              ${themes === "BLUE" ? "bg-[#667BC6]" : ""}
              ${themes === "PURPLE" ? "bg-[#E4003A]" : ""}
              `}
            type="submit"
            disabled={loading}
          >
            <p className='text-2xl'>{loading ? 'Loading...' : 'Continue'}</p>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
