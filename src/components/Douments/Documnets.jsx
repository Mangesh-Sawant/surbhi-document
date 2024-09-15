import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../Auth/firebase.js';
import { Link } from 'react-router-dom';

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
        <div className="bg-white shadow-md rounded-lg p-6 m-4 relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#16423C] truncate w-3/4" title={resume.name}>{resume.name}</h3>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-[#6A9C89] hover:text-[#16423C] bg-transparent"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
            </div>
            {isMenuOpen && (
                <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
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
                </div>
            )}
            <p className="text-[#6A9C89] mb-2">Created: {new Date(resume.createdAt.toDate()).toLocaleString()}</p>
            <div className="flex-grow mb-4">
                <iframe
                    src={`${resume.url}#view=FitH`}
                    className="w-full h-64 border rounded"
                    title={resume.name}
                />
            </div>
            {isEditing ? (
                <div className="mb-4">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="border rounded px-2 py-1 w-full mb-2"
                    />
                    <button
                        onClick={handleUpdate}
                        className="bg-[#6A9C89] text-white px-3 py-1 rounded hover:bg-[#16423C] w-full"
                    >
                        Save
                    </button>
                </div>
            ) : (
                <a
                    href={resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6A9C89] hover:text-[#16423C]"
                >
                    View Full Resume
                </a>
            )}
        </div>
    );
};

const Documents = () => {
    const [resumes, setResumes] = useState([]);

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
        }, (error) => {
            console.error("Error fetching resumes:", error);
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
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[#16423C]">Uploaded Resumes</h2>
                <Link
                    to="/upload-document"
                    className="bg-[#6A9C89] text-white px-4 py-2 rounded hover:bg-[#16423C] transition duration-300"
                >
                    Upload New Resume
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resumes.map(resume => (
                    <ResumeCard
                        key={resume.id}
                        resume={resume}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                    />
                ))}
            </div>
        </div>
    );
};

export default Documents;