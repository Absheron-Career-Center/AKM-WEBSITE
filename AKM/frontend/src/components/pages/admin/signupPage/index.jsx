import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../../../elements/admin/signupForm/index';

const SignupPage = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <br />
            <br />
            <br />
            <br />
            <br /><br /><br /><br />
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link 
                            to="/login" 
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
                
                <div className="mt-8">
                    <SignupForm />
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>
                        By signing up, you agree to our{' '}
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;