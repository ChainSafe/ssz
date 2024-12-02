import React, { useState, useEffect } from "react";

const setDark = () => {
  document.documentElement.setAttribute("data-theme", "dark");
};

const setLight = () => {
  document.documentElement.setAttribute("data-theme", "light");
};

const prefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const DarkMode = () => {
  const [darkMode, setDarkMode] = useState(prefersDark);

  useEffect(() => {
    if (darkMode) {
      setDark();
    } else {
      setLight();
    }
  }, [darkMode]);

  const toggleTheme = (isDarkMode: boolean) => {
    setDarkMode(isDarkMode);
  };

  return (
    <div className="toggle-theme-wrapper">
      {darkMode ? (
        <span onClick={() => toggleTheme(false)} style={{ cursor: "pointer" }}>
          <svg fill="white" viewBox="0 0 24 24" height="20px" width="20px">
            <path
              fill="white"
              fillRule="evenodd"
              d="M12 16a4 4 0 100-8 4 4 0 000 8zm0 2a6 6 0 100-12 6 6 0 000 12zM11 0h2v4.062a8.079 8.079 0 00-2 0V0zM7.094 5.68L4.222 2.808 2.808 4.222 5.68 7.094A8.048 8.048 0 017.094 5.68zM4.062 11H0v2h4.062a8.079 8.079 0 010-2zm1.618 5.906l-2.872 2.872 1.414 1.414 2.872-2.872a8.048 8.048 0 01-1.414-1.414zM11 19.938V24h2v-4.062a8.069 8.069 0 01-2 0zm5.906-1.618l2.872 2.872 1.414-1.414-2.872-2.872a8.048 8.048 0 01-1.414 1.414zM19.938 13H24v-2h-4.062a8.069 8.069 0 010 2zM18.32 7.094l2.872-2.872-1.414-1.414-2.872 2.872c.528.41 1.003.886 1.414 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      ) : (
        <span onClick={() => toggleTheme(true)} style={{ cursor: "pointer" }}>
          <svg viewBox="0 0 21 21" fill="black" height="20px" width="20px">
            <path
              fill="black"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.5 3.5c1.328 0 2.57.37 3.628 1.012a6 6 0 00-.001 11.977A7 7 0 1111.5 3.5z"
            />
          </svg>
        </span>
      )}
    </div>
  );
};

export default DarkMode;
