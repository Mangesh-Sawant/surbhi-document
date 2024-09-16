// src/components/Header/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../Auth/firebase.js';
import logo from "../../assets/surbhi-document-store-high-logo-transparent.png";
import profileImage from "../../assets/default-profile-image.avif";

const Header = ({ user }) => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <header className="bg-[#E9EFEC] shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <Link to="/dashboard" className="transition duration-300">
                    <img src={logo} alt="Surbhi Document Store" className="w-48"/>
                </Link>
                <nav className="flex items-center">
                    {user && (
                        <div className="relative">
                            <img
                                src={user.photoURL || profileImage}
                                alt="Profile"
                                className="w-10 h-10 rounded-full cursor-pointer"
                                onClick={toggleDropdown}
                            />
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <p className="px-4 py-2 text-sm text-gray-700 capitalize">
                                        Hello  {user.displayName || 'User'}
                                    </p>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-400 block w-full text-left px-4 py-2 text-sm text-white hover:bg-red-300"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;