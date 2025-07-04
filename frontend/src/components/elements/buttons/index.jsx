import React from 'react';
import { Link } from 'react-router-dom';

const MainButton = ({ isAuthenticated, onLogout }) => {
    return (
        <>
            {isAuthenticated ? (
                <div className="Main-Button" onClick={onLogout}>
                 <p>Sign out</p>
                </div>
            ) : (
                <Link to="/signup" className="Main-Button">
                    <p>Sign up</p>
                </Link>
            )}
        </>
    );
};

export default MainButton;