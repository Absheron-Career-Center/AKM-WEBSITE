import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EyeSlashSvg from '../../../../assets/svg/eye.slash.svg';
import EyeSvg from '../../../../assets/svg/eye.svg';
import FormImg from '../../../../assets/image/form.png';

const LoginForm = ({ onLogin = () => { } }) => {  // Default empty function
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        isAdmin: false
    });
    const [error, setError] = useState('');
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

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
                    isAdmin: formData.isAdmin
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (!formData.isAdmin || !data.message.includes('verify your email')) {
                    throw new Error(data.message || 'Login failed');
                }
            }

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
        <div className="Form-Section">
            <form onSubmit={handleSubmit} className="Form">
                <div className="form-header">
                    <p>{isAdminLogin ? 'Admin Login' : 'Login'}</p>
                </div>
                <div className="form-text">
                    {error && <p>{error}</p>}
                </div>
                <div className="form-group animated-1">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Email:"
                    />
                </div>

                <div className="form-group animated-2">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Password:"
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <img src={EyeSlashSvg} alt="Hide password" />
                        ) : (
                            <img src={EyeSvg} alt="Show password" />
                        )}
                    </button>
                </div>

                <input
                    type="hidden"
                    name="isAdmin"
                    value={formData.isAdmin}
                />

                <button
                    type="submit"
                    className="Main-Button"
                    disabled={isLoading}
                >
                    <p>{isLoading ? 'Logging in...' : 'Login'}</p>
                </button>

                <div className="form-footer">
                    <p>Don't have an account?</p>
                    <Link to="/signup" className="login-link">Sign up here</Link>
                </div>

                <button
                    type="button"
                    onClick={toggleAdminLogin}
                    className="Default-Button Default-Button-Link"
                >
                    <p>{isAdminLogin ? 'Switch to user login' : 'Switch to admin login'}</p>
                </button>
            </form>
            <img src={FormImg} className='Form-Image No-Select' alt="Form illustration" />
        </div>
    );
};

export default LoginForm;