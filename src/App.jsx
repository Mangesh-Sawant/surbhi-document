// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './components/Auth/firebase.js'
import Header from './components/Header/Header.jsx';
import Login from "./components/Auth/Login/Login.jsx";
import SignUp from "./components/Auth/SignUp/SignUp.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword/ForgotPassword.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import UploadDocument from "./components/UploadDocument/UploadDocument.jsx";
import {Documents} from "./components/Douments/Documnets.jsx";
import logo from './assets/surbhi-document-store-high-logo-transparent.png'
import Lottie from "lottie-react";
import loadingAnimation from "./assets/loading.json";

const Layout = ({ user, onLogout }) => (
    <div className="min-h-screen bg-[#E9EFEC] text-[#16423C]">
        <Header user={user} onLogout={onLogout} />
        <main className="container mx-auto">
            <Outlet />
        </main>
    </div>
);

const AuthLayout = () => (
    <div className="min-h-screen bg-[#E9EFEC] text-[#16423C]">
        <div className="px-4 py-8">
            <img src={logo} className="w-48"/>
        </div>
        <main className="container mx-auto p-4">
            <Outlet />
        </main>
    </div>
);

const ProtectedRoute = ({ children }) => {
    const user = auth.currentUser;
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-[#E9EFEC]">
            <Lottie
                animationData={loadingAnimation}
                loop={true}
                style={{width: 100, height: 100}}
            />
        </div>;
    }

    return (
        <Router>
            <Routes>
                <Route element={<AuthLayout/>}>
                    <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
                        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignUp />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                    </Route>

                    <Route element={<Layout user={user} onLogout={handleLogout} />}>
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/upload-document" element={<ProtectedRoute><UploadDocument /></ProtectedRoute>} />
                        <Route path="/my-document" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
                    </Route>

                    <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
    );
}

export default App;