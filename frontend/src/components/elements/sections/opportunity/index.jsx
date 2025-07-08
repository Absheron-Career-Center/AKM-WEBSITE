import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../../../common/i18n';
import ChevronDown from '../../../../assets/svg/chevron.down.svg';
import { Link, useLocation } from 'react-router-dom';

const OpportunityItem = () => {
    const { translations } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef(null);
    const location = useLocation();

    const togglePopup = () => setIsOpen(prev => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActiveRoute = ['/vacancy', '/scholarship', '/internship'].includes(location.pathname);

    return (
        <div className={`Item-Group ${isOpen ? 'active' : ''}`} ref={popupRef}>
            <div className={`Nav-Item Item ${isActiveRoute ? 'active' : ''} animated-2`} onClick={togglePopup}>
                <div className='Main-Text-Accessibility'>{translations.opportunityItem}</div>
                <img 
                    src={ChevronDown} 
                    className={`Chevron-Icon ${isOpen ? 'rotate' : ''}`} 
                    alt="Chevron" 
                />
            </div>

            {isOpen && (
                <div className="Main-Popup Main-Popup-Center">
                    <div className={`Popup-Item ${location.pathname === '/vacancy' ? 'active' : ''}`}>
                        <Link to="/vacancy" className='Link'>
                            <p className='link-text'>{translations.vacancy}</p>
                        </Link>
                    </div>
                    <div className={`Popup-Item ${location.pathname === '/scholarship' ? 'active' : ''}`}>
                        <Link to="/scholarship" className='Link'>
                            <p className='link-text'>{translations.scholarshipProgram}</p>
                        </Link>
                    </div>
                    <div className={`Popup-Item ${location.pathname === '/internship' ? 'active' : ''}`}>
                        <Link to="/internship" className='Link'>
                            <p className='link-text'>{translations.internshipProgram}</p>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OpportunityItem;