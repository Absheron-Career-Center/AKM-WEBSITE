import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../../../common/i18n';
import ChevronDown from '../../../../assets/svg/chevron.down.svg';
import { Link, useLocation } from 'react-router-dom';

const ActivitiesItem = () => {
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

    const isActiveRoute = ['/exhibitions', '/events'].includes(location.pathname);

    return (
        <div className={`Item-Group ${isOpen ? 'active' : ''}`} ref={popupRef}>
            <div className={`Nav-Item Item ${isActiveRoute ? 'active' : ''} animated-3`} onClick={togglePopup}>
                <div className='Main-Text-Accessibility'>{translations.activitiesItem}</div>
                <img
                    src={ChevronDown}
                    className={`Chevron-Icon ${isOpen ? 'rotate' : ''}`}
                    alt="Chevron"
                />
            </div>

            {isOpen && (
                <div className="Main-Popup Main-Popup-Center">
                    <div className={`Popup-Item ${location.pathname === '/exhibitions' ? 'active' : ''}`}>
                        <Link to="/exhibitions" className='Link'>
                            <p className='link-text'>{translations.exhibitions}</p>
                        </Link>
                    </div>
                    <div className={`Popup-Item ${location.pathname === '/events' ? 'active' : ''}`}>
                        <Link to="/events" className='Link'>
                            <p className='link-text'>{translations.events}</p>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivitiesItem;