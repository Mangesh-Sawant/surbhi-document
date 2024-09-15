// src/components/Auth/ForgotPassword/ForgotPassword.js
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../Auth/firebase';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent. Check your inbox.');
            setError('');
        } catch (error) {
            setError('Failed to send password reset email. Please try again.');
            setMessage('');
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="bg-[#E9EFEC] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#16423C]">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-[#16423C] mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-[#C4DAD2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6A9C89]"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#6A9C89] text-white py-2 px-4 rounded-md hover:bg-[#16423C] transition duration-300 mb-4"
                    >
                        Send Reset Email
                    </button>
                </form>
                <button
                    onClick={handleBackToLogin}
                    className="w-full bg-[#16423C] text-white py-2 px-4 rounded-md hover:bg-[#6A9C89] transition duration-300"
                >
                    Back to Login
                </button>
                {message && <p className="mt-4 text-green-600">{message}</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;