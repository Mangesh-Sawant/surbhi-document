// src/components/Header/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../Auth/firebase.js';
import logo from "../../assets/surbhi-document-store-high-logo-transparent.png";

const Header = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <header className="bg-[#E9EFEC] shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="transition duration-300">
                    <div className="px-4 py-8">
                        <img src={logo} alt="Surbhi Document Store" className="w-48"/>
                    </div>
                </Link>
                <nav className="px-4">
                    <ul className="flex items-center space-x-4">
                        {user && (
                            <li className="text-[#16423C] mr-4">
                                Welcome, {user.displayName || 'User'}
                                {user.contact}
                            </li>
                        )}
                        <li>
                            <button
                                onClick={handleLogout}
                                className="bg-[#C4DAD2] text-[#16423C] px-4 py-2 rounded hover:bg-[#6A9C89] hover:text-[#E9EFEC] transition duration-300"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;