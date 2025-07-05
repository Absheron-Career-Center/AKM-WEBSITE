import React, { useState, useRef, useEffect } from 'react';
import LanguageIcon from '../../../../assets/svg/globe.svg';
import languageData from '../../../../common/utils/languageData';
import { useLanguage } from '../../../../common/i18n';

const LanguageTicker = () => {
  const { language, setLanguage, translations } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  const handleChange = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const togglePopup = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="Ticker-Group Ticker-Language" ref={popupRef}>
      <div className="Ticker-trigger" onClick={togglePopup}>
        <img
          src={LanguageIcon}
          className={`No-Select ${isOpen ? 'active-icon' : ''}`}
        />


      </div>

{isOpen && (
  <div className="Main-Popup Main-Popup-Right">
    <div
      className={`Popup-Item ${language === 'en' ? 'active' : ''} link-text`}
      onClick={() => handleChange('en')}
    >
      {translations.englishLan}
    </div>
    <div
      className={`Popup-Item ${language === 'tr' ? 'active' : ''} link-text`}
      onClick={() => handleChange('tr')}
    >
      {translations.turkishLan}
    </div>
    <div
      className={`Popup-Item ${language === 'ru' ? 'active' : ''} link-text`}
      onClick={() => handleChange('ru')}
    >
      {translations.russianLan}
    </div>
    <div
      className={`Popup-Item ${language === 'az' ? 'active' : ''} link-text`}
      onClick={() => handleChange('az')}
    >
      {translations.azerbaijaniLan}
    </div>
    <div
      className={`Popup-Item ${language === 'es' ? 'active' : ''} link-text`}
      onClick={() => handleChange('es')}
    >
      {translations.spanishLan}
    </div>
    <div
      className={`Popup-Item ${language === 'zh' ? 'active' : ''} link-text`}
      onClick={() => handleChange('zh')}
    >
      {translations.chineseLan}
    </div>
    <div
      className={`Popup-Item ${language === 'de' ? 'active' : ''} link-text`}
      onClick={() => handleChange('de')}
    >
      {translations.germanLan}
    </div>
    <div
      className={`Popup-Item ${language === 'fr' ? 'active' : ''} link-text`}
      onClick={() => handleChange('fr')}
    >
      {translations.frenchLan}
    </div>
  </div>
)}


    </div>
  );
};

export default LanguageTicker;