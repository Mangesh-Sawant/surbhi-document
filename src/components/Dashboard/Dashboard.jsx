// src/components/Dashboard.jsx
import React from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const DashboardCard = ({ to, title, description, icon }) => (
    <Link to={to} className="card-link">
        <motion.div
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 border border-[#C4DAD2] hover:border-[#6A9C89]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="flex items-center mb-4">
                {icon}
                <h3 className="text-xl font-semibold text-[#16423C] ml-3">{title}</h3>
            </div>
            <p className="text-[#6A9C89]">{description}</p>
        </motion.div>
    </Link>
);

const Dashboard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
        >
            <h2 className="text-3xl font-bold text-[#16423C] mb-8">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    to="/upload-document"
                    title="Upload Document"
                    description="Click to upload a new document"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#6A9C89]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>}
                />
                <DashboardCard
                    to="/my-document"
                    title="My Documents"
                    description="View and manage your documents"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#6A9C89]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>}
                />
                <DashboardCard
                    to="#"
                    title="Analytics"
                    description="View document analytics and insights"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#6A9C89]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>}
                />
            </div>
        </motion.div>
    );
};

export default Dashboard;