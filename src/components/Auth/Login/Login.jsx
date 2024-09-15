// src/components/Auth/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Lottie from "lottie-react";
import runningManAnimation from '../../../assets/Animation - 1726407035077.json'; // Adjust the path as needed

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-center bg-primary-lightest">
            <div className="w-full md:w-1/2 p-8">
                <Lottie
                    animationData={runningManAnimation}
                    loop={true}
                    style={{width: '100%', maxWidth: '400px', margin: '0 auto'}}
                />
            </div>
            <div className="w-full md:w-1/2 max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-primary-dark mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-primary-dark mb-2">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-primary-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-primary-dark mb-2">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-primary-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition duration-300"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center space-y-2">
                    <Link to="/forgot-password" className="block text-primary hover:text-primary-dark transition duration-300">
                        Forgot Password?
                    </Link>
                    <Link to="/signup" className="block text-primary hover:text-primary-dark transition duration-300">
                        Don't have an account? Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;