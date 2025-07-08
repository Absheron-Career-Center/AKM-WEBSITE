import React, { useState } from 'react';
import VerifyForm from '../verifyForm';
import LoginForm from '../loginForm';
import { Link } from 'react-router-dom';
import FormImg from '../../../../assets/image/form.png';
import EyeSlashSvg from '../../../../assets/svg/eye.slash.svg';
import EyeSvg from '../../../../assets/svg/eye.svg';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        address: '',
        jobName: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showVerify, setShowVerify] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [signupData, setSignupData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Verification code sent! Please check your email.');
                setSignupData({ ...formData });
                setShowVerify(true);
            } else {
                setError(data.message ? `${data.message}${data.error ? ': ' + data.error : ''}` : 'Signup failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    const handleVerificationSuccess = () => {
        setShowVerify(false);
        setShowLogin(true);
    };

    if (showVerify && signupData) {
        return <VerifyForm signupData={signupData} onSuccess={handleVerificationSuccess} />;
    }

    if (showLogin) {
        return <LoginForm initialEmail={formData.email} />;
    }

    return (
        <div className="Form-Section">
            <form onSubmit={handleSubmit} className="Form" noValidate>
                <div className="form-header">
                    <p>Sign up a form</p>
                </div>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <div className="form-group animated-1">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Full name:"
                        required
                    />
                </div>

                <div className="form-group animated-2">
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={e => {
                            const value = e.target.value.replace(/\D/g, '');
                            setFormData({ ...formData, phoneNumber: value });
                        }}
                        className="form-input"
                        maxLength={9}
                        placeholder="Number: (+994)"
                        required
                        
                    />
                </div>

                <div className="form-group animated-3">
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Address:"
                        required
                    />
                </div>

                <div className="form-group animated-4">
                    <input
                        type="text"
                        name="jobName"
                        value={formData.jobName}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Profession:"
                        required
                    />
                </div>

                <div className="form-group animated-5">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Email:"
                        required
                    />
                </div>

                <div className="form-group animated-6">
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

                <button type="submit" className="Main-Button">
                    <p>Sign up</p>
                </button>

                <div className="form-footer">
                    <p>Already have an account?</p>
                    <Link to="/login" className="login-link">
                        Sign in here
                    </Link>
                </div>
            </form>
            <img src={FormImg} className='Form-Image No-Select' />
        </div>

    );
};

export default SignupForm;