import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignupPage from '../../components/pages/admin/signupPage/index.jsx';
import LoginPage from '../../components/pages/admin/loginPage/index.jsx';
import AdminPage from '../../components/pages/admin/adminPage/index.jsx';
import UserPanel from '../../components/pages/admin/userPage/index.jsx';
import AboutUs from '../../components/pages/aboutUs/index.jsx';
import { useState } from 'react';
import Navbar from '../../components/layout/navbar/index.jsx';
import Vacancy from '../../components/pages/career/vacancy/index.jsx';
import Internship from '../../components/pages/career/internship/index.jsx';
import Scholarship from '../../components/pages/career/scholarship/index.jsx';
import Exhibitions from '../../components/pages/activity/exhibition/index.jsx';
import Events from '../../components/pages/activity/event/index.jsx';
import HR from '../../components/pages/blog/hr/index.jsx';
import Finance from '../../components/pages/blog/finance/index.jsx';
import Logistic from '../../components/pages/blog/logistic/index.jsx';
import Contact from '../../components/pages/contact/index.jsx';
import Home from '../../components/pages/home/index.jsx';
import Error from '../../components/pages/error/index.jsx';

function AppRoutes() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('authToken')
    );

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    };

    return (
        <Router>
            <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<Error />} />
                <Route path="/signup" element={<SignupPage onSuccess={handleLogin} />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/admin" /> : <LoginPage onLogin={handleLogin} />} />
                <Route path="/admin" element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" />} />
                <Route path="/user" element={isAuthenticated ? <UserPanel /> : <Navigate to="/login" />} />

                <Route path="/about" element={<AboutUs />} />
                <Route path="/vacancy" element={<Vacancy />} />
                <Route path="/internship" element={<Internship />} />
                <Route path="/scholarship" element={<Scholarship />} />
                <Route path="/exhibitions" element={<Exhibitions />} />
                <Route path="/events" element={<Events />} />
                <Route path="/hr" element={<HR />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/logistic" element={<Logistic />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
