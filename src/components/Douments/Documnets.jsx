import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../Auth/firebase.js';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeCard = ({ resume, onDelete, onUpdate }) => {
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
            <div className="flex justify-between items-center mb-4">
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
            <div className="hidden sm:block flex-grow mb-4">
                <iframe
                    src={`${resume.url}#view=FitH`}
                    className="w-full h-48 sm:h-64 border rounded"
                    title={resume.name}
                />
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

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-t-2 border-b-2 border-[#6A9C89]"></div>
    </div>
);

const Documents = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const resumesCollection = collection(db, 'resumes');
        const resumesQuery = query(
            resumesCollection,
            where('userId', '==', auth.currentUser.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(resumesQuery, (querySnapshot) => {
            const resumeList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setResumes(resumeList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching resumes:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'resumes', id));
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const handleUpdate = async (id, newName) => {
        try {
            await updateDoc(doc(db, 'resumes', id), { name: newName });
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-[#16423C] mb-4 sm:mb-0">Uploaded Resumes</h2>
                <Link
                    to="/upload-document"
                    className="bg-[#6A9C89] text-white px-4 py-2 rounded hover:bg-[#16423C] transition duration-300 w-full sm:w-auto text-center text-sm sm:text-base"
                >
                    Upload New Resume
                </Link>
            </div>
            {loading ? (
                <LoadingSpinner />
            ) : (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {resumes.map(resume => (
                        <motion.div
                            key={resume.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ResumeCard
                                resume={resume}
                                onDelete={handleDelete}
                                onUpdate={handleUpdate}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default Documents;