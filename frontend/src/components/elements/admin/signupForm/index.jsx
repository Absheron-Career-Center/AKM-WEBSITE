import React, { useState } from 'react';
import VerifyForm from '../verifyForm';
import LoginForm from '../loginForm'; // We'll create this component

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
      
        <form onSubmit={handleSubmit}>
              <br />
                <br />
            <h2>Signup</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
                <label>Phone Number:</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={e => {
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, phoneNumber: value });
                    }}
                    maxLength={9}
                    placeholder="0551234567"
                    required
                />
            </div>
            <div>
                <label>Address:</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div>
                <label>Job Name:</label>
                <input type="text" name="jobName" value={formData.jobName} onChange={handleChange} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default SignupForm;