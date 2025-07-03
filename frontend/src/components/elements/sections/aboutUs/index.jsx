import React from 'react'
import { useLanguage } from '../../../../common/i18n';
import { Link } from 'react-router-dom';
const AboutUsItem = () => {
    const { translations } = useLanguage();

    return (
        <div className='Main-Text-Accessibility'>
            <Link to="/about">{translations.aboutUsItem}</Link>
        </div>
    )
}

export default AboutUsItem