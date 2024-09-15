// firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,signOut } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import {
    initializeFirestore,
    enableMultiTabIndexedDbPersistence,
    connectFirestoreEmulator,
    setLogLevel,
    persistentLocalCache,
    persistentSingleTabManager
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDEtqnIpIGWn-AKkula5FgrLUmckrdINuY",
    authDomain: "surbhi-documentation.firebaseapp.com",
    projectId: "surbhi-documentation",
    storageBucket: "surbhi-documentation.appspot.com",
    messagingSenderId: "665040954278",
    appId: "1:665040954278:web:8bd686590d2d46a9dae567",
    measurementId: "G-V3ZB5QNJ3D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = getAnalytics(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Firestore with persistent cache and custom size
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentSingleTabManager({
            forceOwnership: true
        }),
        cacheSizeBytes: 100 * 1024 * 1024 // 100 MB
    })
});

// Enable debug logging
setLogLevel('debug');

// Function to enable multi-tab persistence
const enablePersistence = async () => {
    try {
        await enableMultiTabIndexedDbPersistence(db);
        console.log("Multi-tab persistence enabled successfully");
    } catch (err) {
        if (err.code === 'failed-precondition') {
            // console.warn('Multi-tab persistence failed to enable: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
            // console.warn('Multi-tab persistence failed to enable: Browser not supported');
        } else {
            // console.error('Error enabling multi-tab persistence:', err);
        }
    }
};

// Connect to Firestore emulator if in development
if (process.env.NODE_ENV === 'development') {
    connectFirestoreEmulator(db, 'localhost', 8080);
    // console.log('Connected to Firestore emulator');
}

// Initialize Firebase Authentication
const auth = getAuth(app);
const logoutUser = () => {
    return signOut(auth);
};

// Enable persistence when initializing
enablePersistence();

// Export the initialized services and utility functions
export {
    app,
    db,
    auth,
    analytics,
    logoutUser
};