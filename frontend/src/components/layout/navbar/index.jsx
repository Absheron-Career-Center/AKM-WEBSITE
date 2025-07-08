import React, { useEffect, useState } from 'react';
import '../../../common/style/root.css';
import MainButton from '../../elements/buttons';
import CallTicker from '../../elements/tickers/call';
import NewsTicker from '../../elements/tickers/news';
import VacancyTicker from '../../elements/tickers/vacancy';
import LanguageTicker from '../../elements/tickers/language';
import ThemeTicker from '../../elements/tickers/theme';
import LogoMark from '../../elements/logo';
import AboutUsItem from '../../elements/sections/aboutUs';
import OpportunityItem from '../../elements/sections/opportunity';
import ActivitiesItem from '../../elements/sections/activities';
import BlogPostItem from '../../elements/sections/blogPost';
import ContactItem from '../../elements/sections/contact';
import OpenNavbar from '../../../assets/svg/open.svg';
import CloseNavbar from '../../../assets/svg/close.svg';
import { Link } from 'react-router';
import MailTicker from '../../elements/tickers/mail';

const Navbar = ({ isAuthenticated, onLogout }) => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const isAdmin = ['admin', 'master-admin'].includes(userData?.role);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div>
            <div className="Navbar-Group">
                <div className={`Secondary-Navbar ${scrolled ? 'Hidden-Secondary' : ''}`}>
                    <div className="Nav-Secondary-First-Section">
                        <CallTicker />
                        <MailTicker />
                        <NewsTicker />
                        <VacancyTicker />
                    </div>

                    <div className="Nav-Secondary-Last-Section">
                        <LanguageTicker />
                        <ThemeTicker />
                    </div>

                    <div className="hr Nav-hr"></div>
                </div>

                <div className={`Primary-Navbar ${scrolled ? 'Scrolled' : ''}`}>
                    <div className="Nav-Primary-First-Section">
                        <LogoMark />
                    </div>

                    <div className="Hamburger-Menu NoSection" onClick={toggleMenu}>
                        <img
                            src={menuOpen ? CloseNavbar : OpenNavbar}
                            className="Hamburger-Icon"
                            alt="Menu"
                        />
                    </div>

                    <div className={`Nav-Primary-Last-Section ${menuOpen ? 'Open' : ''}`}>
                        <AboutUsItem />
                        <OpportunityItem />
                        <ActivitiesItem />
                        <BlogPostItem />
                        <ContactItem />
                        
           
                        {isAuthenticated && (
                            <>
                                {isAdmin ? (
                                    <Link to="/admin" className="Link animated-6">
                                        <p>Admin panel</p>
                                    </Link>
                                ) : (
                                    <Link to="/user" className="Link animated-6">
                                      <p>My profile</p>
                                    </Link>
                                )}
                            </>
                        )}
                        
                        <MainButton isAuthenticated={isAuthenticated} onLogout={onLogout} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;