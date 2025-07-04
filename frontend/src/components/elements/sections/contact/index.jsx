import React from 'react'
import { useLanguage } from '../../../../common/i18n';
import { Link } from 'react-router-dom';

const ContactItem = () => {
  const { translations } = useLanguage();
  return (
    <div className='Main-Text-Accessibility'>
      <Link to="/contact" className='Link'>{translations.contactItem}</Link></div>
  )
}

export default ContactItem