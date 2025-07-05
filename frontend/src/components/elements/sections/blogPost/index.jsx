import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../../../common/i18n';
import ChevronDown from '../../../../assets/svg/chevron.down.svg';
import { Link, useLocation } from 'react-router-dom';

const BlogPostItem = () => {
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

    const isActiveRoute = ['/logistics', '/hr', '/finance'].includes(location.pathname);

    return (
        <div className={`Item-Group ${isOpen ? 'active' : ''}`} ref={popupRef}>
            <div className={`Nav-Item Item ${isActiveRoute ? 'active' : ''}`} onClick={togglePopup}>
                <div className='Main-Text-Accessibility'>{translations.blogPostItem}</div>
                <img
                    src={ChevronDown}
                    className={`Chevron-Icon ${isOpen ? 'rotate' : ''}`}
                    alt="Chevron"
                />
            </div>

            {isOpen && (
                <div className="Main-Popup Main-Popup-Center">
                    <div className={`Popup-Item ${location.pathname === '/logistics' ? 'active' : ''}`}>
                        <Link to="/logistics" className='Link'>
                            <p className='link-text'>{translations.logistics}</p>
                        </Link>
                    </div>
                    <div className={`Popup-Item ${location.pathname === '/hr' ? 'active' : ''}`}>
                        <Link to="/hr" className='Link'>
                            <p className='link-text'>{translations.humanResources}</p>
                        </Link>
                    </div>
                    <div className={`Popup-Item ${location.pathname === '/finance' ? 'active' : ''}`}>
                        <Link to="/finance" className='Link'>
                            <p className='link-text'>{translations.finance}</p>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogPostItem;