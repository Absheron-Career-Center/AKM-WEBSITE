// import React from 'react'

// const MainButton = () => {
//     return (
//         <div className="Main-Button">
//             <p className='Main-Text-Accessibility-Button'>Sign up</p>
//         </div>
//     )
// }

// export default MainButton


import React from 'react';
import { Link } from 'react-router-dom';

const MainButton = ({ isAuthenticated, onLogout }) => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const isAdmin = ['admin', 'master-admin'].includes(userData?.role);
    const isRegularUser = isAuthenticated && !isAdmin;

    return (
        <nav>



            <ul>
                {isAuthenticated && isAdmin && (
                    <li>
                        <Link to="/admin">
                            Admin Panel
                        </Link>
                    </li>
                )}


                {isRegularUser && (
                    <li>
                        <Link to="/user" >
                            My Profile
                        </Link>
                    </li>
                )}

                {isAuthenticated ? (


                    <div className="Main-Button" onClick={onLogout}>
                        Sign Out
                    </div>



                ) : (

                    <div className="Main-Button">
                        <Link to="/signup"><p className='Main-Text-Accessibility-Button'>Sign up</p></Link>
                    </div>

                )}
            </ul>
        </nav>
    );
};

export default MainButton;
