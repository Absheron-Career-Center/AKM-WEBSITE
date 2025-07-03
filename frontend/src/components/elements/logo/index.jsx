import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../../assets/favicon/icon.svg';
import LogoWomanDay from '../../../assets/favicon/WomanDay.png';
import LogoKidDay from '../../../assets/favicon/KidDay.png';
import '../../../common/style/root.css';

const LogoMark = () => {
  const today = new Date();
  const month = today.getMonth(); 
  const day = today.getDate();

  let activeLogo = Logo;
  let extraClass = '';

  // Woman's Day: March 3–11
  if (month === 2 && day >= 3 && day <= 11) {
    activeLogo = LogoWomanDay;
    extraClass = 'Logo-Mark'; 
  }

  // Kid's Day: May 28–June 5
  else if ((month === 4 && day >= 28) || (month === 5 && day <= 5)) {
    activeLogo = LogoKidDay;
    extraClass = 'Logo-Mark'; 
  }

  return (
    <Link to='/'>
      <img
        src={activeLogo}
        className={extraClass} 
      />
    </Link>
  );
};

export default LogoMark;