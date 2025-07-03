import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyForm = ({ signupData }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Enhanced validation
    if (!code.trim() || code.length !== 6) {
        setError('Please enter a valid 6-digit code');
        return;
    }

    if (!signupData?.email) {
        setError('Email information is missing. Please start the signup process again.');
        return;
    }

    setIsLoading(true);

    try {
        const payload = {
            email: signupData.email,
            verificationCode: code
        };

        console.log('Sending verification payload:', payload);

        const response = await fetch('http://localhost:3000/api/users/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log('Verification response:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Verification failed. Server responded with error.');
        }

        setVerificationSuccess(true);
        setTimeout(() => {
            navigate('/login', {
                state: {
                    verifiedEmail: signupData.email,
                    message: 'Email verified successfully! Please log in.'
                }
            });
        }, 1500);
    } catch (err) {
        console.error('Full verification error:', err);
        setError(err.message || 'An unexpected error occurred during verification.');
    } finally {
        setIsLoading(false);
    }
};

    if (verificationSuccess) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
                    <div className="text-green-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Verification Successful!</h2>
                    <p className="text-gray-600">Redirecting to login page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        We've sent a 6-digit verification code to <span className="font-medium">{signupData.email}</span>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                            <input
                                id="code"
                                name="code"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Enter 6-digit code"
                                value={code}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
                                    setCode(value.slice(0, 6)); // Limit to 6 digits
                                }}
                                autoComplete="one-time-code"
                                autoFocus
                            />
                            <p className="mt-1 text-xs text-gray-500">Check your email for the verification code</p>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || code.length !== 6}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                (isLoading || code.length !== 6) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </>
                            ) : (
                                'Verify'
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm text-gray-600">
                    <p>
                        Didn't receive a code?{' '}
                        <button 
                            type="button" 
                            className="font-medium text-blue-600 hover:text-blue-500"
                            onClick={async () => {
                                try {
                                    const response = await fetch('http://localhost:3000/api/users/resend-code', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ email: signupData.email }),
                                    });
                                    const data = await response.json();
                                    if (!response.ok) throw new Error(data.message || 'Failed to resend code');
                                    alert('New verification code sent!');
                                } catch (err) {
                                    setError(err.message || 'Failed to resend code');
                                }
                            }}
                        >
                            Resend code
                        </button>
                    </p>
                    <p className="mt-2">
                        By signing up, you agree to our{' '}
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            Terms of Service
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyForm;