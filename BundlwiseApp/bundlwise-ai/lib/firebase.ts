import { Platform } from 'react-native';
import { getApp, initializeApp } from '@react-native-firebase/app';

// Firebase configuration for web platform
const firebaseConfig = {
    apiKey: "AIzaSyCrLeAMUgKFYPCVII6fqIkZmvyCdy_HyHw",
    authDomain: "bundlwise-ai.firebaseapp.com",
    projectId: "bundlwise-ai",
    storageBucket: "bundlwise-ai.firebasestorage.app",
    messagingSenderId: "637563703297",
    appId: "1:637563703297:web:e4a44488cdfdfcc567b000"
  };

// Initialize Firebase for web platform only
if (Platform.OS === 'web') {
  initializeApp(firebaseConfig);
}

// Export the Firebase app instance
export const firebaseApp = getApp();

// Export Firebase services
export { default as auth } from '@react-native-firebase/auth';
export { default as crashlytics } from '@react-native-firebase/crashlytics'; 