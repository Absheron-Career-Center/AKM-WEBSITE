import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../../../common/i18n';
import ChevronDown from '../../../../assets/svg/chevron.down.svg';
import { Link } from 'react-router-dom';

const BlogPostItem = () => {
    const { translations } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef(null);

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

    return (
        <div className={`Item-Group ${isOpen ? 'active' : ''}`} ref={popupRef}>
            <div className="Nav-Item" onClick={togglePopup}>
                <div className='Main-Text-Accessibility'>{translations.blogPostItem}</div>
                <img
                    src={ChevronDown}
                    className={`Chevron-Icon ${isOpen ? 'rotate' : ''}`}
                    alt="Chevron"
                />
            </div>

            {isOpen && (
                <div className="Main-Popup Main-Popup-Center">
                    <div className='Popup-Item'>
                        <Link to="/logistics"><p className='Main-Text-Accessibility'>{translations.logistics}</p></Link>
                    </div>
                    <div className='Popup-Item'>
                        <Link to="/hr"><p className='Main-Text-Accessibility'>{translations.humanResources}</p></Link>
                    </div>
                    <div className='Popup-Item'>
                        <Link to="/finance"><p className='Main-Text-Accessibility'>{translations.finance}</p></Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogPostItem;
