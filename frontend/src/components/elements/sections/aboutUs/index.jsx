import React from 'react';
import { useLanguage } from '../../../../common/i18n';
import { Link, useLocation } from 'react-router-dom';

const AboutUsItem = () => {
    const { translations } = useLanguage();
    const location = useLocation();

    return (
        <div className={`Item ${location.pathname === '/about' ? 'active' : ''}`}>
            <Link className='Link' to="/about">
                {translations.aboutUsItem}
            </Link>
        </div>
    );
};

export default AboutUsItem;