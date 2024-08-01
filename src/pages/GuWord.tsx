import React, { useState, useEffect, useRef } from 'react';
import { useGetWord } from '../hooks/useGetWord';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../utils/i18n';

const subjects = ['cars', 'countries', 'footballplayer', 'animals', 'technology'];

const GuWord: React.FC = () => {
  const { t } = useTranslation();
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Persian'>('English');
  const [showInputs, setShowInputs] = useState<boolean>(false);
  const [correctWord, setCorrectWord] = useState<string>('');
  const [displayWord, setDisplayWord] = useState<string>('');
  const [incorrectGuesses, setIncorrectGuesses] = useState<number>(0);
  const [wrongLetters, setWrongLetters] = useState<Set<string>>(new Set());
  const [gameOver, setGameOver] = useState<boolean>(false);
  const { getWord, word, loading, error } = useGetWord();
  const [themes] = useState<'PINK' | 'DARK' | 'PURPLE' | 'BLUE'>(
    () => {
      const storedTheme = localStorage.getItem('theme');
      return (storedTheme as 'PINK' | 'DARK' | 'PURPLE' | 'BLUE') || 'DARK';
    }
  );

  const maxWrongGuesses = 6;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (word) {
      const normalizedWord = word.toLowerCase();
      setCorrectWord(normalizedWord);
      setDisplayWord(normalizedWord.replace(/[a-zA-Zآ-ی]/g, '_').replace(/-/g, '-'));
      setIncorrectGuesses(0);
      setWrongLetters(new Set());
      setShowInputs(true);
      setGameOver(false);
    }
  }, [word]);

  useEffect(() => {
    if (inputRef.current && !gameOver) {
      inputRef.current.focus();
    }
  }, [showInputs, gameOver]);

  const handleFetchWord = async () => {
    if (selectedSubject) {
      try {
        await getWord(selectedSubject, selectedLanguage);
      } catch (err) {
        message.error('Failed to fetch the word. Please try again.');
      }
    } else {
      message.error('Please select subject, difficulty, and language.');
    }
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(event.target.value);
  };


  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value as 'English' | 'Persian');
  };

  const handleGuess = (letter: string) => {
    if (gameOver || !letter || letter.length !== 1 || !/^[a-zA-Zآ-ی]+$/.test(letter)) return;

    const normalizedLetter = letter.toLowerCase();

    if (correctWord.includes(normalizedLetter)) {
      const updatedDisplayWord = displayWord.split('').map((char, index) => 
        correctWord[index] === normalizedLetter ? normalizedLetter : char
      ).join('');
      setDisplayWord(updatedDisplayWord);

      if (!updatedDisplayWord.includes('_')) {
        message.success('Congratulations! You guessed the word correctly.');
        setGameOver(true);
      }
    } else {
      if (!wrongLetters.has(normalizedLetter)) {
        setWrongLetters(new Set(wrongLetters.add(normalizedLetter)));
        setIncorrectGuesses(incorrectGuesses + 1);

        if (incorrectGuesses + 1 >= maxWrongGuesses) {
          message.error(`Game Over! The word was: ${correctWord.replace(/-/g, ' ')}`);
          setGameOver(true);
        }
      }
    }
  };

  const handleNewGame = () => {
    setSelectedSubject('');
    setSelectedLanguage('English');
    setShowInputs(false);
    setCorrectWord('');
    setDisplayWord('');
    setIncorrectGuesses(0);
    setWrongLetters(new Set());
    setGameOver(false);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const guess = (form.elements.namedItem('guess') as HTMLInputElement).value.toLowerCase();
    handleGuess(guess);
    form.reset();
  };

  const isPersian = i18n.language === 'fa';

  return (
    <div className={`min-h-screen text-white flex flex-col items-center justify-center p-6 font-Yekan select-none
    ${themes === "PINK" ? "bg-themePink text-black" : ""}
    ${themes === "DARK" ? "bg-themeDark text-white" : ""}
    ${themes === "BLUE" ? "bg-themeBlue text-white" : ""}
    ${themes === "PURPLE" ? "bg-themePurple text-white" : ""}
    `}>
      <Link to={"/"} className='text-2xl mb-10 underline'>{t('Home')}</Link>
      <div dir={isPersian ? "rtl" : "ltr"} className="p-8 max-w-md w-full">
        {!showInputs ? (
          <>
            <div className="mb-4">
              <label className="block text-xl mb-2">{t('subject')}</label>
              <select
                value={selectedSubject}
                onChange={handleSubjectChange}
                className={`px-4 py-2 w-full text-lg
                  ${themes === "PINK" ? "bg-gray-300 text-black" : ""}
                  ${themes === "DARK" ? "bg-gray-700 text-white" : ""}
                  ${themes === "BLUE" ? "bg-gray-300 text-black" : ""}
                  ${themes === "PURPLE" ? "bg-gray-600 text-white" : ""}
                  
                  `}
              >
                <option value="">{t('selectSubject')}</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject} className='text-xl'>{subject}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-xl mb-2">{t('language')}</label>
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className={`px-4 py-2 w-full text-lg
                  ${themes === "PINK" ? "bg-gray-300 text-black" : ""}
                  ${themes === "DARK" ? "bg-gray-700 text-white" : ""}
                  ${themes === "BLUE" ? "bg-gray-300 text-black" : ""}
                  ${themes === "PURPLE" ? "bg-gray-600 text-white" : ""}
                  `}
              >
                <option value="English">{t('English')}</option>
                <option value="Persian">{t('Persian')}</option>
              </select>
            </div>
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition duration-300 text-2xl"
              onClick={handleFetchWord}
              disabled={loading}
            >
              {loading ? isPersian ? 'لودینگ' : "loading..." : isPersian ? 'شروع' : "Start"}
            </button>
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
          </>
        ) : (
          <>
            {correctWord && (
              <>
                <div className="flex justify-center items-center mb-8 flex-wrap">
                  <h1 className="text-3xl">
                    {selectedSubject === "cars" && isPersian ? "ماشین‌ها" :
                    selectedSubject === "countries" && isPersian ? "کشورها" :
                    selectedSubject === "colors" && isPersian ? "رنگ‌ها" :
                    selectedSubject === "animals" && isPersian ? "حیوانات" :
                    selectedSubject === "technology" && isPersian ? "فناوری" :
                    selectedSubject === "cars" ? "Cars" :
                    selectedSubject === "countries" ? "Countries" :
                    selectedSubject === "colors" ? "Colors" :
                    selectedSubject === "animals" ? "Animals" :
                    selectedSubject === "technology" ? "Technology" :
                    "Select Subject"}
                  </h1>
                </div>
                <div className='mb-6 text-center'>
                  <div className={`flex justify-center px-5 flex-wrap`} dir={isPersian ? 'rtl' : 'ltr'}>
                    {displayWord.split('').map((letter, index) => (
                      <span key={index} className="text-3xl mx-1 uppercase tracking-tighter">
                        {letter}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4 text-center">
                  <h1 dir={isPersian ? 'rtl' : 'ltr'} className='text-3xl'>{isPersian ? "حروف اشتباه :" : "Wrong Letters : "}</h1>
                  <div className="text-3xl uppercase text-red-400">
                    {Array.from(wrongLetters).join(' - ')}
                  </div>
                </div>
                <form onSubmit={handleFormSubmit}>
                  <input
                    type="text"
                    name="guess"
                    ref={inputRef} // Attach the ref to the input
                    className={`w-full px-4 py-2 mb-4 bg-gray-700 border border-gray-600 text-gray-300 text-xl self-center uppercase outline-none ${isPersian ? 'rtl' : ''}`}
                    placeholder={isPersian ? "حرف را وارد کن" : "Enter a letter"}
                    maxLength={1}
                    disabled={gameOver}
                    autoComplete='off'
                    dir={isPersian ? 'rtl' : 'ltr'}
                  />
                  <button
                    type='submit'
                    className={`w-full py-1.5 ${gameOver ? 'bg-gray-500' : 'bg-green-600'} text-white text-2xl hover:${gameOver ? 'bg-gray-500' : 'bg-green-900'} transition duration-300`}
                    disabled={gameOver}
                  >
                    {isPersian ? "ثبت" : "Submit"}
                  </button>
                </form>
                <button
                  onClick={handleNewGame}
                  className="w-full py-1.5 bg-red-600 text-white text-2xl hover:bg-red-700 transition duration-300 mt-4"
                >
                  {isPersian ? "بازی جدید" : "New Game"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GuWord;
