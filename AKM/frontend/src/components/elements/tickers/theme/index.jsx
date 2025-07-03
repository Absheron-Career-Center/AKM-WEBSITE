import React, { useState, useRef, useEffect } from 'react';
import ThemeIcon from '../../../../assets/svg/moon.svg';
import { useLanguage } from '../../../../common/i18n';

const ThemeTicker = () => {
  const { translations } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'auto');
  const popupRef = useRef(null);

  const applyTheme = (themeValue) => {
    const root = document.documentElement;
    if (themeValue === 'dark') {
      root.classList.add('dark');
    } else if (themeValue === 'light') {
      root.classList.remove('dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    }
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    applyTheme(selectedTheme);
    setIsOpen(false);
  };

  const togglePopup = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const osThemeListener = () => {
      if (theme === 'auto') {
        applyTheme('auto');
      }
    };
    mediaQuery.addEventListener('change', osThemeListener);
    return () => {
      mediaQuery.removeEventListener('change', osThemeListener);
    };
  }, [theme]);
  

  return (
    <div className="Ticker-Group Ticker-Theme" ref={popupRef}>
      <div className="Ticker-trigger" onClick={togglePopup}>
        <img
          src={ThemeIcon}
          alt="Theme"
          className={`No-Select ${isOpen ? 'active-icon' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="Main-Popup Main-Popup-Right">
          <div
            className={`Popup-Item ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => handleThemeChange('dark')}
          >
            {translations.darkTheme}
          </div>
          <div
            className={`Popup-Item ${theme === 'light' ? 'active' : ''}`}
            onClick={() => handleThemeChange('light')}
          >
            {translations.lightTheme}
          </div>
          <div
            className={`Popup-Item ${theme === 'auto' ? 'active' : ''}`}
            onClick={() => handleThemeChange('auto')}
          >
            {translations.autoTheme}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeTicker;
