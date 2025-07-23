import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Define the user type
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Convert Firebase user to our User type
const convertFirebaseUser = (firebaseUser: FirebaseAuthTypes.User | null): User | null => {
  if (!firebaseUser) return null;
  
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
  };
};

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      console.log('AuthProvider: Firebase auth state changed:', firebaseUser?.email);
      const user = convertFirebaseUser(firebaseUser);
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('AuthProvider: Starting Google Sign-In (Mock)');
      setLoading(true);
      
      // For demo purposes, we'll create a mock user
      // In production, this would be replaced with actual Google Sign-In
      const mockUser = {
        uid: 'mock-google-user-' + Date.now(),
        email: 'demo.user@gmail.com',
        displayName: 'Demo Google User',
        photoURL: 'https://via.placeholder.com/150',
      };
      
      console.log('AuthProvider: Setting mock Google user:', mockUser);
      setUser(mockUser);
      setLoading(false);
      
      // In a real implementation, you would:
      // 1. Use Google Sign-In to get user credentials
      // 2. Create Firebase credential with Google token
      // 3. Sign in to Firebase with the credential
      // 4. Firebase auth state listener will handle the rest
      
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      setLoading(false);
      throw new Error(error.message || 'Google Sign-In failed');
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthProvider: Signing out');
      setLoading(true);
      
      // Sign out from Firebase
      await auth().signOut();
      
      console.log('AuthProvider: Sign out successful');
      setLoading(false);
    } catch (error) {
      console.error('Sign Out Error:', error);
      setLoading(false);
      throw error;
    }
  };

  console.log('AuthProvider: Current state - user:', user, 'loading:', loading);

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
