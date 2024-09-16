// src/components/UploadDocument.js
import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db, auth } from '../Auth/firebase.js';
import Lottie from 'lottie-react'
import { motion } from 'framer-motion';
import animationData from '../../assets/upload-file.json';

const UploadDocument = () => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setUploadStatus('');
        } else {
            setFile(null);
            setUploadStatus('Please select a PDF file.');
        }
    };

    const handleUpload = useCallback(async () => {
        if (!file) {
            setUploadStatus('Please select a file first.');
            return;
        }

        setIsUploading(true);
        const storageRef = ref(storage, `resumes/${auth.currentUser.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                console.error('Upload error:', error);
                setUploadStatus('Upload failed. Please try again.');
                setIsUploading(false);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await addDoc(collection(db, 'resumes'), {
                        name: file.name,
                        url: downloadURL,
                        createdAt: new Date(),
                        userId: auth.currentUser.uid
                    });
                    setUploadStatus('Resume uploaded successfully!');
                    setFile(null);
                    setProgress(0);
                    setIsUploading(false);
                    console.log("Navigating to '/my-document' after successful upload.");
                    navigate('/my-document');
                } catch (error) {
                    console.error('Error during upload:', error);
                    setUploadStatus('Upload failed. Please try again.');
                    setIsUploading(false);
                }
            }
        );
    }, [file, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#E9EFEC] p-4 sm:mt-40">
            <motion.div
                className="w-full max-w-4xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-end mb-4">
                    <Link
                        to="/my-document"
                        className="bg-[#16423C] text-white py-2 px-4 rounded-md text-sm hover:bg-[#6A9C89] transition duration-300"
                    >
                        See All Documents
                    </Link>
                </div>
                <motion.div
                    className="bg-white rounded-lg shadow-md p-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col md:flex-row justify-center items-center w-full gap-7">
                        <div className="w-1/5 md:w-1/2 mb-8 md:mb-0">
                            <Lottie
                                animationData={animationData}
                                loop={true}
                                style={{width: '100%', maxWidth: '300px', margin: '0 auto'}}
                            />
                        </div>
                        <div className="w-full md:w-1/2">
                            <h2 className="text-xl md:text-2xl font-bold text-[#16423C] mb-4 md:mb-6 text-center">Upload Resume</h2>
                            <motion.div
                                className="mb-6"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <label htmlFor="file-upload" className="block text-[#16423C] mb-2">Select PDF file:</label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="w-full text-[#16423C] text-sm md:text-base file:mr-2 md:file:mr-4 file:py-1 md:file:py-2 file:px-2 md:file:px-4 file:rounded-md file:border-0 file:text-xs md:file:text-sm file:font-semibold file:bg-[#C4DAD2] file:text-[#16423C] hover:file:bg-[#6A9C89]"
                                    disabled={isUploading}
                                />
                            </motion.div>
                            <motion.button
                                className="w-full bg-[#6A9C89] text-white py-2 px-4 rounded-md text-sm md:text-base hover:bg-[#16423C] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-3 md:mb-4"
                                onClick={handleUpload}
                                disabled={!file || isUploading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isUploading ? 'Uploading...' : 'Upload Resume'}
                            </motion.button>
                            {progress > 0 && (
                                <motion.div
                                    className="mt-3 md:mt-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="w-full bg-[#C4DAD2] rounded-full h-2">
                                        <motion.div
                                            className="bg-[#6A9C89] h-2 rounded-full"
                                            style={{ width: `${progress}%` }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                    <p className="text-[#16423C] text-xs md:text-sm mt-1 md:mt-2">Upload Progress: {progress.toFixed(2)}%</p>
                                </motion.div>
                            )}
                            {uploadStatus && (
                                <motion.p
                                    className="mt-3 md:mt-4 text-center text-[#16423C] text-sm md:text-base"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {uploadStatus}
                                </motion.p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default UploadDocument;