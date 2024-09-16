import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import {AnimatePresence} from "framer-motion";

export const Documents = ({ resume, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(resume.name);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleUpdate = () => {
        onUpdate(resume.id, newName);
        setIsEditing(false);
        setIsMenuOpen(false);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-3 sm:p-6 m-2 sm:m-4 relative overflow-hidden">
            <div className="flex flex-wrap justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-[#16423C] truncate w-full sm:w-3/4 mb-2 sm:mb-0" title={resume.name}>{resume.name}</h3>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-[#6A9C89] hover:text-[#16423C] bg-transparent"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
            </div>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                    >
                        <button
                            onClick={() => {
                                setIsEditing(true);
                                setIsMenuOpen(false);
                            }}
                            className="block px-4 py-2 text-sm text-[#16423C] hover:bg-[#C4DAD2] w-full text-left"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                onDelete(resume.id);
                                setIsMenuOpen(false);
                            }}
                            className="block px-4 py-2 text-sm text-[#16423C] hover:bg-[#C4DAD2] w-full text-left"
                        >
                            Delete
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            <p className="text-sm sm:text-base text-[#6A9C89] mb-2">Created: {new Date(resume.createdAt.toDate()).toLocaleString()}</p>
            <div className="flex-grow mb-4 h-64">
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                    <Viewer fileUrl={resume.url} />
                </Worker>
            </div>
            {isEditing ? (
                <div className="mb-4">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="border rounded px-2 py-1 w-full mb-2 text-sm sm:text-base"
                    />
                    <button
                        onClick={handleUpdate}
                        className="bg-[#6A9C89] text-white px-3 py-1 rounded hover:bg-[#16423C] w-full text-sm sm:text-base"
                    >
                        Save
                    </button>
                </div>
            ) : (
                <a
                    href={resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base text-[#6A9C89] hover:text-[#16423C]"
                >
                    View Full Resume
                </a>
            )}
        </div>
    );
};