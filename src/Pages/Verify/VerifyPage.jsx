import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/customerAPI';

const VerifyPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                const { data } = await authAPI.verifyUser(token);
                setStatus('success');
                setMessage(data.message || 'Account verified successfully!');
                
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. Token may be invalid or expired.');
            }
        };

        if (token) {
            verifyAccount();
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white border border-neutral-200 p-12 text-center">
                {status === 'verifying' && (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neutral-900 mx-auto mb-6"></div>
                        <h2 className="text-xl font-medium text-neutral-900 mb-2">
                            Verifying your account...
                        </h2>
                        <p className="text-sm text-neutral-500">
                            Please wait while we verify your email.
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-medium text-neutral-900 mb-2">
                            Account Verified!
                        </h2>
                        <p className="text-sm text-neutral-500 mb-4">
                            {message}
                        </p>
                        <p className="text-xs text-neutral-400">
                            Redirecting to login page...
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-medium text-neutral-900 mb-2">
                            Verification Failed
                        </h2>
                        <p className="text-sm text-neutral-500 mb-6">
                            {message}
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-neutral-900 text-white py-2.5 font-medium hover:bg-neutral-800"
                            >
                                Go to Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full border border-neutral-300 text-neutral-900 py-2.5 font-medium hover:bg-neutral-50"
                            >
                                Register Again
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyPage;