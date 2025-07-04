import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormImg from '../../../../assets/image/form.png';
const VerifyForm = ({ signupData }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');


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
            <div className="">
                <div className="">
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
        <div className="Form-Section">
            <form onSubmit={handleSubmit} className="Form">

                <div className="form-header">
                    <p>Verify your email</p>
                </div>

                <div className="form-text">
                    <p>
                        We've sent a 6-digit verification code to <span className="Color-Primary">{signupData.email}</span>
                    </p>

                    <p>Check your email for the verification code</p>
                
                {error && (
                   
                        <p>{error}</p>
                 
                )}
</div>

                <div className="form-group animated-1">

                    <label htmlFor="code"></label>
                    <input
                        id="code"
                        name="code"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        required
                        className="form-input"
                        placeholder="Enter 6-digit code"
                        value={code}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setCode(value.slice(0, 6));
                        }}
                        autoComplete="one-time-code"
                        autoFocus
                    />


                </div>


                <button
                    type="submit"
                    disabled={isLoading || code.length !== 6}
                    className={`Main-Button ${(isLoading || code.length !== 6) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isLoading ? (
                        <>
                            <p>Verifying...</p>
                        </>
                    ) : (
                        <p>Verify</p>
                    )}
                </button>







                <div className="form-footer">

                    <p >Didn't receive a code?</p>




                    <button
                        type="button"
                        className="Default-Button"
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
                </div>

            </form>
             <img src={FormImg} className='Form-Image No-Select' />
        </div>

    );
};

export default VerifyForm;