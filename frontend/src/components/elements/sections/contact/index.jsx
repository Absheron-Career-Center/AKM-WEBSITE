import React from 'react';
import { useLanguage } from '../../../../common/i18n';
import { Link, useLocation } from 'react-router-dom';

const ContactItem = () => {
  const { translations } = useLanguage();
  const location = useLocation();

  return (
    <div className={`Item ${location.pathname === '/contact' ? 'active' : ''}`}>
      <Link to="/contact" className='Link'>
        {translations.contactItem}
      </Link>
    </div>
  );
};

export default ContactItem;