import React from 'react';
import VacancyTickerIcon from '../../../../assets/svg/suitcase.svg';
import { useLanguage } from '../../../../common/i18n'; 

const VacancyTicker = () => {
  const { translations } = useLanguage();

  return (
    <div className="Ticker-Group Ticker-Vacancy">
      <img src={VacancyTickerIcon} className="No-Select" />
      <p>IT Helpdesk (Texnik) VAKANSİYA</p>
    </div>
  );
};

export default VacancyTicker;
