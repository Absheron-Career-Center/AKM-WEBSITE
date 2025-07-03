import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        isAdmin: false // Add this field
    });
    const [error, setError] = useState('');
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const toggleAdminLogin = () => {
        setIsAdminLogin(!isAdminLogin);
        setFormData(prev => ({ ...prev, isAdmin: !prev.isAdmin }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const endpoint = formData.isAdmin 
                ? 'http://localhost:8080/api/admin/login' 
                : 'http://localhost:8080/api/users/login';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    isAdmin: formData.isAdmin // Send this flag to backend
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Skip verification error for admin logins
                if (!formData.isAdmin || !data.message.includes('verify your email')) {
                    throw new Error(data.message || 'Login failed');
                }
            }

            // Force verified status for admins
            const userData = {
                ...data.user,
                role: formData.isAdmin ? 'admin' : data.user.role || 'user',
                isVerified: formData.isAdmin ? true : data.user.isVerified
            };

            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(userData));
            onLogin();
            window.location.href = formData.isAdmin ? '/admin' : '/';

        } catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>{isAdminLogin ? 'Admin Login' : 'User Login'}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        className="form-control"
                    />
                </div>
                
                <div className="form-group">
                    <label>Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        className="form-control"
                    />
                </div>
                
                <input 
                    type="hidden" 
                    name="isAdmin" 
                    value={formData.isAdmin}
                />
                
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            
            <div className="login-options mt-3">
                <button 
                    onClick={toggleAdminLogin} // Use the new toggle function
                    className="btn btn-link"
                >
                    {isAdminLogin ? 'Switch to User Login' : 'Switch to Admin Login'}
                </button>
                
                <p className="mt-2">
                    Don't have an account? <Link to="/signup">Sign up here</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;